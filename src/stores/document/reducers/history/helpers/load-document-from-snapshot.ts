import {
    DocumentHistory,
    LineageDocument,
    Snapshot,
} from 'src/stores/document/document-state-type';

export const loadDocumentFromSnapshot = (
    document: LineageDocument,
    snapshot: Snapshot,
    history: DocumentHistory,
) => {
    history.context.activeNodeId = snapshot.data.activeNodeId;
    document.content = JSON.parse(snapshot.data.content);
    document.columns = JSON.parse(snapshot.data.columns);
};
