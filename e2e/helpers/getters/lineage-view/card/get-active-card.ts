import { getActiveView } from './get-active-view';
import invariant from 'tiny-invariant';

export const LINEAGE_CARD_ACTIVE = `.lineage-card.active-node`;
export const getActiveCard = async () => {
    const view = await getActiveView();
    const card = await view.$(LINEAGE_CARD_ACTIVE);
    invariant(card);
    return card;
};
