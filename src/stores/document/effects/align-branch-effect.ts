import { ViewState } from 'src/stores/document/document-type';
import {
    AlignBranchState,
    alignElement,
} from 'src/stores/document/effects/helpers/align-element';
import { DocumentStore } from 'src/view/view';

const alignBranch = (
    state: ViewState,
    container: HTMLElement,
    behavior?: ScrollBehavior,
) => {
    if (!container) return;
    const nodeId = state.document.state.activeBranch.node;
    const localState: AlignBranchState = {
        columns: new Set<HTMLElement>(),
    };
    if (nodeId) {
        alignElement(container, nodeId, behavior, localState, 'both');
        for (const id of state.document.state.activeBranch.sortedParentNodes) {
            alignElement(container, id, behavior, localState);
        }
        for (const id of state.document.state.activeBranch.childGroups) {
            alignElement(container, 'group-' + id, behavior, localState);
        }
    }
    for (const column of state.document.columns) {
        const nodes = column.groups.map((g) => g.nodes).flat();
        if (nodes.length > 0)
            alignElement(
                container,
                nodes[nodes.length - 1],
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
            action.type === 'CHANGE_ACTIVE_NODE_USING_KEYBOARD' ||
            action.type === 'APPLY_SNAPSHOT' ||
            action.type === 'TREE/DELETE_NODE' ||
            action.type === 'SET_NODE_CONTENT' ||
            action.type === 'EVENT/VIEW_LOADED' ||
            action.type === 'MOVE_NODE' ||
            action.type === 'MERGE_NODE'
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
