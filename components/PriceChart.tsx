"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getPriceHistory } from "@/app/actions";
import { Loader2 } from "lucide-react";

const PLATFORM_COLORS: Record<string, string> = {
  Amazon: "#FF9900",
  Walmart: "#0071CE",
  BestBuy: "#0046BE",
  Target: "#CC0000",
  eBay: "#E53238",
  Web: "#FA5D19",
};

// Define the shape of the data Recharts expects for multiple lines
// e.g., { date: "10/12/2023", Amazon: 199.99, BestBuy: 205.00 }
type ChartDataPoint = {
  date: string;
  [platform: string]: string | number;
};

interface PriceChartProps {
  productId: string;
}

export default function PriceChart({ productId }: PriceChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const history: any[] = await getPriceHistory(productId);

      if (!history || history.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      // Identify unique platforms for this product
      const uniquePlatforms = [
        ...new Set(
          history.map((item) => item.product_links.platform as string),
        ),
      ];
      setPlatforms(uniquePlatforms);

      // Reshape data for Recharts (grouping by date)
      const groupedData = history.reduce<ChartDataPoint[]>((acc, item) => {
        const dateStr = new Date(item.checked_at).toLocaleDateString();
        const platform = item.product_links.platform;
        const price = Number(item.price);

        const existingEntry = acc.find((entry) => entry.date === dateStr);

        if (existingEntry) {
          existingEntry[platform] = price;
        } else {
          acc.push({ date: dateStr, [platform]: price });
        }
        return acc;
      }, []);

      setData(groupedData);
      setLoading(false);
    }

    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500 w-full">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 w-full text-sm">
        No price history yet. Check back after the first daily update!
      </div>
    );
  }

  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold mb-4 text-gray-700">
        Price History
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickMargin={10}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ fontWeight: "bold" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />

          {platforms.map((platform) => (
            <Line
              key={platform}
              type="monotone"
              dataKey={platform}
              name={platform}
              stroke={PLATFORM_COLORS[platform] || PLATFORM_COLORS.Web}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
