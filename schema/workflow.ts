import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(80).optional(),
});

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;

export const duplicatedWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string(),
});

export type duplicatedWorkflowSchemaType = z.infer<
  typeof duplicatedWorkflowSchema
>;
