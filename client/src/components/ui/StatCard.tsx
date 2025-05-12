import { ArrowDown, ArrowUp } from "lucide-react";
import { formatNumber } from "../../utils/helper";

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
    <div className="bg-whiterounded-lg px-6 border-r-1 border-[#E2E8F0]">
      <h3 className="text-sm text-gray-500 mb-2 font-semibold">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {percentChange !== undefined && (
          <div
            className={`flex items-center text-xs rounded-xl py-1 px-3  ${
              isPositive
                ? "bg-[#F0FDF4] text-[#24D164]"
                : "text-[#ED4F9D] bg-[#FDF2F8]"
            }`}
          >
            {isPositive ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span className="ml-1 font-semibold">
              {formatNumber(percentChange)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
