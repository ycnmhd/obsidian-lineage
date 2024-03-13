import { ElementHandle, Page } from '@playwright/test';
import {
    COLUMN,
    LINEAGE_ACTIVE_CARD,
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

export const getActiveCard = async (obsidian: Page) => {
    const view = await getView(obsidian);
    const card = await view.$(LINEAGE_ACTIVE_CARD);
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

export const getCardsOfColumns = async (obsidian: Page) => {
    const columns = await obsidian.$$(COLUMN);

    return await Promise.all(columns.map((c) => c.$$(LINEAGE_CARD)));
};

export const getTextsOfColumns = async (obsidian: Page) => {
    const columns = await getCardsOfColumns(obsidian);
    return (await Promise.all(
        columns.map(
            async (c) => await Promise.all(c.map((n) => getCardText(n))),
        ),
    )) as string[][];
};
