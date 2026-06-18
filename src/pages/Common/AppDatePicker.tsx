import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarMonth } from "@mui/icons-material";

const BASE_INPUT_STYLE = {
  border: "1px solid rgba(0,0,0,0.03)",
  borderRadius: "16px",
  backgroundColor: "#e9e9e9",
  width: "268px",
  height: "48px",
  padding: "0 12px",
  "& fieldset": { border: "none !important" },
  "&:hover fieldset": { border: "none !important" },
  "&.Mui-focused fieldset": { border: "none !important" },
  "&.Mui-disabled": { backgroundColor: "#f5f5f5" },
};

const VARIANT_STYLE = {
  filled: {
    "& .MuiIconButton-root": {
      borderRadius: "0 16px 16px 0",
      backgroundColor: "#1976d2",
      color: "#fff",
      padding: "12px",
      "&:hover": { backgroundColor: "#53CBFF" },
      "&.Mui-disabled": { backgroundColor: "#e0e0e0", color: "#9e9e9e" },
    },
  },
  outlined: {
    "& .MuiIconButton-root": {
      borderRadius: "0 16px 16px 0",
      color: "#1976d2",
      padding: "12px",
      "&:hover": { backgroundColor: "#1976d2", color: "#fff" },
      "&.Mui-disabled": { backgroundColor: "#e0e0e0", color: "#9e9e9e" },
    },
  },
};

const AppDatePicker = styled(DatePicker, { name: "AppDatePicker" })(
  ({ variant = "outlined" }) => {
    const variantStyle = VARIANT_STYLE[variant] || {};

    return {
      "& .MuiOutlinedInput-root": {
        ...BASE_INPUT_STYLE,
        ...variantStyle,
      },
    };
  }
);

AppDatePicker.defaultProps = {
  slots: {
    openPickerIcon: CalendarMonth,
  },
};

export default AppDatePicker;
