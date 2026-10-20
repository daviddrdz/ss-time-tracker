import type { Settings } from "@/types/settings";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { DEFAULT_TOTAL_HRS, DEFAULT_INIT_HRS, DEFAULT_MIN_FOR_HR, 
        DEFAULT_SHIFT_HRS, DEFAULT_DAYS_PER_WEEK } from "@/config/defaults";
import { MAX_DAYS_PER_WEEK } from "@/config/defaults";

const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

const DEFAULT_SETTINGS: Settings = {
    TOTAL_HRS: DEFAULT_TOTAL_HRS,
    INIT_HRS: DEFAULT_INIT_HRS,
    MIN_FOR_HR: DEFAULT_MIN_FOR_HR,
    SHIFT_HRS: DEFAULT_SHIFT_HRS,
    DAYS_PER_WEEK: DEFAULT_DAYS_PER_WEEK,
};

export const getSettings = (): Settings => {
    const settings: Settings = {
        ...DEFAULT_SETTINGS,
        ...readJSON<Partial<Settings>>(STORAGE_KEYS.settings, {}),
    };

    return {
        ...settings,
        DAYS_PER_WEEK: clamp(Math.round(settings.DAYS_PER_WEEK), 1, MAX_DAYS_PER_WEEK),
    };
};

export const saveSettings = (settings: Settings): void => {
    writeJSON(STORAGE_KEYS.settings, settings);
};
