import { ColumnNode, Columns } from 'src/view/store/document-reducer';
import { findNode } from 'src/view/store/helpers/find-node';

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
