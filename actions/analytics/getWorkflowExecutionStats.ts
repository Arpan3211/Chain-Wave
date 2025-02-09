"use server";

import { PeriodToDataRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/anaytics";
import { workflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

export async function GetWorkflowExecutionStats(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const dataRange = PeriodToDataRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dataRange.startDate,
        lte: dataRange.endDate,
      },
    },
  });

  const dateFormat = "yyyy-MM-dd"; // Defined missing dateFormat

  const stats: Record<
    string,
    {
      success: number;
      failed: number;
    }
  > = eachDayOfInterval({
    start: dataRange.startDate,
    end: dataRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as Record<string, { success: number; failed: number }>);

  executions.forEach((execution) => {
    if (!execution.startedAt) return; // Avoid errors if startedAt is null/undefined

    const date = format(execution.startedAt, dateFormat);
    if (execution.status === workflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === workflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
