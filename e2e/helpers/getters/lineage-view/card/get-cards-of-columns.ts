import { getActiveView } from './get-active-view';

export const COLUMN = '.column';
export const LINEAGE_CARD_ANY = '.lineage__card';
export const getCardsOfColumns = async () => {
    const view = await getActiveView();
    const columns = await view.$$(COLUMN);

    return await Promise.all(columns.map((c) => c.$$(LINEAGE_CARD_ANY)));
};
