import { getSettings } from "../config/settings.js";

export const getShifts = () => {
    const storedShifts = localStorage.getItem("shifts");
    const shifts = (storedShifts ? JSON.parse(storedShifts) : []);
    return shifts;
}

export const getActiveShift = (shifts) => {
    return shifts.find(shift => shift.end === null);
}

export const getDuration = (start, end) => {
    const [startHrs, startMin] = start.split(":").map(Number);
    const [endHrs, endMin] = end.split(":").map(Number);

    const startTime = (startHrs * 60) + startMin;
    const endTime = (endHrs * 60) + endMin;

    const duration = endTime - startTime;

    const durationHrs = Math.floor(duration / 60);
    const durationMin = duration % 60;

    return {
        hrs: durationHrs,
        min: durationMin
    }
}

export const getTotalHours = () => {
    const settings = getSettings();
    const shifts = getShifts();

    let total = 0;

    shifts.forEach(shift => {
        const duration = shift.end ? getDuration(shift.start, shift.end) : null;
        total = total + (duration ? duration.hrs : 0);
        if(duration && duration.min >= settings.MIN_FOR_HR) total++;
    })

    return settings.INIT_HRS + total;
}

export const getClockOutTime = (start, shift) => {
    const settings = getSettings();
    const [h, m] = start.split(":").map(Number);

    const minutes = ((h * 60) + m) + ((shift - 1) * 60) + settings.MIN_FOR_HR;
    const hr = (Math.floor(minutes / 60)) % 24;
    const min = minutes % 60;

    const time = `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

    return time;
}
