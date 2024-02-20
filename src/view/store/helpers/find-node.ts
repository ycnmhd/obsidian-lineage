import { Matrix, MatrixNode } from 'src/view/store/document.store';
import { logger } from 'src/helpers/logger';

const cache: { [key: string]: MatrixNode } = {};

export const findNode = (
    matrix: Matrix,
    nodeId: string,
): MatrixNode | undefined => {
    if (cache[nodeId]) {
        return cache[nodeId];
    }
    if (nodeId.startsWith('root-node')) return;
    for (const column of matrix) {
        for (const group of column.groups) {
            for (const node of group.nodes) {
                if (node.id === nodeId) {
                    cache[nodeId] = node;
                    return node;
                }
            }
        }
    }
    logger.error('could not find node', nodeId);
    return undefined;
};
