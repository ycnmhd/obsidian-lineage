import { Page } from '@playwright/test';
import { getActiveView } from './get-active-view';
import { LINEAGE_CARD_ACTIVE } from '../../consts/selectors';
import invariant from 'tiny-invariant';

export const getActiveCard = async (obsidian: Page) => {
    const view = await getActiveView(obsidian);
    const card = await view.$(LINEAGE_CARD_ACTIVE);
    invariant(card);
    return card;
};
