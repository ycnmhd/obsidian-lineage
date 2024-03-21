import { ViewState } from 'src/stores/view/view-state-type';
import { NodeId } from 'src/stores/document/document-state-type';

export const defaultViewState = (): ViewState => ({
    search: {
        query: '',
        results: new Set(),
        searching: false,
        showInput: false,
    },
    ui: {
        showHistorySidebar: false,
        showHelpSidebar: false,
        zoomLevel: 1,
    },
    document: {
        treeIndex: {},
        editing: {
            activeNodeId: '',
        },
        activeBranch: {
            group: '',
            childGroups: new Set<string>(),
            sortedParentNodes: [],
            column: '',
        },
        dnd: {
            node: '',
            childGroups: new Set<string>(),
        },
        activeNode: '',
    },
    navigationHistory: {
        items: [],
        state: {
            activeIndex: -1,
            canGoBack: false,
            canGoForward: false,
        },
        context: undefined,
    },
});
export type ActiveBranch = {
    childGroups: Set<string>;
    sortedParentNodes: NodeId[];
    group: string;
    column: string;
};
export type DNDState = {
    childGroups: Set<string>;
    node: string;
};
export type EditingState = {
    activeNodeId: string;
};
