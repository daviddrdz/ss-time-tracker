import { INIT_HRS, MIN_FOR_HR } from "../config/service.js";

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

export const getTotalHrs = () => {
    const storedShifts = localStorage.getItem("shifts");
    const shifts = storedShifts ? JSON.parse(storedShifts) : []; 

    let total = 0;

    shifts.forEach(shift => {
        const duration = shift.end ? getDuration(shift.start, shift.end) : null;
        total = total + (duration ? duration.hrs : 0);
        if(duration && duration.min >= MIN_FOR_HR) total++;
    })

    return INIT_HRS + total;
}
