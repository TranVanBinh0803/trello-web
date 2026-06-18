import AppDatePicker from "./Common/AppDatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
const Test = () => {
  return (
    <div style={{ padding: "10px" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppDatePicker />
      </LocalizationProvider>
    </div>
  );
};

export default Test;
