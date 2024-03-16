import { getSnapshotsButton } from '../../../getters/lineage-view/history/get-snapshots-button';

export const toggleSnapshotsList = async () => {
    const button = await getSnapshotsButton();
    await button.click();
};
