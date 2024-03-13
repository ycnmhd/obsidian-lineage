import { Page } from '@playwright/test';
import {
    getActiveCard,
    getCardsOfColumns,
    getTextArea,
} from '../getters/lineage-view';
import { saveCardUsingHotkey } from './lineage-view-hotkeys';
import invariant from 'tiny-invariant';
import {
    MARKDOWN_PREVIEW,
    SEL_CREATE_CARD_ABOVE,
    SEL_CREATE_CARD_BELOW,
    SEL_CREATE_CARD_CHILD,
    SEL_DELETE_CARD,
    SEL_EDIT_CARD,
    SEL_SAVE_CARD,
} from '../consts/selectors';
import { delay } from '../general/delay';

export const typeText = async (obsidian: Page, text: string) => {
    const textArea = await getTextArea(obsidian);
    await textArea.click();
    await obsidian.keyboard.type(text);
};

export const typeTextAndSaveIt = async (obsidian: Page, text: string) => {
    await typeText(obsidian, text);
    await saveCardUsingHotkey(obsidian);
};

const buttonSelectors = {
    above: SEL_CREATE_CARD_ABOVE,
    below: SEL_CREATE_CARD_BELOW,
    child: SEL_CREATE_CARD_CHILD,
};
export const createCardUsingButton = async (
    obsidian: Page,
    buttonType: 'above' | 'below' | 'child',
) => {
    const card = await getActiveCard(obsidian);
    await card.click();
    await card.hover();
    await delay(100);
    const button = await obsidian.$(buttonSelectors[buttonType], {
        strict: false,
    });
    invariant(button);
    await button.click();
};

export const deleteCardUsingButton = async (obsidian: Page) => {
    const card = await getActiveCard(obsidian);
    await card.click();
    await card.hover();
    await delay(100);
    const button = await obsidian.$(SEL_DELETE_CARD);
    invariant(button);
    await button.click();
};

export const selectCard = async (
    obsidian: Page,
    column: number,
    cardNumber: number,
) => {
    const card = (await getCardsOfColumns(obsidian))[column][cardNumber];
    await card.click();
    await card.waitForSelector(MARKDOWN_PREVIEW);
    await delay(100);
};

export const toggleCardEditUsingButton = async (obsidian: Page) => {
    const card = await getActiveCard(obsidian);
    await card.click();
    await card.hover();
    await delay(100);
    const button = await obsidian.$(SEL_EDIT_CARD);
    invariant(button);
    await button.click();
};

export const saveCardUsingButton = async (obsidian: Page) => {
    const card = await getActiveCard(obsidian);
    await card.click();
    await card.hover();
    await delay(100);
    const button = await obsidian.$(SEL_SAVE_CARD);
    invariant(button);
    await button.click();
};
