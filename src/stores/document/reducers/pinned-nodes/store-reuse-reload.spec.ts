import { describe, expect, it } from 'vitest';
import { Store } from 'src/lib/store/store';
import { defaultDocumentState } from 'src/stores/document/default-document-state';
import { documentReducer } from 'src/stores/document/document-reducer';
import {
    DocumentState,
    Sections,
} from 'src/stores/document/document-state-type';
import { DocumentStoreAction } from 'src/stores/document/document-store-actions';
import { removeStalePinnedNodes } from 'src/stores/document/reducers/pinned-nodes/remove-stale-pinned-nodes';
import { loadPinnedNodes } from 'src/stores/document/reducers/pinned-nodes/load-pinned-nodes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noopError = () => {};

// content that does NOT round-trip perfectly through the sections format
// (trailing whitespace is trimmed by the parser)
const RAW_BODY = `<!--section: 1-->
Alpha

Beta

<!--section: 2-->
Gamma 
`;

const loadFromDisk = (
    store: Store<DocumentState, DocumentStoreAction>,
    body: string,
    oldSections?: Sections,
) => {
    store.dispatch({
        type: 'document/file/load-from-disk',
        payload: {
            document: { data: body, frontmatter: '', position: null },
            format: 'sections',
            activeSection: null,
            oldSections,
        },
    });
};

const makeStore = (body: string) => {
    const store = new Store<DocumentState, DocumentStoreAction>(
        defaultDocumentState(),
        documentReducer,
        noopError,
    );
    loadFromDisk(store, body);
    return store;
};

describe('pinned nodes survive store reuse + reload (global view flow)', () => {
    it('reload with oldSections remaps pinned nodes (view-subscription behaviour)', () => {
        const store = makeStore(RAW_BODY);
        const before = store.getValue();

        // pins were persisted as section numbers, e.g. ['1', '2']
        loadPinnedNodes(before.pinnedNodes, before.sections, {
            sections: ['1', '2'],
            fileCategories: [],
            nodeToCategory: {},
        });
        expect(before.pinnedNodes.Ids).toHaveLength(2);

        // simulate reopening the file: the store is reloaded from disk with
        // fresh node ids and the OLD sections passed along
        const oldSections = before.sections;
        loadFromDisk(store, RAW_BODY, oldSections);
        const after = store.getValue();

        // the reducer alone leaves pinned ids stale (the real remap is done by
        // the view subscription via remove-stale-nodes)
        const newIdsStillInSections = after.pinnedNodes.Ids.every((id) =>
            Boolean(after.sections.id_section[id]),
        );
        expect(newIdsStillInSections).toBe(false);

        // after remove-stale-nodes runs (as the view subscription does), ids
        // are remapped by section number and stay valid
        removeStalePinnedNodes(after.pinnedNodes, after.sections, oldSections);
        expect(after.pinnedNodes.Ids).toHaveLength(2);
        for (const id of after.pinnedNodes.Ids) {
            expect(after.sections.id_section[id]).toBeTruthy();
            expect(after.document.content[id]).toBeTruthy();
        }
    });

    it('load-from-settings re-maps sections to the current node ids', () => {
        const store = makeStore(RAW_BODY);
        const state = store.getValue();
        loadPinnedNodes(state.pinnedNodes, state.sections, {
            sections: ['1', '2'],
            fileCategories: [],
            nodeToCategory: {},
        });
        expect(state.pinnedNodes.Ids).toHaveLength(2);
        expect(state.pinnedNodes.Ids.every((id) => state.sections.id_section[id])).toBe(
            true,
        );
    });
});
