import invariant from 'tiny-invariant';
import { getActiveLeaf } from '../../obsidian/get-active-leaf';

export const LINEAGE_VIEW = '.lineage-main';
export const getActiveView = async () => {
    const leaf = await getActiveLeaf();
    const view = await leaf.$(LINEAGE_VIEW);
    invariant(view);
    return view;
};
