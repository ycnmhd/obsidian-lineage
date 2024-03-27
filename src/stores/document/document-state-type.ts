import { UndoableAction } from 'src/stores/document/document-store-actions';

export type DocumentState = {
    document: LineageDocument;
    file: {
        path: string | null;
        frontmatter: string;
    };

    history: DocumentHistory;
};

// document
export type LineageDocument = {
    columns: Column[];
    content: Content;
};

export type Column = {
    id: string;
    groups: NodeGroup[];
};

export type NodeGroup = {
    parentId: string;
    nodes: NodeId[];
};

export type NodeId = string;

export type Columns = Column[];
export type Content = {
    [nodeId: string]: null | {
        content: string;
    };
};

// document change history
export type DocumentHistory = History<Snapshot, { activeNodeId: string }>;

export type Snapshot = {
    data: {
        content: string;
        columns: string;
        activeNodeId: string;
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

export type History<T, U = undefined> = {
    items: T[];
    state: HistoryState;
    context: U;
};
