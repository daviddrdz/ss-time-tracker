import { DEFAULT_TOTAL_HRS, DEFAULT_INIT_HRS, DEFAULT_MIN_FOR_HR, 
        DEFAULT_SHIFT_HRS, DEFAULT_DAYS_PER_WEEK } from "@/config/defaults.js";

export const getSettings = () => {
    const defaults = {
        TOTAL_HRS: DEFAULT_TOTAL_HRS,
        INIT_HRS: DEFAULT_INIT_HRS,
        MIN_FOR_HR: DEFAULT_MIN_FOR_HR,
        SHIFT_HRS: DEFAULT_SHIFT_HRS,
        DAYS_PER_WEEK: DEFAULT_DAYS_PER_WEEK
    };

    try {
        const storedSettings = localStorage.getItem("settings");
        return storedSettings ? { ...defaults, ...JSON.parse(storedSettings) } : defaults;
    } catch {
        return defaults;
    }
}

export const saveSettings = (settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
}
