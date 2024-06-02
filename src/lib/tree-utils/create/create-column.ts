import { Column } from 'src/stores/document/document-state-type';
import { id } from 'src/helpers/id';

export const createColumn = (): Column => ({
    id: id.column(),
    groups: [],
});
