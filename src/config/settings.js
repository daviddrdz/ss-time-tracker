import { DEFAULT_TOTAL_HRS, DEFAULT_INIT_HRS, DEFAULT_MIN_FOR_HR, DEFAULT_SHIFT_HRS } from "./service";

export const getSettings = () => {
    const storedSettings = localStorage.getItem("settings");
    let settings = null;

    if (storedSettings) {
        settings = JSON.parse(storedSettings);
    } else {
        settings = {
            TOTAL_HRS: DEFAULT_TOTAL_HRS,
            INIT_HRS: DEFAULT_INIT_HRS,
            MIN_FOR_HR: DEFAULT_MIN_FOR_HR,
            SHIFT_HRS: DEFAULT_SHIFT_HRS
        }
    }

    return settings;
}

export const saveSettings = (settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
}
