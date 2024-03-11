import { MARKDOWN_PREVIEW } from 'src/e2e/helpers/consts/selectors';
import { ElementHandle } from '@playwright/test';

export const getCardText = async (
    card: ElementHandle<HTMLElement | SVGElement>,
) => {
    const content = await card.$(MARKDOWN_PREVIEW);
    if (!content) throw new Error('content is undefined');
    return content.textContent();
};
