"use client";

import React, { useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
  duplicatedWorkflowSchema,
  duplicatedWorkflowSchemaType,
} from "@/schema/workflow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import { cn } from "@/lib/utils";

const DuplicateWorkflowDialog = ({ workflowId }: { workflowId?: string }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<duplicatedWorkflowSchemaType>({
    resolver: zodResolver(duplicatedWorkflowSchema),
    defaultValues: {
workflowId,

    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated", { id: "duplicated-workflow" });
      setOpen((prev)=> !prev)
    },
    onError: () => {
      toast.error("Failed to duplicated workflow", { id: "duplicated-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: duplicatedWorkflowSchemaType) => {
      toast.loading("Duplicating workflow...", { id: "duplicated-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={(open)=>{
        form.reset();
        setOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button 
        variant={"ghost"}
        size={"icon"}
        className={cn("ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100")}
        >
<CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer"/>

        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Duplicate workflow"
        />
        <div className="p-6">
          {/* Wrap the form with FormProvider */}
          <FormProvider {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your workflow does.
                      <br />
                      This is optional but can help you remember the
                      workflow&apos;s purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateWorkflowDialog;
