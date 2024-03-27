import {
    NavigationHistory,
    NodeId,
} from 'src/stores/document/document-state-type';
import { TreeIndexDict } from 'src/stores/view/subscriptions/helpers/calculate-tree-index';
import {
    ActiveBranch,
    DNDState,
    EditingState,
} from 'src/stores/view/default-view-state';

export type DocumentViewState = {
    treeIndex: TreeIndexDict;
    editing: EditingState;
    activeBranch: ActiveBranch;
    dnd: DNDState;
    activeNode: string;
};
export type ViewState = {
    search: {
        query: string;
        results: Set<NodeId>;
        searching: boolean;
        showInput: boolean;
    };
    ui: {
        showHistorySidebar: boolean;
        showHelpSidebar: boolean;
        zoomLevel: number;
    };
    document: DocumentViewState;
    navigationHistory: NavigationHistory;
};
