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
    [nodeId: string]:
        | undefined
        | {
              content: string;
          };
};

export type DNDState = {
    childGroups: Set<string>;
    node: string;
};
export type ActiveBranch = {
    childGroups: Set<string>;
    node: string;
    sortedParentNodes: NodeId[];
    group: string;
};
export type EditingState = {
    activeNodeId: string;
    savePreviousNode: boolean;
};
export type DocumentInstanceState = {
    activeBranch: ActiveBranch;
    dnd: DNDState;
    editing: EditingState;
};
export type DocumentState = {
    columns: Column[];
    content: Content;
    state: DocumentInstanceState;
};
export type StatelessDocument = Omit<DocumentState, 'state'>;
export type ViewState = {
    document: DocumentState;
    ui: {
        showHistorySidebar: boolean;
        showHelpSidebar: boolean;
    };
    file: {
        path: string | null;
        frontmatter: string;
    };
};
