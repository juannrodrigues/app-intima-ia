'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ActivityChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  title: string;
  dataKey: string;
  color: string;
}

export function ActivityChart({ data, type, title, dataKey, color }: ActivityChartProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 5, left: -20, bottom: 5 },
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ fill: color, r: 4 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {renderChart()}
      </ResponsiveContainer>
    </Card>
  );
}
