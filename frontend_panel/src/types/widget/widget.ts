// types/widget/widget.ts
export interface WidgetProps {
  type: "stock" | "demand" | "fillRate";
  value: number;
}
