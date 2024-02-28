import { ColumnNode, Columns } from 'src/stores/document/document-reducer';
import { logger } from 'src/helpers/logger';

const cache: { [key: string]: ColumnNode } = {};

export const findNode = (
    columns: Columns,
    nodeId: string,
): ColumnNode | null => {
    if (cache[nodeId]) {
        return cache[nodeId];
    }
    if (nodeId.startsWith('r-')) return null;
    for (const column of columns) {
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
    return null;
};
