import { getCardsOfColumns } from '../../getters/lineage-view/get-cards-of-columns';
import { delay, SHORT } from '../../general/delay';
import { MARKDOWN_PREVIEW } from '../../getters/lineage-view/get-card-text';

export const selectCard = async (column: number, cardNumber: number) => {
    const card = (await getCardsOfColumns())[column][cardNumber];
    await card.click();
    await card.waitForSelector(MARKDOWN_PREVIEW);
    await delay(SHORT);
};
