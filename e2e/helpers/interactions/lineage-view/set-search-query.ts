import { Page } from '@playwright/test';
import invariant from 'tiny-invariant';
import { delay, SHORT } from '../../general/helpers';
import { getActiveView } from '../../getters/lineage-view/get-active-view';

export const SEL_SEARCH_INPUT = `input[aria-label="Search document"]`;

export const setSearchQuery = async (obsidian: Page, query: string) => {
    const view = await getActiveView(obsidian);
    const input = await view.$(SEL_SEARCH_INPUT);
    invariant(input);
    await input.focus();
    await obsidian.keyboard.type(query);
    await delay(SHORT);
};
