import type { Shift } from "@/types/shift";

export const STORAGE_KEYS = {
    shifts: "shifts",
    settings: "settings",
} as const;

export const SHIFT_UPDATED_EVENT = "shifts-updated";

export function readJSON<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function writeJSON(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export const loadShifts = (): Shift[] => readJSON<Shift[]>(STORAGE_KEYS.shifts, []);

export function saveShifts(shifts: Shift[]): void {
    writeJSON(STORAGE_KEYS.shifts, shifts);
    window.dispatchEvent(new Event(SHIFT_UPDATED_EVENT));
}
