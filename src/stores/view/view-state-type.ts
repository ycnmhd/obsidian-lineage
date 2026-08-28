import { NavigationHistory } from 'src/stores/document/document-state-type';
import {
    ActiveBranch,
    DNDState,
    EditingState,
} from 'src/stores/view/default-view-state';
import { ConflictingHotkeys } from 'src/obsidian/helpers/get-used-hotkeys';
import { NodeStyle } from 'src/stores/settings/types/style-rules-types';
import { NodeSearchResult } from 'src/stores/view/subscriptions/effects/document-search/document-search';

export type ActiveNodesOfColumn = {
    [columnId: string]: {
        [groupId: string]: string;
    };
};

export type PendingDocumentConfirmation = {
    disableEdit: string | null;
    deleteNode: Set<string>;
};

export type DocumentViewState = {
    editing: EditingState;
    activeBranch: ActiveBranch;
    dnd: DNDState;
    activeNode: string;
    activeNodesOfColumn: ActiveNodesOfColumn;
    selectedNodes: Set<string>;
    pendingConfirmation: PendingDocumentConfirmation;
};
export type PinnedNodes = {
    activeNode: string;
    activeCategory: string; // "all" | "uncategorized" | category name
};
export type RecentNodes = {
    activeNode: string;
};
export type SimilarCardsState = {
    nodeIds: string[];
    scores: Map<string, number>;
    query: string;
    loading: boolean;
};
export type ViewState = {
    search: {
        query: string;
        results: Map<string, NodeSearchResult>;
        searching: boolean;
        showInput: boolean;
        fuzzySearch: boolean;
        showAllNodes: boolean;
    };
    ui: {
        controls: {
            showHistorySidebar: boolean;
            showHelpSidebar: boolean;
            showSettingsSidebar: boolean;
            showStyleRulesModal: boolean;
            showLeftSidebar: boolean;
        };
    };
    document: DocumentViewState;
    navigationHistory: NavigationHistory;
    pinnedNodes: PinnedNodes;
    recentNodes: RecentNodes;
    similarCards: SimilarCardsState;
    styleRules: {
        nodeStyles: Map<string, NodeStyle>;
        allMatches: Map<string, string[]>;
    };
    keyboard: {
        shift: boolean;
    };
    hotkeys: {
        searchTerm: string;
        conflictingHotkeys: ConflictingHotkeys;
    };
    outline: {
        collapsedParents: Set<string>;
        hiddenNodes: Set<string>;
    };
};
