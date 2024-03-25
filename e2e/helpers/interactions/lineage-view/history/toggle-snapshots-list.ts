import { getSnapshotsButton } from '../../../getters/lineage-view/history/get-snapshots-button';
import { delay, SHORT } from '../../../general/delay';

export const toggleSnapshotsList = async () => {
    const button = await getSnapshotsButton();
    await button.click();
    await delay(SHORT);
};
