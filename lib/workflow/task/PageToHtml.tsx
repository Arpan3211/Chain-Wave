import { TaskParamType, TaskType } from "@/types/task";
import { workflowTask } from "@/types/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get html from page",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 5,
  inputs: [
    // {
    //   name: "html",
    //   type: TaskParamType.STRING,
    //   required: false,
    //   hiddeHandle:true,
    // },
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ],
  outputs: [
    { name: "html", type: TaskParamType.STRING },
    { name: "Web page", type: TaskParamType.BROWSER_INSTANCE },
  ],
} satisfies workflowTask;
