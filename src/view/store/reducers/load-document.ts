import { jsonTreeToColumns } from 'src/view/store/helpers/conversion/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/view/store/helpers/conversion/markdown-to-json/markdown-to-json';
import { updateActiveNode } from 'src/view/store/helpers/update-active-node';
import { DocumentState, SavedDocument } from 'src/view/store/document-reducer';

export type LoadDocumentAction = {
    type: 'LOAD_DATA';
    payload: {
        data: SavedDocument;
    };
};
export const loadDocument = (
    state: DocumentState,
    action: LoadDocumentAction,
) => {
    state.columns = jsonTreeToColumns(markdownToJson(action.payload.data));
    const firstNode = state.columns[0]?.groups?.[0]?.nodes?.[0];
    if (firstNode) updateActiveNode(state, firstNode.id);
};
