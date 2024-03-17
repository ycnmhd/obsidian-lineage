import { getCardsOfColumns } from './get-cards-of-columns';
import invariant from 'tiny-invariant';

export const getCardId = async (column: number, cardNumber: number) => {
    const card = (await getCardsOfColumns())[column][cardNumber];
    invariant(card);
    const id = await card.getAttribute('id');
    invariant(id);
    return id;
};
