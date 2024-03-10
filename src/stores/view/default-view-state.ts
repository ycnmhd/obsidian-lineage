import { ViewState } from 'src/stores/view/view-state-type';

export const defaultViewState = (): ViewState => ({
    document: {
        columns: [],
        content: {},
        state: {
            activeNode: '',
        },
    },
    ui: {
        state: {
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
            editing: {
                activeNodeId: '',
            },
        },
        showHistorySidebar: false,
        showHelpSidebar: false,
        zoomLevel: 1,
        treeIndex: {},
    },
    file: {
        path: null,
        frontmatter: '',
    },
    history: {
        items: [],
        state: {
            activeIndex: -1,
            canGoBack: false,
            canGoForward: false,
        },
    },
    navigationHistory: {
        items: [],
        state: {
            activeIndex: -1,
            canGoBack: false,
            canGoForward: false,
        },
    },
    search: {
        query: '',
        results: new Set(),
        searching: false,
        showInput: false,
    },
});
