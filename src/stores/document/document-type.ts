export type ColumnNode = string;
export type NodeGroup = {
    parentId: string;
    nodes: ColumnNode[];
};
export type Column = {
    id: string;
    groups: NodeGroup[];
};
export type Columns = Column[];
export type Content = {
    [nodeId: string]:
        | undefined
        | {
              content: string;
          };
};
export type LineageDocument = {
    columns: Column[];
    content: Content;
};

export type TreeState = {
    activeBranch: {
        parentNodes: Set<string>;
        childNodes: Set<string>;
        childGroups: Set<string>;
        siblingNodes: Set<string>;
        node: string;
        sortedParentNodes: ColumnNode[];
        group: string;
    };
    draggedBranch: {
        childGroups: Set<string>;
        node: string;
    };
    editing: {
        activeNodeId: string;
        savePreviousNode: boolean;
    };
};
export type DocumentInstance = {
    document: LineageDocument;
    state: TreeState;
};

export type DocumentState = DocumentInstance & {
    ui: {
        showHistorySidebar: boolean;
        showHelpSidebar: boolean;
    };
    file: {
        path: string | null;
        frontmatter: string;
    };
};
