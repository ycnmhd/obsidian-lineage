import { DocumentState } from 'src/view/store/document-reducer';
import { findNode } from 'src/view/store/helpers/find-node';
import { alignElement } from 'src/view/store/effects/helpers/align-element';
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
    return store.subscribe((store, action) => {
        const timeoutRef: {
            align: ReturnType<typeof setTimeout> | null;
        } = {
            align: null,
        };
        if (!action) return;
        if (
            action.type === 'SET_ACTIVE_NODE' ||
            action.type === 'CREATE_NODE' ||
            action.type === 'CREATE_FIRST_NODE' ||
            action.type === 'LOAD_DATA' ||
            action.type === 'DROP_NODE' ||
            action.type === 'CHANGE_ACTIVE_NODE' ||
            action.type === 'APPLY_SNAPSHOT'
        ) {
            if (timeoutRef.align) clearTimeout(timeoutRef.align);
            timeoutRef.align = setTimeout(() => {
                alignBranch(
                    store,
                    action.type === 'APPLY_SNAPSHOT' ? 'instant' : undefined,
                );
            }, 32);
        }
    });
};
