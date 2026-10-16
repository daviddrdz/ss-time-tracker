import { getDuration } from "@/lib/shifts";
import { loadShifts, saveShifts, SHIFT_UPDATED_EVENT } from "@/lib/storage";
import { $ } from "@/lib/dom";

export const initShiftHistory = (): void => {
    const historyList = $<HTMLDivElement>("#history-list");
    const editModal = $<HTMLDialogElement>("#edit-modal");
    const editId = $<HTMLInputElement>("#edit-id");
    const editDate = $<HTMLInputElement>("#edit-date");
    const editStart = $<HTMLInputElement>("#edit-start");
    const editEnd = $<HTMLInputElement>("#edit-end");
    const saveButton = $<HTMLButtonElement>("#btn-save-edit");
    const deleteButton = $<HTMLButtonElement>("#btn-delete-shift");
    const cancelButton = $<HTMLButtonElement>("#btn-cancel-edit");

    const renderHistory = (): void => {
        const shifts = loadShifts();
        historyList.innerHTML = "";

        if (shifts.length === 0) {
            historyList.innerHTML = `<p class="p-6 text-center text-sm text-zinc-500">No hay turnos registrados.</p>`;
            return;
        }

        shifts.toReversed().forEach((shift) => {
            const row = document.createElement("div");
            const end = shift.end ?? "En curso";
            const duration = shift.end ? getDuration(shift.start, shift.end) : null;

            const [year, month, day] = shift.date.split("-").map(Number);
            const date = new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
            }).format(new Date(year, month - 1, day));

            row.className =
                "grid grid-cols-3 items-center p-4 border-b border-zinc-800 last:border-0 cursor-pointer transition-colors hover:bg-zinc-800/50";
            row.innerHTML = `
                <span class="font-medium text-left">${date}</span>
                <span class="text-sm text-zinc-400 text-center">${shift.start} - ${end}</span>
                <span class="font-medium text-right font-mono">
                    ${duration ? `${duration.hrs}h ${duration.min}m` : "Activo"}
                </span>
            `;

            row.addEventListener("click", () => {
                editId.value = shift.id;
                editDate.value = shift.date;
                editStart.value = shift.start;
                editEnd.value = shift.end ?? "";
                editModal.showModal();
            });

            historyList.appendChild(row);
        });
    };

    saveButton.addEventListener("click", () => {
        const shifts = loadShifts();
        const shift = shifts.find((s) => s.id === editId.value);

        if (!shift) return;

        shift.date = editDate.value;
        shift.start = editStart.value;
        shift.end = editEnd.value || null;

        saveShifts(shifts);
        editModal.close();
    });

    deleteButton.addEventListener("click", () => {
        const message = "¿Estás seguro de que deseas eliminar este turno? Se restarán las horas de tus estadísticas.";
        if (!confirm(message)) return;

        const remainingShifts = loadShifts().filter((s) => s.id !== editId.value);
        saveShifts(remainingShifts);
        editModal.close();
    });

    cancelButton.addEventListener("click", () => editModal.close());

    renderHistory();
    window.addEventListener(SHIFT_UPDATED_EVENT, renderHistory);
};
