"use server";

import { PeriodToDataRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/anaytics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

const { COMPLETED, FAILED } = ExecutionPhaseStatus;
export async function GetCreditsUsageInPeriod(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const dataRange = PeriodToDataRange(period);
  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dataRange.startDate,
        lte: dataRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
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

  executionPhases.forEach((phase) => {
    if (!phase.startedAt) return; // Avoid errors if startedAt is null/undefined

    const date = format(phase.startedAt, dateFormat);
    if (phase.status === COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0;
    }
    if (phase.status === FAILED) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
}
