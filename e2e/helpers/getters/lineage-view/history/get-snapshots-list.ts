import invariant from 'tiny-invariant';
import { getActiveView } from '../card/get-active-view';

export const SEL_SNAPSHOTS_LIST = '.snapshots-list';
export const getSnapshotsList = async () => {
    const view = await getActiveView();
    const snapshots = await view.$(SEL_SNAPSHOTS_LIST);
    invariant(snapshots);
    return snapshots.$$('.snapshot');
};
