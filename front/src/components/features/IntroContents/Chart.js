import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Legend } from "recharts";


export default function Chart({data}) {
  
  const keys = Object.keys(data[0]);


  return (
    <BarChart width={600} height={250} data={data}>
      <XAxis dataKey={keys[0]} />
      <YAxis hide="true" />
      <Bar name="분리배출" dataKey={keys[1]} fill="#82ca9d" /> 
      {keys[2] && (<Bar name="혼합배출" dataKey={keys[2]} fill="#8884d8" />)}
      {keys[2] && (<Legend />)}
    </BarChart>
  );
}
