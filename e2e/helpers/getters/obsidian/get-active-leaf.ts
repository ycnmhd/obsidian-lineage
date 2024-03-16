import invariant from 'tiny-invariant';

import { __obsidian__ } from './load-obsidian';

export const SEL_ACTIVE_LEAF = '.workspace-leaf.mod-active';
export const getActiveLeaf = async () => {
    const leaf = await __obsidian__.$(SEL_ACTIVE_LEAF);
    invariant(leaf);
    return leaf;
};
