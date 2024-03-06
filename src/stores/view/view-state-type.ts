import { UndoableAction } from 'src/stores/view/view-reducer';

export type NodeId = string;
export type NodeGroup = {
    parentId: string;
    nodes: NodeId[];
};
export type Column = {
    id: string;
    groups: NodeGroup[];
};
export type Columns = Column[];
export type Content = {
    [nodeId: string]: null | {
        content: string;
    };
};

export type DNDState = {
    childGroups: Set<string>;
    node: string;
};
export type ActiveBranch = {
    childGroups: Set<string>;
    sortedParentNodes: NodeId[];
    group: string;
};
export type EditingState = {
    activeNodeId: string;
};
export type DocumentInstanceState = {
    activeNode: string;
};
export type DocumentState = {
    columns: Column[];
    content: Content;
    state: DocumentInstanceState;
};
export type StatelessDocument = Omit<DocumentState, 'state'>;

export type TreeState = {
    activeBranch: ActiveBranch;
    dnd: DNDState;
    editing: EditingState;
};
export type ViewState = {
    document: DocumentState;
    ui: {
        showHistorySidebar: boolean;
        showHelpSidebar: boolean;
        state: TreeState;
    };
    file: {
        path: string | null;
        frontmatter: string;
    };
    navigationHistory: NavigationHistory;
    history: DocumentHistory;
};
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
export type HistoryState = {
    activeIndex: number;
    canGoBack: boolean;
    canGoForward: boolean;
};

export type History<T> = {
    items: T[];
    state: HistoryState;
};

export type DocumentHistory = History<Snapshot>;
export type NavigationHistory = History<NodeId>;
