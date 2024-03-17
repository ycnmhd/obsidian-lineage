import { delay, MEDIUM } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';
import {
    getActiveCard,
    LINEAGE_CARD_ACTIVE,
} from '../../getters/lineage-view/get-active-card';

export const editCardUsingHotkey = async () => {
    const card = await getActiveCard();
    await card.click();
    await __obsidian__.waitForSelector(LINEAGE_CARD_ACTIVE);
    await __obsidian__.keyboard.press('Enter');
    await delay(MEDIUM);
};
