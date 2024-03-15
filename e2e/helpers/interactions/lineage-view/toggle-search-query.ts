import { Page } from '@playwright/test';
import invariant from 'tiny-invariant';

const SEL_SEARCH_TOGGLE = `button[aria-label${'Toggle search input'}]`;

export const toggleSearchQuery = async (obsidian: Page) => {
    const button = await obsidian.$(SEL_SEARCH_TOGGLE);
    invariant(button);
    await button.click();
};
