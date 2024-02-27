import { DocumentState } from 'src/stores/document/document-reducer';

export const initialDocumentState = (): DocumentState => ({
    columns: [],
    state: {
        activeBranch: {
            node: '',
            childNodes: new Set<string>(),
            childGroups: new Set<string>(),
            parentNodes: new Set<string>(),
            siblingNodes: new Set<string>(),
            sortedParentNodes: [],
        },
        draggedBranch: {
            node: '',
            childGroups: new Set<string>(),
        },
        editing: {
            activeNodeId: '',
            savePreviousNode: false,
        },
        ui: {
            showHistorySidebar: false,
            showHelpSidebar: false,
        },
    },
    file: {
        path: null,
        frontmatter: '',
    },
});
