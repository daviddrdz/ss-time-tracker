import type { Shift } from "@/types/shift";
import { getSettings } from "@/config/settings";
import { loadShifts } from "@/lib/storage";

interface Duration {
    hours: number;
    minutes: number;
};

export const getActiveShift = (shifts: Shift[]): Shift | undefined => {
    return shifts.find((shift) => shift.end === null);
};

export const getDuration = (start: string, end: string): Duration => {
    const [startHrs, startMin] = start.split(":").map(Number);
    const [endHrs, endMin] = end.split(":").map(Number);

    let duration = endHrs * 60 + endMin - (startHrs * 60 + startMin);
    if (duration < 0) duration += 24 * 60;

    return {
        hours: Math.floor(duration / 60),
        minutes: duration % 60,
    };
};

export const getTotalHours = (): number => {
    const settings = getSettings();
    let total = 0;

    for (const shift of loadShifts()) {
        if(!shift.end) continue;
        const duration = getDuration(shift.start, shift.end);
        total += duration.hours;
        if (duration.minutes >= settings.minMinutesToRound) total++;
    }

    return settings.initialHours + total;
};

export const getClockOutTime = (start: string, shiftHours: number): string => {
    const settings = getSettings();
    const [h, m] = start.split(":").map(Number);

    const minutes = ((h * 60) + m) + ((shiftHours - 1) * 60) + settings.minMinutesToRound;
    const hours = (Math.floor(minutes / 60)) % 24;
    const mins = minutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}
