import { DocumentState } from 'src/stores/document/document-reducer';
import { cachedFindNode } from 'src/stores/document/helpers/search/cached-find-node';
import {
    AlignBranchState,
    alignElement,
} from 'src/stores/document/effects/helpers/align-element';
import { DocumentStore } from 'src/view/view';

const alignBranch = (
    state: DocumentState,
    container: HTMLElement,
    behavior?: ScrollBehavior,
) => {
    if (!container) return;
    const node = cachedFindNode(state.columns, state.state.activeBranch.node);
    const localState: AlignBranchState = {
        columns: new Set<HTMLElement>(),
    };
    if (node) {
        alignElement(container, node.id, behavior, localState, 'both');
        for (const id of state.state.activeBranch.parentNodes) {
            alignElement(container, id, behavior, localState);
        }
        for (const id of state.state.activeBranch.childGroups) {
            alignElement(container, id, behavior, localState);
        }
    }
    for (const column of state.columns) {
        const nodes = column.groups.map((g) => g.nodes).flat();
        if (nodes.length > 0)
            alignElement(
                container,
                nodes[nodes.length - 1].id,
                behavior,
                localState,
            );
    }
};

export const alignBranchEffect = (
    store: DocumentStore,
    container: HTMLElement,
) => {
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
            action.type === 'FILE/LOAD_DOCUMENT' ||
            action.type === 'DROP_NODE' ||
            action.type === 'CHANGE_ACTIVE_NODE' ||
            action.type === 'APPLY_SNAPSHOT' ||
            action.type === 'TREE/DELETE_NODE' ||
            action.type === 'SET_NODE_CONTENT' ||
            action.type === 'EVENT/VIEW_LOADED' ||
            action.type === 'MOVE_NODE'
        ) {
            if (timeoutRef.align) clearTimeout(timeoutRef.align);
            timeoutRef.align = setTimeout(() => {
                alignBranch(
                    store,
                    container,
                    /*action.type === 'APPLY_SNAPSHOT' ? 'instant' :*/ undefined,
                );
            }, 32);
        }
    });
};
