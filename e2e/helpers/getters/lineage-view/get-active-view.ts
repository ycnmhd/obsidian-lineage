import { Page } from '@playwright/test';
import { getActiveLeaf } from '../obsidian';
import { LINEAGE_VIEW } from '../../consts/selectors';
import invariant from 'tiny-invariant';

export const getActiveView = async (obsidian: Page) => {
    const leaf = await getActiveLeaf(obsidian);
    const view = await leaf.$(LINEAGE_VIEW);
    invariant(view);
    return view;
};
