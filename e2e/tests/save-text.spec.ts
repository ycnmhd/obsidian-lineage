import { expect, test } from '@playwright/test';
import { LINEAGE_CARD } from '../helpers/consts/selectors';
import { runCommand } from '../helpers/interactions/run-command';
import { CMD_CREATE_FILE } from '../helpers/consts/commands';
import { getCardText } from '../helpers/getters/lineage-view';
import { closeObsidian, getObsidian } from '../helpers/getters/obsidian';
import { closeOtherTabs } from '../helpers/interactions/obsidian-commands';

test('should save text', async ({ page }) => {
    const obsidian = await getObsidian();
    await runCommand(obsidian, CMD_CREATE_FILE);
    await closeOtherTabs(obsidian);

    const typedText = 'card 1';
    await obsidian.keyboard.type(typedText);
    await obsidian.keyboard.press('Control+Shift+Enter');

    const cards = await obsidian.$$(LINEAGE_CARD);
    expect(cards.length).toBe(1);
    expect(await getCardText(cards[0])).toEqual(typedText);
    await closeObsidian();
});
