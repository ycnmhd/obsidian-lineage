import { Page } from '@playwright/test';
import { getActiveView } from './get-active-view';
import { LINEAGE_TEXTAREA } from '../../consts/selectors';

export const maybeGetTextArea = async (obsidian: Page) => {
    const view = await getActiveView(obsidian);
    return await view.$(LINEAGE_TEXTAREA);
};
