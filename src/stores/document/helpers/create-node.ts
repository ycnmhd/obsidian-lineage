import { id } from 'src/helpers/id';
import {
    Column,
    ColumnNode,
    NodeGroup,
} from 'src/stores/document/document-type';

export const createNode = (__nodeId__?: string): ColumnNode =>
    __nodeId__ || id.node();

export const createColumn = (): Column => ({
    id: id.column(),
    groups: [],
});

export const createGroup = (parentId: string): NodeGroup => ({
    nodes: [],
    parentId,
});
