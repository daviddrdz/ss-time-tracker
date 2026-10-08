import { getDuration, getShifts } from "./shifts.js";

export const initHistoryController = () => {
    const historyList = document.querySelector("#history-list");
    const editModal = document.querySelector("#edit-modal");
    const editId = document.querySelector("#edit-id");
    const editDate = document.querySelector("#edit-date");
    const editStart = document.querySelector("#edit-start");
    const editEnd = document.querySelector("#edit-end");
    const btnSave = document.querySelector("#btn-save-edit");
    const btnDelete = document.querySelector("#btn-delete-shift");
    const btnCancel = document.querySelector("#btn-cancel-edit");

    if (!historyList) return;

    const renderHistory = () => {
        const shifts = getShifts();
        historyList.innerHTML = "";

        if (shifts.length === 0) {
            historyList.innerHTML = `<p class="p-6 text-center text-sm text-zinc-500">No hay turnos registrados.</p>`;
            return;
        }

        shifts.toReversed().forEach(shift => {
            const row = document.createElement("div");
            const end = shift.end ?? "En curso";
            const duration = shift.end ? getDuration(shift.start, shift.end) : null;

            const [year, month, day] = shift.date.split("-").map(Number);
            const date = new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
            }).format(new Date(year, month - 1, day));

            // Mantiene el diseño original limpio de 3 columnas y añade cursor puntero para indicar interactividad
            row.className = "grid grid-cols-3 items-center p-4 border-b border-zinc-800 last:border-0 cursor-pointer transition-colors hover:bg-zinc-800/50";
            row.innerHTML = `
                <span class="font-medium text-left">${date}</span>
                <span class="text-sm text-zinc-400 text-center">${shift.start} - ${end}</span>
                <span class="font-medium text-right font-mono">
                    ${duration ? duration?.hrs + "h " + duration?.min + "m" : "Activo"}
                </span>
            `;

            // Al hacer clic en cualquier parte de la fila, abre el modal de edición
            row.addEventListener("click", () => {
                editId.value = shift.id;
                editDate.value = shift.date;
                editStart.value = shift.start;
                editEnd.value = shift.end || "";
                editModal?.showModal();
            });

            historyList.appendChild(row);
        });
    };

    // Guardar cambios
    btnSave?.addEventListener("click", () => {
        let shifts = getShifts();
        const index = shifts.findIndex(s => s.id === editId.value);
        
        if (index !== -1) {
            shifts[index].date = editDate.value;
            shifts[index].start = editStart.value;
            shifts[index].end = editEnd.value ? editEnd.value : null;
            
            localStorage.setItem("shifts", JSON.stringify(shifts));
            window.dispatchEvent(new Event("shifts-updated"));
            editModal?.close();
        }
    });

    // Eliminar turno
    btnDelete?.addEventListener("click", () => {
        if (confirm("¿Estás seguro de que deseas eliminar este turno? Se restarán las horas de tus estadísticas.")) {
            let shifts = getShifts();
            shifts = shifts.filter(s => s.id !== editId.value);
            
            localStorage.setItem("shifts", JSON.stringify(shifts));
            window.dispatchEvent(new Event("shifts-updated"));
            editModal?.close();
        }
    });

    // Cancelar / Cerrar
    btnCancel?.addEventListener("click", () => {
        editModal?.close();
    });

    renderHistory();
    window.addEventListener("shifts-updated", renderHistory);
};