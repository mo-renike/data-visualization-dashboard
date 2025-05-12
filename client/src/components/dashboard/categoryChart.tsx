import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface CategoryChartProps {
  data: CategoryData[];
  total: number;
}

export default function CategoryChart({ data, total }: CategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            data: data.map((item) => item.value),
            backgroundColor: data.map((item) => item.color),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 12,
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataIndex = context.dataIndex;
                const item = data[dataIndex];
                return `${item.name}: ${item.percentage}%`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, total]);

  return (
    <div className="relative w-full flex items-center mt-8 justify-center">
      <canvas ref={chartRef}></canvas>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-sm text-gray-500">Total</div>
        <div className="text-2xl text-[#0F172A] font-bold">{total}</div>
      </div>
    </div>
  );
}
