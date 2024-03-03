import { ViewState } from 'src/stores/document/document-type';

export const defaultDocumentState = (): ViewState => ({
    document: {
        columns: [],
        content: {},
        state: {
            activeBranch: {
                node: '',
                group: '',
                childGroups: new Set<string>(),
                sortedParentNodes: [],
            },
            dnd: {
                node: '',
                childGroups: new Set<string>(),
            },
            editing: {
                activeNodeId: '',
                savePreviousNode: false,
            },
        },
    },
    ui: {
        showHistorySidebar: false,
        showHelpSidebar: false,
    },
    file: {
        path: null,
        frontmatter: '',
    },
});
