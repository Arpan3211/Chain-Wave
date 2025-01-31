import { TaskParamType, TaskType } from "@/types/task";
import { workflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: "Website Url",
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hiddeHandle: true,
    },
  ] as const,
  outputs: [
    { name: "web page", type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
} satisfies workflowTask;
