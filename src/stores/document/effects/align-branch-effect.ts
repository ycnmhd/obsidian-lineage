import { DocumentState } from 'src/stores/document/document-reducer';
import { findNode } from 'src/stores/document/helpers/find-node';
import {
    AlignBranchState,
    alignElement,
} from 'src/stores/document/effects/helpers/align-element';
import { DocumentStore } from 'src/view/view';

const alignBranch = (state: DocumentState, behavior?: ScrollBehavior) => {
    if (!state.refs.container) return;
    const node = findNode(state.columns, state.state.activeBranch.node);
    const localState: AlignBranchState = {
        columns: new Set<HTMLElement>(),
    };
    if (node) {
        alignElement(
            state.refs.container,
            node.id,
            behavior,
            localState,
            'both',
        );
        for (const id of state.state.activeBranch.parentNodes) {
            alignElement(state.refs.container, id, behavior, localState);
        }
        for (const id of state.state.activeBranch.childGroups) {
            alignElement(state.refs.container, id, behavior, localState);
        }
    }
    for (const column of state.columns) {
        const nodes = column.groups.map((g) => g.nodes).flat();
        alignElement(
            state.refs.container,
            nodes[nodes.length - 1].id,
            behavior,
            localState,
        );
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
