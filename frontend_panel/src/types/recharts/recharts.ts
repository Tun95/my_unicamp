import { ChartData } from "../dashboard/dashboard";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value?: number;
    dataKey?: string;
    color?: string;
  }>;
  label?: string;
}
