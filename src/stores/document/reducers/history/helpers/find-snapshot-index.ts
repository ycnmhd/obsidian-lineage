export const findSnapshotIndex = (
    snapshots: { id: string }[],
    id: string | null,
) => {
    if (!id) return -1;
    return snapshots.findIndex((snapshot) => snapshot.id === id);
};
