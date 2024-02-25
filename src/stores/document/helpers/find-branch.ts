import {
    ColumnNode,
    Columns,
    NodeGroup,
} from 'src/stores/document/document-reducer';
import { findNode } from 'src/stores/document/helpers/find-node';

export type StringSet = Set<string>;
export const traverseUp = (
    branch: StringSet,
    columns: Columns,
    node: ColumnNode,
) => {
    const parentNode = findNode(columns, node.parentId);
    if (parentNode) {
        branch.add(parentNode.id);
        traverseUp(branch, columns, parentNode);
    }
};

export const traverseDown = (
    childGroups: StringSet,
    childNodes: StringSet,
    columns: Columns,
    node: ColumnNode,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.id) {
                childGroups.add(group.id);
                for (const node of group.nodes) {
                    childNodes.add(node.id);
                    traverseDown(childGroups, childNodes, columns, node);
                }
            }
        }
    }
};

export const findSiblings = (
    siblingNodes: StringSet,
    columns: Columns,
    node: ColumnNode,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.parentId) {
                for (const node of group.nodes) {
                    siblingNodes.add(node.id);
                }
            }
        }
    }
};
export const findGroup = (
    columns: Columns,
    node: Pick<ColumnNode, 'parentId'>,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.parentId) {
                return group;
            }
        }
    }
};

export const findChildGroup = (
    columns: Columns,
    node: Pick<ColumnNode, 'id'>,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.id) {
                return group;
            }
        }
    }
};

export type NodePosition = {
    columnIndex: number;
    groupIndex: number;
    nodeIndex: number;
};

export const findNodePosition = (
    columns: Columns,
    node: ColumnNode,
): NodePosition | null => {
    for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];
        for (
            let groupIndex = 0;
            groupIndex < column.groups.length;
            groupIndex++
        ) {
            const group = column.groups[groupIndex] as NodeGroup;
            const nodeIndex = group.nodes.findIndex((n) => n.id === node.id);
            if (nodeIndex !== -1) {
                return {
                    columnIndex,
                    groupIndex,
                    nodeIndex,
                };
            }
        }
    }
    return null;
};

export const findNodeAtPosition = (
    columns: Columns,
    position: NodePosition,
): ColumnNode | null => {
    const { columnIndex, groupIndex, nodeIndex } = position;

    if (columnIndex < 0 || columnIndex >= columns.length) {
        return null;
    }

    const column = columns[columnIndex];
    if (groupIndex < 0 || groupIndex >= column.groups.length) {
        return null;
    }

    const group = column.groups[groupIndex] as NodeGroup;
    if (nodeIndex < 0 || nodeIndex >= group.nodes.length) {
        return null;
    }

    return group.nodes[nodeIndex];
};
