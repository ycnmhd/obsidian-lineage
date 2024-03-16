import { ElementHandle } from '@playwright/test';
import invariant from 'tiny-invariant';

export const MARKDOWN_PREVIEW = '.content';
export const getCardText = async (
    card: ElementHandle<HTMLElement | SVGElement>,
) => {
    const content = await card.$(MARKDOWN_PREVIEW);
    invariant(content);
    return content.textContent();
};
