import { ElementHandle } from '@playwright/test';
import { MARKDOWN_PREVIEW } from '../../consts/selectors';
import invariant from 'tiny-invariant';

export const getCardText = async (
    card: ElementHandle<HTMLElement | SVGElement>,
) => {
    const content = await card.$(MARKDOWN_PREVIEW);
    invariant(content);
    return content.textContent();
};
