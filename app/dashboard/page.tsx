"use client";

import React, { useEffect, useState } from "react";
import { dataFetch } from "../lib/api";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Thermometer, Gauge } from "lucide-react";
import { Loader2 } from "lucide-react";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type AverageDataItem = {
  timestamp: string;
  averageTemperature: string;
  averagePressure: string;
};

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<AverageDataItem[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const [tempStart, setTempStart] = useState<string>("");
const [tempEnd, setTempEnd] = useState<string>("");

const [startTimestamp, setStartTimestamp] = useState<string | null>(null);
const [endTimestamp, setEndTimestamp] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await dataFetch();
      setSensorData(response);

      if (response.length > 0) {
        const first = response[0].timestamp.substring(0, 16);
        const last = response[response.length - 1].timestamp.substring(0, 16);

        setTempStart(first);
        setTempEnd(last);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

const applyFilter = () => {
  if (tempStart && tempEnd && tempStart <= tempEnd) {
    setStartTimestamp(tempStart);
    setEndTimestamp(tempEnd);
  }
};

const filteredData = sensorData.filter((item) => {
  if (!startTimestamp || !endTimestamp) {
    return true;
  }
  const time = new Date(item.timestamp).getTime();
  const start = new Date(startTimestamp).getTime();
  const end = new Date(endTimestamp).getTime();
  return time >= start && time <= end;
});



const labels = filteredData.map((item) =>
  new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
);


  const temperatureData = {
    labels,
    datasets: [
      {
        label: "Avg Temp (°C)",
        data: filteredData.map((item) => parseFloat(item.averageTemperature)),
        borderColor: "#FF6B6B",
        backgroundColor: "rgba(255, 107, 107, 0.2)",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const pressureData = {
    labels,
    datasets: [
      {
        label: "Avg Pressure (Pa)",
        data: filteredData.map((item) => parseFloat(item.averagePressure)),
        borderColor: "#4D96FF",
        backgroundColor: "rgba(77, 150, 255, 0.2)",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const chartOptions = (title: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ddd",
          font: { size: 12, weight: 600 },
        },
      },
      title: {
        display: true,
        text: title,
        color: "#eee",
        font: { size: 18, weight: 700 },
        padding: { top: 12, bottom: 16 },
      },
      tooltip: {
        backgroundColor: "#222",
        titleColor: "#fff",
        bodyColor: "#ccc",
        cornerRadius: 6,
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: "#bbb", maxRotation: 0, minRotation: 0, font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { stepSize: 2, color: "#bbb", beginAtZero: true, font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-black text-gray-300 flex">
      <main className="flex-1 max-w-7xl mx-auto p-8">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 select-none text-2xl">Welcome back 👋</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="mt-4 text-lg">Fetching sensor data...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-base mt-20">Error: {error}</p>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-850 rounded-xl p-6 shadow-lg border border-gray-700">
                <h2 className="flex items-center gap-3 text-rose-400 text-xl font-semibold mb-6 tracking-wide">
                  <Thermometer className="w-6 h-6" />
                  Temperature
                </h2>
                <div className="h-72">
                  <Line data={temperatureData} options={chartOptions("Average Temperature Over Time")} />
                </div>
              </div>

              <div className="bg-gray-850 rounded-xl p-6 shadow-lg border border-gray-700">
                <h2 className="flex items-center gap-3 text-blue-400 text-xl font-semibold mb-6 tracking-wide">
                  <Gauge className="w-6 h-6" />
                  Pressure
                </h2>
                <div className="h-72">
                  <Line data={pressureData} options={chartOptions("Average Pressure Over Time")} />
                </div>
              </div>
            </section>

<section className="max-w-3xl mx-auto h-28 bg-[#121212] rounded-xl p-6 shadow-lg border border-purple-900 flex flex-col justify-center">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      applyFilter();
    }}
    className="flex flex-col sm:flex-row items-center justify-between gap-8"
  >
    <div className="flex flex-col w-full sm:w-1/2">
      <label
        htmlFor="start-time"
        className="text-xs uppercase mb-1 tracking-widest text-purple-400 font-semibold"
      >
        Start Time
      </label>
      <input
        id="start-time"
        type="datetime-local"
        value={tempStart}
        max={tempEnd}
        onChange={(e) => setTempStart(e.target.value)}
        className="bg-transparent border border-purple-900 rounded-md text-purple-400 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-shadow duration-300"
        required
      />
    </div>

    <div className="flex flex-col w-full sm:w-1/2">
      <label
        htmlFor="end-time"
        className="text-xs uppercase mb-1 tracking-widest text-purple-400 font-semibold"
      >
        End Time
      </label>
      <input
        id="end-time"
        type="datetime-local"
        value={tempEnd}
        min={tempStart}
        onChange={(e) => setTempEnd(e.target.value)}
        className="bg-transparent border border-purple-900 rounded-md text-purple-400 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-shadow duration-300"
        required
      />
    </div>

    <button
      type="submit"
      className="mt-4 sm:mt-0 px-10 py-3 bg-purple-600 hover:bg-purple-700 text-[#E0F7F7] font-semibold rounded-md shadow-md transition-colors duration-300"
    >
      Apply
    </button>
  </form>
</section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
