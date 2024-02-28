import { id } from 'src/helpers/id';
import { createNode } from 'src/stores/document/helpers/create-node';
import { updateActiveNode } from 'src/stores/document/helpers/update-active-node';
import { DocumentState } from 'src/stores/document/document-reducer';

export const createFirstNode = (state: DocumentState) => {
    if (state.columns.length === 0) {
        const rootId = id.rootNode();
        const createdNode = createNode(rootId);
        state.columns.push({
            id: id.column(),
            groups: [
                {
                    parentId: rootId,
                    nodes: [createdNode],
                    id: id.group(),
                },
            ],
        });
        updateActiveNode(state, createdNode.id, true);
    }
};
