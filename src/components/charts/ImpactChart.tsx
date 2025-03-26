
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Antibiotics", value: 35 },
  { name: "Painkillers", value: 25 },
  { name: "Vitamins", value: 15 },
  { name: "Insulin", value: 10 },
  { name: "Others", value: 15 },
];

const COLORS = ["#60a5fa", "#f97316", "#10b981", "#8b5cf6", "#a3a3a3"];

interface ImpactChartProps {
  title: string;
  className?: string;
}

const ImpactChart: React.FC<ImpactChartProps> = ({ title, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} units`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ImpactChart;
