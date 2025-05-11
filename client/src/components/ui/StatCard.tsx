import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  percentChange?: number;
  prefix?: string;
}

export default function StatCard({
  title,
  value,
  percentChange,
  prefix = "",
}: StatCardProps) {
  const isPositive = percentChange && percentChange > 0;

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {percentChange !== undefined && (
          <div
            className={`flex items-center text-xs ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span>{Math.abs(percentChange)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
