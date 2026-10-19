import type { Shift } from "@/types/shift";
import { getDuration } from "@/lib/shifts";
import { loadShifts, saveShifts, SHIFT_UPDATED_EVENT } from "@/lib/storage";
import { $ } from "@/lib/dom";

const formatShiftDate = (date: string): string => {
    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
    }).format(new Date(year, month - 1, day));
};

export const initShiftHistory = (): void => {
    const historyList = $<HTMLUListElement>("#history-list");
    const emptyMessage = $<HTMLParagraphElement>("#history-empty-message");
    const rowTemplate = $<HTMLTemplateElement>("#shift-row-template");

    const editDialog = $<HTMLDialogElement>("#edit-dialog");
    const editForm = $<HTMLFormElement>("#edit-form");
    const editIdInput = $<HTMLInputElement>("#edit-id-input");
    const editDateInput = $<HTMLInputElement>("#edit-date-input");
    const editStartInput = $<HTMLInputElement>("#edit-start-input");
    const editEndInput = $<HTMLInputElement>("#edit-end-input");
    const deleteButton = $<HTMLButtonElement>("#delete-shift-button");

    const createShiftRow = (shift: Shift): DocumentFragment => {
        const row = document.importNode(rowTemplate.content, true);
        const duration = shift.end ? getDuration(shift.start, shift.end) : null;

        $<HTMLButtonElement>("button", row).dataset.shiftId = shift.id;
        $("[data-field='date']", row).textContent = formatShiftDate(shift.date);
        $("[data-field='range']", row).textContent = `${shift.start} - ${shift.end ?? "En curso"}`;
        $("[data-field='duration']", row).textContent = duration
            ? `${duration.hrs}h ${duration.min}m`
            : "Activo";

        return row;
    };

    const renderHistory = (): void => {
        const shifts = loadShifts().toReversed();

        emptyMessage.hidden = shifts.length > 0;
        historyList.hidden = shifts.length === 0;
        historyList.replaceChildren(...shifts.map(createShiftRow));
    };

    const openEditDialog = (shift: Shift): void => {
        editIdInput.value = shift.id;
        editDateInput.value = shift.date;
        editStartInput.value = shift.start;
        editEndInput.value = shift.end ?? "";
        editEndInput.setCustomValidity("");
        editDialog.showModal();
    };

    historyList.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;

        const rowButton = event.target.closest<HTMLButtonElement>("button[data-shift-id]");
        if (!rowButton) return;

        const shift = loadShifts().find((s) => s.id === rowButton.dataset.shiftId);
        if (shift) openEditDialog(shift);
    });

    editEndInput.addEventListener("input", () => editEndInput.setCustomValidity(""));

    editForm.addEventListener("submit", (event) => {
        const isSave = event.submitter instanceof HTMLButtonElement && event.submitter.value === "save";
        if (!isSave) return;

        const shifts = loadShifts();
        const shift = shifts.find((s) => s.id === editIdInput.value);
        if (!shift) return;

        const hasOtherActiveShift = shifts.some((s) => s.end === null && s.id !== shift.id);
        if (!editEndInput.value && hasOtherActiveShift) {
            event.preventDefault();
            editEndInput.setCustomValidity("Ya hay otro turno en curso. Registra su salida primero.");
            editEndInput.reportValidity();
            return;
        }

        shift.date = editDateInput.value;
        shift.start = editStartInput.value;
        shift.end = editEndInput.value || null;

        saveShifts(shifts);
    });

    deleteButton.addEventListener("click", () => {
        const message = "¿Estás seguro de que deseas eliminar este turno? Se restarán las horas de tus estadísticas.";
        if (!confirm(message)) return;

        const remainingShifts = loadShifts().filter((s) => s.id !== editIdInput.value);
        saveShifts(remainingShifts);
        editDialog.close();
    });

    renderHistory();
    window.addEventListener(SHIFT_UPDATED_EVENT, renderHistory);
};
