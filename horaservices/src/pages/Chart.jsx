"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("DAILY_UNIQUE_VISITORS");
    if (!raw) return;

    const stored = JSON.parse(raw);

    const formatted = Object.keys(stored)
      .sort()
      .map((date) => {
        const android = Object.keys(stored[date].android || {}).length;
        const ios = Object.keys(stored[date].ios || {}).length;
        const desktop = Object.keys(stored[date].desktop || {}).length;

        return {
          date,
          total: android + ios + desktop,
          android,
          ios,
          desktop
        };
      });

    setData(formatted);
  }, []);

  return (
    <div style={{ padding: 24 , width:"50%" , margin: "0 auto"}}>
      <h2>📊 Daily Unique Visitors</h2>

      {data.length === 0 ? (
        <p>No data available yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" strokeWidth={3} />
            <Line type="monotone" dataKey="android" />
            <Line type="monotone" dataKey="ios" />
            <Line type="monotone" dataKey="desktop" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Dashboard;
