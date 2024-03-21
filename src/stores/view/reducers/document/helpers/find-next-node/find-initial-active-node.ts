import { Column, NodeId } from 'src/stores/document/document-state-type';
import { findNodeAtPosition } from 'src/stores/view/helpers/search/find-node-at-position';
import { logger } from 'src/helpers/logger';
import { NodePosition } from 'src/stores/view/helpers/search/find-node-position';

export const findInitialActiveNode = (
    columns: Column[],
    position: NodePosition | null,
) => {
    let activeNode: NodeId | null;
    if (position) {
        activeNode = findNodeAtPosition(columns, position);
        if (!activeNode) {
            const message =
                'could not find node at position' +
                JSON.stringify({
                    columns,
                    position,
                });
            logger.error(message);
        }
    } else activeNode = columns[0]?.groups?.[0]?.nodes?.[0];
    return activeNode;
};
