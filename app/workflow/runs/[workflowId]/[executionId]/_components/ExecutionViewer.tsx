"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { Separator } from "@/components/ui/separator";
import { workflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CalculatorIcon, CircleDashedIcon, ClockIcon, CoinsIcon, LucideIcon, WorkflowIcon } from "lucide-react";
import React, { ReactNode } from "react";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

const ExecutionViewer = ({ initialData }: { initialData: ExecutionData }) => {
  const query = useQuery({
    queryKey: ["execution", initialData?.id], // Corrected from `querykey` to `queryKey`
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === workflowExecutionStatus.RUNNING ? 1000 : false,
  });

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label={"Status"}
            value={query.data?.status}
          />
          <ExecutionLabel
            icon={CalculatorIcon}
            label={"Started At"}
            value={
              query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data?.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label={"Duration"}
            value={"TODO"}
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label={"Credits consumed"}
            value={"TODO"}
          />
        </div>
        <Separator/>
        <div>
            <div>
                <WorkflowIcon size={20}/>
            </div>
        </div>
      </aside>
    </div>
  );
};

export default ExecutionViewer;

function ExecutionLabel({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex ittems-center gap-2 ">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}
