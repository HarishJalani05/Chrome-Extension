import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

const productivityMap = {
  "youtube.com": "Unproductive",
  "stackoverflow.com": "Productive",
  "github.com": "Productive",
  "facebook.com": "Unproductive",
  "geeksforgeeks.org": "Productive"
};

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/summary")
      .then(res => {
        const formatted = res.data.map(entry => ({
          site: entry._id,
          timeSpent: entry.totalTime,
          productivity: productivityMap[entry._id] || "Neutral"
        }));
        setData(formatted);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <h1>🧠 Weekly Productivity Report</h1>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="site" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="timeSpent" fill="#8884d8" name="Time (sec)" />
        </BarChart>
      </ResponsiveContainer>

      <table>
        <thead>
          <tr>
            <th>Website</th>
            <th>Time Spent (sec)</th>
            <th>Productivity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((site, index) => (
            <tr key={index}>
              <td>{site.site}</td>
              <td>{site.timeSpent}</td>
              <td className={site.productivity.toLowerCase()}>
                {site.productivity === "Productive" ? "✅" : site.productivity === "Unproductive" ? "❌" : "➖"} {site.productivity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}