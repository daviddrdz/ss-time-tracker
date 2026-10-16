export type ProjectionFormat = "detailed" | "days" | "weeks" | "months";

const WEEK_PER_MONTH = 4;

export function formatProjection(
    remainingHours: number,
    hoursPerDay: number,
    daysPerWeek: number,
    format: ProjectionFormat
): string {
    const totalDays = Math.ceil(remainingHours / hoursPerDay);
    const daysPerMonth = daysPerWeek * WEEK_PER_MONTH;

    switch(format) {
        case "days":
            return `${totalDays} días`;
        case "weeks":
            return `${(totalDays / daysPerWeek).toFixed(1)} semanas`;
        case "months":
            return `${(totalDays / daysPerMonth).toFixed(1)} meses`;
        case "detailed": {
            const months = Math.floor(totalDays / daysPerMonth);
            const daysAfterMonths = totalDays % daysPerMonth;
            const weeks = Math.floor(daysAfterMonths / daysPerWeek);
            const days = daysAfterMonths % daysPerWeek;
            return `${months} meses, ${weeks} sem, ${days} dias`;
        }
    }
}
