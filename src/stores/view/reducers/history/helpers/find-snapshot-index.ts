import { Snapshot } from 'src/stores/view/view-state-type';

export const findSnapshotIndex = (snapshots: Snapshot[], id: string | null) => {
    if (!id) return -1;
    return snapshots.findIndex((snapshot) => snapshot.id === id);
};
