import { id } from 'src/helpers/id';
import { createNode } from 'src/view/store/helpers/create-node';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';
import { DocumentState } from 'src/view/store/document-reducer';

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
