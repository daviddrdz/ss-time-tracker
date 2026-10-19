export function $<T extends Element>(selector: string, parent: ParentNode = document): T {
    const element = parent.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Elemento no encontrado: ${selector}`);
    }

    return element;
}
