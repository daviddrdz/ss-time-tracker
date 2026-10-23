import type { Settings } from "@/types/settings";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import {
    DEFAULT_TOTAL_HRS,
    DEFAULT_INIT_HRS,
    DEFAULT_MIN_FOR_HR,
    DEFAULT_SHIFT_HRS,
    DEFAULT_DAYS_PER_WEEK,
    MAX_SHIFT_HRS,
    MAX_DAYS_PER_WEEK,
} from "@/config/defaults";

const DEFAULT_SETTINGS: Settings = {
    totalHours: DEFAULT_TOTAL_HRS,
    initialHours: DEFAULT_INIT_HRS,
    minMinutesToRound: DEFAULT_MIN_FOR_HR,
    defaultShiftHours: DEFAULT_SHIFT_HRS,
    daysPerWeek: DEFAULT_DAYS_PER_WEEK,
};

const LEGACY_KEYS = {
    TOTAL_HRS: "totalHours",
    INIT_HRS: "initialHours",
    MIN_FOR_HR: "minMinutesToRound",
    SHIFT_HRS: "defaultShiftHours",
    DAYS_PER_WEEK: "daysPerWeek",
} as const;

const migrateLegacySettings = (stored: Record<string, unknown>): Partial<Settings> => {
    const migrated: Record<string, unknown> = { ...stored };

    for (const [oldKey, newKey] of Object.entries(LEGACY_KEYS)) {
        if (!(oldKey in migrated)) continue;

        migrated[newKey] ??= migrated[oldKey];
        delete migrated[oldKey];
    }

    return migrated as Partial<Settings>;
};

const toBoundedInt = (value: unknown, min: number, max: number, fallback: number): number => {
    const rounded = Math.round(Number(value));
    if (!Number.isFinite(rounded)) return fallback;
    return Math.min(max, Math.max(min, rounded));
};

const sanitizeSettings = (settings: Settings): Settings => ({
    totalHours: toBoundedInt(settings.totalHours, 1, 9999, DEFAULT_TOTAL_HRS),
    initialHours: toBoundedInt(settings.initialHours, 0, 9999, DEFAULT_INIT_HRS),
    minMinutesToRound: toBoundedInt(settings.minMinutesToRound, 0, 60, DEFAULT_MIN_FOR_HR),
    defaultShiftHours: toBoundedInt(settings.defaultShiftHours, 1, MAX_SHIFT_HRS, DEFAULT_SHIFT_HRS),
    daysPerWeek: toBoundedInt(settings.daysPerWeek, 1, MAX_DAYS_PER_WEEK, DEFAULT_DAYS_PER_WEEK),
});

export const getSettings = (): Settings =>
    sanitizeSettings({
        ...DEFAULT_SETTINGS,
        ...migrateLegacySettings(readJSON<Record<string, unknown>>(STORAGE_KEYS.settings, {})),
    });

export const saveSettings = (settings: Settings): void => {
    writeJSON(STORAGE_KEYS.settings, sanitizeSettings(settings));
};
