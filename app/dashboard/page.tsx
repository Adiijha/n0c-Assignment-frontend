"use client";

import React, { useEffect, useState, useMemo } from "react";
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

const filteredData = useMemo(() => {
  if (startTimestamp && endTimestamp) {
    const start = new Date(startTimestamp).getTime();
    const end = new Date(endTimestamp).getTime();
    return sensorData.filter((item) => {
      const time = new Date(item.timestamp).getTime();
      return time >= start && time <= end;
    });
  }

  return sensorData.slice(-30);
}, [sensorData, startTimestamp, endTimestamp]);





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
    <div className="min-h-screen bg-black text-gray-300 flex flex-col">
  <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
    </header>

    {loading ? (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">Fetching sensor data...</p>
      </div>
    ) : error ? (
      <p className="text-red-500 text-center text-base mt-20">Error: {error}</p>
    ) : (
      <>
        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          <div className="bg-gray-850 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
            <h2 className="flex items-center gap-3 text-rose-400 text-lg sm:text-xl font-semibold mb-4 tracking-wide">
              <Thermometer className="w-5 h-5 sm:w-6 sm:h-6" />
              Temperature
            </h2>
            <div className="h-64 sm:h-72 overflow-x-auto">
              <Line data={temperatureData} options={chartOptions("Average Temperature Over Time")} />
            </div>
          </div>

          <div className="bg-gray-850 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
            <h2 className="flex items-center gap-3 text-blue-400 text-lg sm:text-xl font-semibold mb-4 tracking-wide">
              <Gauge className="w-5 h-5 sm:w-6 sm:h-6" />
              Pressure
            </h2>
            <div className="h-64 sm:h-72 overflow-x-auto">
              <Line data={pressureData} options={chartOptions("Average Pressure Over Time")} />
            </div>
          </div>
        </section>

        {/* Filter */}
        <section className="w-full max-w-4xl mx-auto bg-[#121212] rounded-xl p-4 sm:p-6 shadow-lg border border-purple-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyFilter();
            }}
            className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex-1">
              <label htmlFor="start-time" className="text-xs uppercase mb-1 block text-purple-400 font-semibold tracking-widest">
                Start Time
              </label>
              <input
                id="start-time"
                type="datetime-local"
                value={tempStart}
                max={tempEnd}
                onChange={(e) => setTempStart(e.target.value)}
                className="w-full bg-transparent border border-purple-900 rounded-md text-purple-400 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="end-time" className="text-xs uppercase mb-1 block text-purple-400 font-semibold tracking-widest">
                End Time
              </label>
              <input
                id="end-time"
                type="datetime-local"
                value={tempEnd}
                min={tempStart}
                onChange={(e) => setTempEnd(e.target.value)}
                className="w-full bg-transparent border border-purple-900 rounded-md text-purple-400 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto mt-2 sm:mt-0 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-[#E0F7F7] font-semibold rounded-md shadow-md transition"
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
