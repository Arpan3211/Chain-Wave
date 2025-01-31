import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { workflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";

type ExecutorFn<T extends workflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFn<workflowTask & { type: K }>;
};
export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
};
