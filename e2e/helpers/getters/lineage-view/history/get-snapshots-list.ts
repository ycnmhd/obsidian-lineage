import invariant from 'tiny-invariant';
import { getActiveView } from '../card/get-active-view';
import { toggleSnapshotsList } from '../../../interactions/lineage-view/history/toggle-snapshots-list';

export const SEL_SNAPSHOTS_LIST = '.snapshots-list';
export const getSnapshotsList = async () => {
    const view = await getActiveView();
    await view.focus();
    let snapshots = await view.$(SEL_SNAPSHOTS_LIST);
    if (!snapshots) {
        await toggleSnapshotsList();
        snapshots = await view.$(SEL_SNAPSHOTS_LIST);
    }
    invariant(snapshots);
    return snapshots.$$('.snapshot');
};
