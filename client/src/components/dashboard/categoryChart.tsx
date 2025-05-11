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

    // Destroy existing chart
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
            borderWidth: 0,
            // cutout: "70%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const dataPoint = data[context.dataIndex];
                return `${dataPoint.name}: ${dataPoint.percentage}%`;
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
    <div className="relative w-full h-64 flex items-center justify-center">
      <canvas ref={chartRef}></canvas>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-sm text-gray-500">Total</div>
        <div className="text-2xl font-bold">{total}</div>
      </div>
    </div>
  );
}
