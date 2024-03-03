import { DocumentState, Snapshot } from 'src/stores/view/view-state-type';

export const loadDocumentFromSnapshot = (
    document: DocumentState,
    snapshot: Snapshot,
) => {
    document.content = JSON.parse(snapshot.data.content);
    document.columns = JSON.parse(snapshot.data.columns);
    document.state = JSON.parse(snapshot.data.state);

    document.state.dnd.childGroups = new Set<string>();
    document.state.activeBranch.childGroups = new Set(
        JSON.parse(snapshot.data.sets.childGroups),
    );
};
