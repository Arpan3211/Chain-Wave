import { cn } from "@/lib/utils";
import { workflowExecutionStatus } from "@/types/workflow";
import React from "react";

const ExecutionStatusIndicator = ({
  status,
}: {
  status: workflowExecutionStatus;
}) => {
  const indicatorColors: Record<workflowExecutionStatus, string> = {
    PENDING: "bg-slate-400",
    RUNNING: "bg-yellow-400",
    FAILED: "bg-red-400",
    COMPLETED: "bg-emerald-600",
  };

  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
};

export default ExecutionStatusIndicator;
