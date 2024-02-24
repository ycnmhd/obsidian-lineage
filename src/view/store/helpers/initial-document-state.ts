import { DocumentState } from 'src/view/store/document-reducer';

export const initialDocumentState = (): DocumentState => ({
    columns: [],
    state: {
        activeBranch: {
            node: '',
            childNodes: new Set<string>(),
            childGroups: new Set<string>(),
            parentNodes: new Set<string>(),
            siblingNodes: new Set<string>(),
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
        },
    },
    refs: {
        container: null,
    },
    file: {
        path: null,
    },
});