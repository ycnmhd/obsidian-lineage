import { _electron as electron } from 'playwright';
import { expect, test } from '@playwright/test';
import { LINEAGE_CARD, LINEAGE_VIEW } from './helpers/consts/selectors';
import { runCommand } from './helpers/interactions/run-command';
import { getCardText } from 'src/e2e/helpers/getters/get-card-text';
import { CMD_CREATE_CARD } from 'src/e2e/helpers/consts/commands';

test('can run', async ({ page }) => {
    const electronApp = await electron.launch({
        executablePath: process.env.OBSIDIAN_EXECUTABLE_PATH,
    });

    const obsidian = await electronApp.firstWindow();
    await runCommand(obsidian, CMD_CREATE_CARD);
    await obsidian.waitForSelector(LINEAGE_VIEW);
    await obsidian.focus(LINEAGE_VIEW);
    const typedText = 'card 1';
    await obsidian.keyboard.type(typedText);
    await obsidian.keyboard.press('Control+Shift+Enter');
    const cards = await obsidian.$$(LINEAGE_CARD);
    expect(cards.length).toBe(1);
    expect(await getCardText(cards[0])).toEqual(typedText);
});
