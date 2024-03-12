import { ElementHandle, Page } from '@playwright/test';
import {
    LINEAGE_CARD,
    LINEAGE_TEXTAREA,
    LINEAGE_VIEW,
    MARKDOWN_PREVIEW,
} from '../consts/selectors';
import invariant from 'tiny-invariant';
import { getLeaf } from './obsidian';

const getView = async (obsidian: Page) => {
    const leaf = await getLeaf(obsidian);
    const view = await leaf.$(LINEAGE_VIEW);
    invariant(view);
    return view;
};

export const getCard = async (obsidian: Page) => {
    const view = await getView(obsidian);
    const card = await view.$(LINEAGE_CARD);
    invariant(card);
    return card;
};

export const getTextArea = async (obsidian: Page) => {
    const view = await getView(obsidian);
    const textArea = await view.$(LINEAGE_TEXTAREA);
    invariant(textArea);
    return textArea;
};
export const getCardText = async (
    card: ElementHandle<HTMLElement | SVGElement>,
) => {
    const content = await card.$(MARKDOWN_PREVIEW);
    if (!content) throw new Error('content is undefined');
    return content.textContent();
};
