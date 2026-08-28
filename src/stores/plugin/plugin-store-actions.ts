import { DocumentStore } from 'src/view/view';

export type PluginStoreActions =
    | DeleteDocument
    | UpdateDocumentPath
    | AddDocument
    | ActiveLineageViewChange
    | RefreshDocuments
    | WorkspaceEvents
    | ToggleZenMode;

export type AddDocument = {
    type: 'plugin/documents/register-new-document-store';
    payload: {
        path: string;
        documentStore: DocumentStore;
        viewId: string;
    };
};
export type DeleteDocument = {
    type: 'plugin/documents/unregister-document-store';
    payload: {
        path: string;
    };
};

export type UpdateDocumentPath = {
    type: 'plugin/documents/update-document-path';
    payload: {
        oldPath: string;
        newPath: string;
    };
};

export type RefreshDocuments = {
    type: 'plugin/documents/refresh-active-view-of-document';
    payload: {
        views: [viewId: string, path: string][];
    };
};

export type WorkspaceEvents =
    | ActiveLineageViewChange
    | ActiveLeafChange
    | WorkspaceResize
    | LayoutReady;

export type ActiveLineageViewChange = {
    type: 'plugin/documents/update-active-view-of-document';
    payload: {
        path: string;
        viewId: string;
    };
};

export type ToggleZenMode = {
    type: 'plugin/zen/toggle';
};

export type ActiveLeafChange = {
    type: 'plugin/echo/workspace/active-leaf-change';
};

export type WorkspaceResize = {
    type: 'plugin/echo/workspace/resize';
};
export type LayoutReady = {
    type: 'plugin/echo/workspace/layout-ready';
};
