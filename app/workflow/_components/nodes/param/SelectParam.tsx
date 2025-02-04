"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";

type OptionType = {
  label: string;
  value: string;
};
const SelectParam = ({ param,updateNodeParamValue,value }: ParamProps) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-sm flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select onValueChange={(value)=>updateNodeParamValue(value)} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: OptionType) => {
              <SelectItem key={option.label} value={option.value}>
                {option.label}
              </SelectItem>;
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectParam;
