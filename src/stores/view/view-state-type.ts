import { UndoableAction } from 'src/stores/view/view-store-actions';

export type ViewState = {
    document: DocumentState;
    ui: {
        showHistorySidebar: boolean;
        showHelpSidebar: boolean;
        state: TreeState;
        zoomLevel: number;
    };
    file: {
        path: string | null;
        frontmatter: string;
    };
    navigationHistory: NavigationHistory;
    history: DocumentHistory;
    search: {
        query: string;
        results: Set<NodeId>;
        searching: boolean;
        showInput: boolean;
    };
};

// document state
export type DocumentState = {
    columns: Column[];
    content: Content;
    state: DocumentInstanceState;
};

export type Column = {
    id: string;
    groups: NodeGroup[];
};
export type Columns = Column[];

export type NodeGroup = {
    parentId: string;
    nodes: NodeId[];
};

export type NodeId = string;

export type Content = {
    [nodeId: string]: null | {
        content: string;
    };
};

export type DocumentInstanceState = {
    activeNode: string;
};

export type StatelessDocument = Omit<DocumentState, 'state'>;

// tree state
export type TreeState = {
    activeBranch: ActiveBranch;
    dnd: DNDState;
    editing: EditingState;
};

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

// document change history
export type DocumentHistory = History<Snapshot>;

export type Snapshot = {
    data: {
        content: string;
        columns: string;
        state: string;
    };
    created: number;
    id: string;
    action: UndoableAction;
};

// navigation history
export type NavigationHistory = History<NodeId>;

export type HistoryState = {
    activeIndex: number;
    canGoBack: boolean;
    canGoForward: boolean;
};

export type History<T> = {
    items: T[];
    state: HistoryState;
};
