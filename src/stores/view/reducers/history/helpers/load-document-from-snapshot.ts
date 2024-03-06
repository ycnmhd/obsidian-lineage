import { DocumentState, Snapshot } from 'src/stores/view/view-state-type';

export const loadDocumentFromSnapshot = (
    document: DocumentState,
    snapshot: Snapshot,
) => {
    document.state = JSON.parse(snapshot.data.state);
    document.content = JSON.parse(snapshot.data.content);
    document.columns = JSON.parse(snapshot.data.columns);
};
