import { NodeGroup } from 'src/stores/document/document-state-type';

export const createGroup = (parentId: string): NodeGroup => ({
    nodes: [],
    parentId,
});
