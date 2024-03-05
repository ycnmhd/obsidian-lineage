import { jsonTreeToColumns } from 'src/stores/view/helpers/json-to-md/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/stores/view/helpers/json-to-md/markdown-to-json/markdown-to-json';
import { ViewState } from 'src/stores/view/view-state-type';
import { SavedDocument } from 'src/stores/view/view-reducer';
import { createFirstNode } from 'src/stores/view/reducers/document/io/load-document-from-file/helpers/create-first-node';
import { updateActiveNode } from 'src/stores/view/reducers/document/state/helpers/update-active-node';
import { findNextActiveNode } from 'src/stores/view/reducers/document/state/helpers/find-next-node/find-next-active-node';

export type LoadDocumentAction = {
    type: 'DOCUMENT/LOAD_FILE';
    payload: {
        document: SavedDocument;
    };
};

export const loadDocumentFromFile = (
    state: ViewState,
    action: LoadDocumentAction,
) => {
    const tree = markdownToJson(action.payload.document.data);
    const document = jsonTreeToColumns(tree);
    state.document.columns = document.columns;
    state.document.content = document.content;
    const firstNode = tree.length === 0;
    if (firstNode) {
        createFirstNode(state.document.columns, state.document.content);
    }
    if (action.type === 'DOCUMENT/LOAD_FILE')
        state.file.frontmatter = action.payload.document.frontmatter;
    const activeNode = findNextActiveNode(
        state.document.columns,
        state.document.state.activeBranch.node,
        action,
    );
    if (activeNode) {
        updateActiveNode(
            state.document.columns,
            state.document.state,
            activeNode,
            firstNode,
        );
        return true;
    }
};
