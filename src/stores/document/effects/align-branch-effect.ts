import { DocumentState } from 'src/stores/document/document-reducer';
import { findNode } from 'src/stores/document/helpers/find-node';
import { alignElement } from 'src/stores/document/effects/helpers/align-element';
import { DocumentStore } from 'src/view/view';

const alignBranch = (store: DocumentState, behavior?: ScrollBehavior) => {
    if (!store.refs.container) return;
    const node = findNode(store.columns, store.state.activeBranch.node);
    if (node) {
        alignElement(store.refs.container, node.id, behavior);
        for (const id of store.state.activeBranch.parentNodes) {
            alignElement(store.refs.container, id, behavior);
        }
        for (const id of store.state.activeBranch.childGroups) {
            alignElement(store.refs.container, id, behavior);
        }
    }
};

export const alignBranchEffect = (store: DocumentStore) => {
    let activeNode: string | null = null;
    return store.subscribe((store, action) => {
        const timeoutRef: {
            align: ReturnType<typeof setTimeout> | null;
        } = {
            align: null,
        };
        if (!action) return;
        if (store.state.activeBranch.node === activeNode) return;
        activeNode = store.state.activeBranch.node;

        if (timeoutRef.align) clearTimeout(timeoutRef.align);
        timeoutRef.align = setTimeout(() => {
            alignBranch(
                store,
                action.type === 'APPLY_SNAPSHOT' ? 'instant' : undefined,
            );
        }, 32);
    });
};
