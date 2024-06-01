import {
    NavigationHistory,
    NodeId,
} from 'src/stores/document/document-state-type';
import {
    ActiveBranch,
    DNDState,
    EditingState,
} from 'src/stores/view/default-view-state';

export type ActiveNodesOfColumn = {
    [columnId: string]: {
        [groupId: string]: string;
    };
};

export type DocumentViewState = {
    editing: EditingState;
    activeBranch: ActiveBranch;
    dnd: DNDState;
    activeNode: string;
    activeNodesOfColumn: ActiveNodesOfColumn;
};
export type ViewState = {
    search: {
        query: string;
        results: Set<NodeId>;
        searching: boolean;
        showInput: boolean;
        fuzzySearch: boolean;
    };
    ui: {
        controls: {
            showHistorySidebar: boolean;
            showHelpSidebar: boolean;
            showSettingsSidebar: boolean;
        };
    };
    document: DocumentViewState;
    navigationHistory: NavigationHistory;
};
