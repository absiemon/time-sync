import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DealLineChart = ({ data }) => {
  return (
    <LineChart width={700} height={400} data={data} >
      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
      <XAxis dataKey="month" minTickGap={10}/>
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="deals" stroke="rgb(3, 201, 215)" strokeWidth={2}/>
    </LineChart>
  );
};

export default DealLineChart;