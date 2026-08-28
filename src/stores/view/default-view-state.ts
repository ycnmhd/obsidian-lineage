import { ViewState } from 'src/stores/view/view-state-type';

export const defaultViewState = (): ViewState => ({
    search: {
        query: '',
        results: new Map(),
        searching: false,
        showInput: false,
        fuzzySearch: false,
        showAllNodes: true,
    },
    ui: {
        controls: {
            showHistorySidebar: false,
            showHelpSidebar: false,
            showSettingsSidebar: false,
            showStyleRulesModal: false,
            showLeftSidebar: false,
        },
    },
    document: {
        editing: {
            activeNodeId: '',
            isInSidebar: false,
        },
        activeBranch: {
            group: '',
            childGroups: new Set<string>(),
            sortedParentNodes: [],
            column: '',
            node: '',
        },
        dnd: {
            node: '',
            childGroups: new Set<string>(),
        },
        activeNode: '',
        activeNodesOfColumn: {},
        selectedNodes: new Set<string>(),
        pendingConfirmation: {
            disableEdit: null,
            deleteNode: new Set<string>(),
        },
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
    pinnedNodes: {
        activeNode: '',
        activeCategory: 'all',
    },
    recentNodes: {
        activeNode: '',
    },
    similarCards: {
        nodeIds: [],
        scores: new Map(),
        query: '',
        loading: false,
    },
    styleRules: {
        nodeStyles: new Map(),
        allMatches: new Map(),
    },
    keyboard: {
        shift: false,
    },
    hotkeys: {
        searchTerm: '',
        conflictingHotkeys: new Map(),
    },
    outline: {
        collapsedParents: new Set(),
        hiddenNodes: new Set(),
    },
});
export type ActiveBranch = {
    childGroups: Set<string>;
    sortedParentNodes: string[];
    group: string;
    column: string;
    node: string;
};
export type DNDState = {
    childGroups: Set<string>;
    node: string;
};
export type EditingState = {
    activeNodeId: string;
    isInSidebar: boolean;
};
