import { documentStore, State } from 'src/view/store/document.store';
import { container } from 'src/view/components/container/ref';
import { findNode } from 'src/view/store/helpers/find-node';
import { alignElement } from 'src/view/store/effects/helpers/align-element';

const alignBranch = (store: State) => {
    if (!container.current) return;
    const node = findNode(store.matrix, store.state.activeBranch.node);
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

export const alignBranchEffect = () => {
    documentStore.subscribe((store, action) => {
        const timeoutRef: {
            align: ReturnType<typeof setTimeout> | null;
        } = {
            align: null,
        };
        if (!action) return;
        if (
            action.type === 'SET_ACTIVE' ||
            action.type === 'CREATE_NODE' ||
            action.type === 'CREATE_FIRST_NODE'
        ) {
            if (timeoutRef.align) clearTimeout(timeoutRef.align);
            timeoutRef.align = setTimeout(() => {
                alignBranch(store);
            }, 32);
        }
    });
};
