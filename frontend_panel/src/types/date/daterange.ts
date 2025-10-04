export interface DateRangeChip {
  id: string;
  label: string;
  days: number;
}

export interface DateRangeContextType {
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;
}
