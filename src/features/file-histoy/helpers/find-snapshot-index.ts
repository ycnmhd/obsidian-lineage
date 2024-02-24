import { Snapshot } from 'src/features/file-histoy/file-history-reducer';

export const findSnapshotIndex = (snapshots: Snapshot[], id: string | null) => {
    if (!id) return -1;
    return snapshots.findIndex((snapshot) => snapshot.id === id);
};
