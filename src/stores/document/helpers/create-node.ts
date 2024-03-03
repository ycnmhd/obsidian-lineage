import { id } from 'src/helpers/id';
import { Column, NodeId, NodeGroup } from 'src/stores/document/document-type';

export const createNode = (__nodeId__?: string): NodeId =>
    __nodeId__ || id.node();

export const createColumn = (): Column => ({
    id: id.column(),
    groups: [],
});

export const createGroup = (parentId: string): NodeGroup => ({
    nodes: [],
    parentId,
});
