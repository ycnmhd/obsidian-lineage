import { nanoid } from 'nanoid';

const id_size = 8;
export const id = {
    rootNode: () => 'r' + nanoid(id_size),
    // node: () => 'n-' + RandomId.generateId('adjectives', 'nouns'),
    // column: () => 'c-' + RandomId.generateId('cities'),
    node: () => 'n' + nanoid(id_size),
    column: () => 'c' + nanoid(id_size),
    snapshot: () => 's' + nanoid(id_size),
    view: () => 'v' + nanoid(id_size),
    canvas: () => 'canvas-' + nanoid(id_size),
    styleRule: () => 'sr' + nanoid(id_size),
    globalCategory: () => 'gc' + nanoid(id_size),
};

export const isId = {
    node: (text: string) => text.length === 9 && text.startsWith('n'),
};
