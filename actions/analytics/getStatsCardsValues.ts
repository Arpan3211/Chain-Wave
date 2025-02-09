"use server";

import { PeriodToDataRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/anaytics";
import { workflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

const { COMPLETED, FAILED } = workflowExecutionStatus;

export async function GetStatsCardsValues(period: Period) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("unathenticated");
  }

  const dataRange = PeriodToDataRange(period);
  const executions = await prisma.workflowExecution.findMany({
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
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: { creditsConsumed: true },
      },
    },
  });

  const stats = {
    workflowExecutions: 0,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + execution.creditsConsumed,
    0
  );
  stats.phaseExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  );

  return stats;
}
