import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProgressChartProps {
  data: { day: string; completed: number }[];
  colorTheme: string;
}

export function ProgressChart({ data, colorTheme }: ProgressChartProps) {
  return (
    <div className={`p-4 bg-white rounded-lg shadow-md border border-${colorTheme}-200`}>
      <h3 className={`text-lg font-semibold mb-4 text-${colorTheme}-700`}>Weekly Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill={`var(--${colorTheme}-500)`} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

