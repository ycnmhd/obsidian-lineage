import { jsonTreeToColumns } from 'src/stores/document/helpers/json-to-md/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/stores/document/helpers/json-to-md/markdown-to-json/markdown-to-json';
import { updateActiveNode } from 'src/stores/document/helpers/update-active-node';
import {
    ColumnNode,
    DocumentState,
    SavedDocument,
} from 'src/stores/document/document-reducer';
import { findNodeAtPosition } from 'src/stores/document/helpers/find-branch';
import { logger } from 'src/helpers/logger';
import { createFirstNode } from 'src/stores/document/reducers/creation/helpers/create-first-node';

export type LoadDocumentAction =
    | {
          type: 'FILE/LOAD_DOCUMENT';
          payload: {
              document: SavedDocument;
          };
      }
    | {
          type: 'APPLY_SNAPSHOT';
          payload: {
              document: Omit<SavedDocument, 'frontmatter'>;
          };
      };
export const loadDocument = (
    state: DocumentState,
    action: LoadDocumentAction,
) => {
    const tree = markdownToJson(action.payload.document.data);
    state.columns = jsonTreeToColumns(tree);
    if (tree.length === 0) {
        createFirstNode(state);
    }
    if (action.type === 'FILE/LOAD_DOCUMENT')
        state.file.frontmatter = action.payload.document.frontmatter;
    let activeNode: ColumnNode | null;
    if (action.payload.document.position) {
        activeNode = findNodeAtPosition(
            state.columns,
            action.payload.document.position,
        );
        if (!activeNode) {
            const message =
                'could not find node at position' +
                JSON.stringify({
                    state,
                    action,
                });
            logger.error(message);
        }
    } else activeNode = state.columns[0]?.groups?.[0]?.nodes?.[0];
    if (activeNode) updateActiveNode(state, activeNode.id);
    state.state.editing.savePreviousNode = false;
};
