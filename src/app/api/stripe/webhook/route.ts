import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          // Atualizar plano do usuário para premium
          await supabase
            .from('user_profiles')
            .upsert({
              user_id: userId,
              plan_type: 'premium',
              stripe_customer_id: session.customer,
              subscription_id: session.subscription,
              updated_at: new Date().toISOString(),
            });
        }
        break;

      case 'invoice.payment_succeeded':
        // Pagamento recorrente bem-sucedido
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          // Manter plano premium ativo
          await supabase
            .from('user_profiles')
            .update({
              plan_type: 'premium',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', invoice.customer);
        }
        break;

      case 'invoice.payment_failed':
        // Pagamento falhou - talvez downgrade para free
        const failedInvoice = event.data.object as Stripe.Invoice;
        if (failedInvoice.customer) {
          await supabase
            .from('user_profiles')
            .update({
              plan_type: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', failedInvoice.customer);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}