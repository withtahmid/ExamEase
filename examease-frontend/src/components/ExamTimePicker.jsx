import { React, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import './examtimepicker.css'
export default function ExamTimePicker({ getter }) {
    const [date, setDate] = useState(null);

    useEffect(() => {
        if (getter)
            getter(date);
        // console.log(JSON.stringify(date))
    }, [date])

    return (
        <div className="remove-all">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    // label="Start date and time"
                    slotProps={{ textField: { size: "small" } }}
                    className="myDatePicker"
                />
            </LocalizationProvider>
        </div>
    );
}

