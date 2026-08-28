import { UndoableAction } from 'src/stores/document/document-store-actions';

export type ClipboardBranch = {
    sortedChildGroups: NodeGroup[][];
    content: Content;
    nodeId: string;
    mode: 'cut' | 'copy';
};

export type Sections = {
    section_id: Record<string, string>;
    id_section: Record<string, string>;
};
export type DocumentMeta = {
    /** nodes that are parents*/
    groupParentIds: Set<string>;
};
export type DocumentState = {
    document: LineageDocument;
    sections: Sections;
    file: {
        // path: string | null;
        frontmatter: string;
    };
    meta: DocumentMeta;
    history: DocumentHistory;
    pinnedNodes: PinnedNodesState;
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
    [nodeId: string]: {
        content: string;
    };
};

// document change history
export type DocumentHistory = History<Snapshot, { activeSection: string }>;

export type SnapshotContext = {
    affectedSection: string;
    newActiveSection: string;
    numberOfSections: number;
    action: UndoableAction;
    contentOfAffectedSection: string;
    numberOfCharacters: number;
    affectedSections?: string[];
};

export type Snapshot = {
    data: {
        content: string;
        columns: string;
    };
    context: SnapshotContext;
    created: number;
    id: string;
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

export type PinnedNodesState = {
    Ids: string[];
    nodeToCategory: Record<string, string>; // nodeId → category name
    fileCategories: string[];              // file-specific category names
};
