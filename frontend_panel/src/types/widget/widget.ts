// src/types/widget/widget.ts
export interface WidgetProps {
  type: "totalCourses" | "activeCourses" | "activityRate" | "universities";
  value: number;
}
