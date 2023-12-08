import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Legend } from "recharts";


export function IntroChart({data}) {
  const keys = Object.keys(data[0]);

  return (
    <BarChart width={600} height={250} data={data}>
      <XAxis dataKey={keys[0]} />
      <YAxis hide="true" />
      <Bar name="분리배출" dataKey={keys[1]} fill="#82ca9d" /> 
      {keys[2] && (
        <>
          <Bar name="혼합배출" dataKey={keys[2]} fill="#8884d8" />
          <Legend />
        </>
      )}
    </BarChart>
  );
}

export function CalendarChart ({data}) {
  const keys = Object.keys(data[0]);

  return (
      <BarChart width={1000} height={300} data={data}>
        <XAxis dataKey={keys[0]}/>
        <YAxis domain={['dataMin - 0.0', 'dataMax + 1.0']}/>
        <Bar name="일별데이터" dataKey={keys[1]} fill="#82ca9d" /> 
      </BarChart>
  );
}
