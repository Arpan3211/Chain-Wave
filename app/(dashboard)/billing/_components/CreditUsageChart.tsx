"use client";

import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStacked, Layers2 } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, BarChart, Bar } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageInPeriod>>;

const chartConfig = {
  success: {
    label: "Successfull Phases credits",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Phases credits",
    color: "hsl(var(--chart-1))",
  },
};

export function CreditUsageChart({
  data,
  description,
  title,
}: {
  data: ChartData;
  description:string,
  title:string,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStacked className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              fillOpacity={0.8}
              radius={[0,0,4,4]}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              stackId={"a"}
              dataKey={"success"}
            />
            <Bar
              fillOpacity={0.8}
              radius={[4,4,0,0]}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              stackId={"a"}
              dataKey={"failed"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
