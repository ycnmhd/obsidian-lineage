import { Column, ColumnNode, NodeGroup } from '../document-reducer';
import { id } from 'src/helpers/id';

export const createNode = (
    parentId: string,
    __nodeId__?: string,
    content = '',
): ColumnNode => ({
    id: __nodeId__ || id.node(),
    parentId,
    content,
});

export const createColumn = (): Column => ({
    id: id.column(),
    groups: [],
});

export const createGroup = (parentId: string): NodeGroup => ({
    nodes: [],
    id: id.group(),
    parentId,
});
