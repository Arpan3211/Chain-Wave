"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  workflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = auth();
  if (!userId) throw new Error("User is not authenticated");

  const { workflowId, flowDefinition } = form;

  const workflow = await prisma.workflow.findUnique({
    where: { userId, id: workflowId },
  });

  if (!workflow) throw new Error("Workflow not found");

  let executionPlan: WorkflowExecutionPlan | null = null;
  let workflowDefinition = flowDefinition;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan)
      throw new Error("No execution plan found in published workflow");

    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    if (!flowDefinition)
      throw new Error("Flow definition is required for unpublished workflows");

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) throw new Error("Invalid flow definition");
    if (!result.executionPlan)
      throw new Error("Failed to generate execution plan");

    executionPlan = result.executionPlan;
  }

  if (!executionPlan) throw new Error("Execution plan could not be determined");

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: workflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) =>
          phase.nodes.map((node) => ({
            userId,
            status: ExecutionPhaseStatus.CREATED,
            number: phase.phase,
            node: JSON.stringify(node),
            name: TaskRegistry[node.data.type]?.label || "Unknown Task",
          }))
        ),
      },
    },
    select: { id: true },
  });

  if (!execution) throw new Error("Workflow execution creation failed");

  ExecuteWorkflow(execution.id);
  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
