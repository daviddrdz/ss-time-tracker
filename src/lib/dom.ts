export function $<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Elemento no encontrado: ${selector}`);
    }

    return element;
}