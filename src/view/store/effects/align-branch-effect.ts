import { DocumentState } from 'src/view/store/document-reducer';
import { container } from 'src/view/components/container/ref';
import { findNode } from 'src/view/store/helpers/find-node';
import { alignElement } from 'src/view/store/effects/helpers/align-element';
import { DocumentStore } from 'src/view/view';

const alignBranch = (store: DocumentState) => {
    if (!container.current) return;
    const node = findNode(store.columns, store.state.activeBranch.node);
    if (node) {
        alignElement(node.id);
        for (const id of store.state.activeBranch.parentNodes) {
            alignElement(id);
        }
        for (const id of store.state.activeBranch.childGroups) {
            alignElement(id);
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
            action.type === 'SET_ACTIVE' ||
            action.type === 'CREATE_NODE' ||
            action.type === 'CREATE_FIRST_NODE' ||
            action.type === 'LOAD_DATA' ||
            action.type === 'DROP_NODE'
        ) {
            if (timeoutRef.align) clearTimeout(timeoutRef.align);
            timeoutRef.align = setTimeout(() => {
                alignBranch(store);
            }, 32);
        }
    });
};
