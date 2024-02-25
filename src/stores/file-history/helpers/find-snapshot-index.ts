import { Snapshot } from 'src/stores/file-history/file-history-reducer';

export const findSnapshotIndex = (snapshots: Snapshot[], id: string | null) => {
    if (!id) return -1;
    return snapshots.findIndex((snapshot) => snapshot.id === id);
};
