import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { KPI } from "../data/datatype";

export interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  color: string;
  payload: KPI;
  name?: string;
  stroke?: string;
  strokeWidth?: number;
  type?: string;
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}
