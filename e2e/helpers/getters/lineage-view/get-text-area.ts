import { Page } from '@playwright/test';
import { getActiveView } from './get-active-view';
import { LINEAGE_TEXTAREA } from '../../consts/selectors';
import invariant from 'tiny-invariant';

export const getTextArea = async (obsidian: Page) => {
    const view = await getActiveView(obsidian);
    const textArea = await view.$(LINEAGE_TEXTAREA);
    invariant(textArea);
    return textArea;
};
