import { Matrix, MatrixNode } from 'src/view/store/document.store';
import { findNode } from 'src/view/store/helpers/find-node';

export type StringSet = Set<string>;
export const traverseUp = (
    branch: StringSet,
    matrix: Matrix,
    node: MatrixNode,
) => {
    const parentNode = findNode(matrix, node.parentId);
    if (parentNode) {
        branch.add(parentNode.id);
        traverseUp(branch, matrix, parentNode);
    }
};

export const traverseDown = (
    childGroups: StringSet,
    childNodes: StringSet,
    matrix: Matrix,
    node: MatrixNode,
) => {
    for (const column of matrix) {
        for (const group of column.groups) {
            if (group.parentId === node.id) {
                childGroups.add(group.id);
                for (const node of group.nodes) {
                    childNodes.add(node.id);
                    traverseDown(childGroups, childNodes, matrix, node);
                }
            }
        }
    }
};

export const findSiblings = (
    siblingNodes: StringSet,
    matrix: Matrix,
    node: MatrixNode,
) => {
    for (const column of matrix) {
        for (const group of column.groups) {
            if (group.parentId === node.parentId) {
                for (const node of group.nodes) {
                    siblingNodes.add(node.id);
                }
            }
        }
    }
};
