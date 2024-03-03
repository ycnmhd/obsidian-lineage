import { nanoid } from 'nanoid';

const id_size = 3;
export const id = {
    rootNode: () => 'r' + nanoid(id_size),
    node: () => 'n' + nanoid(id_size),
    column: () => 'c' + nanoid(id_size),
    snapshot: () => 's' + nanoid(id_size),
};
