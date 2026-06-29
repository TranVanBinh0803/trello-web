import type { SxProps, Theme } from "@mui/material";
import { CardLabelType, ChecklistType } from "~/types/card";

export const LABEL_OPTIONS: CardLabelType[] = [
  { _id: "label-green", title: "Done", color: "#4bce97" },
  { _id: "label-yellow", title: "Priority", color: "#f5cd47" },
  { _id: "label-orange", title: "Design", color: "#fea362" },
  { _id: "label-red", title: "Bug", color: "#f87168" },
  { _id: "label-purple", title: "Review", color: "#9f8fef" },
  { _id: "label-blue", title: "Feature", color: "#579dff" },
];

export const completedRadioSx: SxProps<Theme> = (theme) => ({
  position: "relative",
  overflow: "visible",
  color: "text.secondary",
  "& .MuiSvgIcon-root": {
    position: "relative",
    zIndex: 1,
  },
  "&.Mui-checked": {
    color: "success.main",
  },
  "&.Mui-checked::before": {
    content: '""',
    position: "absolute",
    inset: 6,
    borderRadius: "50%",
    border: `2px solid ${theme.palette.success.light}`,
    animation: "completedRadioPulse 900ms ease-out forwards",
  },
  "&.Mui-checked::after": {
    content: '""',
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: `conic-gradient(
      from 0deg,
      transparent 0deg 26deg,
      ${theme.palette.success.main} 26deg 34deg,
      transparent 34deg 70deg,
      ${theme.palette.success.main} 70deg 78deg,
      transparent 78deg 116deg,
      ${theme.palette.success.main} 116deg 124deg,
      transparent 124deg 160deg,
      ${theme.palette.success.main} 160deg 168deg,
      transparent 168deg 206deg,
      ${theme.palette.success.main} 206deg 214deg,
      transparent 214deg 250deg,
      ${theme.palette.success.main} 250deg 258deg,
      transparent 258deg 296deg,
      ${theme.palette.success.main} 296deg 304deg,
      transparent 304deg 340deg,
      ${theme.palette.success.main} 340deg 348deg,
      transparent 348deg 360deg
    )`,
    animation: "completedRadioSpark 900ms ease-out forwards",
    zIndex: 0,
  },
  "@keyframes completedRadioPulse": {
    "0%": { opacity: 0.8, transform: "scale(0.7)" },
    "100%": { opacity: 0, transform: "scale(1.9)" },
  },
  "@keyframes completedRadioSpark": {
    "0%": { opacity: 0.9, transform: "scale(0.55) rotate(0deg)" },
    "100%": { opacity: 0, transform: "scale(1.5) rotate(22deg)" },
  },
});

export const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

export const getChecklistProgress = (checklists: ChecklistType[] = []) => {
  const items = checklists.flatMap((checklist) => checklist.items);
  const completedItems = items.filter((item) => item.completed).length;
  const totalItems = items.length;

  return {
    completedItems,
    totalItems,
    value: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
  };
};
