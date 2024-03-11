import { expect, test } from '@playwright/test';
import { _electron as electron } from 'playwright-core';
import { runCommand } from 'src/e2e/helpers/interactions/run-command';
import {
    COLUMN,
    LINEAGE_CARD,
    LINEAGE_VIEW,
} from 'src/e2e/helpers/consts/selectors';
import { getCardText } from 'src/e2e/helpers/getters/get-card-text';
import {
    CMD_CLOSE_OTHER_TABS,
    CMD_CREATE_CARD,
} from 'src/e2e/helpers/consts/commands';

test('should save node before moving it', async ({ page }) => {
    const electronApp = await electron.launch({
        executablePath: process.env.OBSIDIAN_EXECUTABLE_PATH,
    });

    const obsidian = await electronApp.firstWindow();
    await runCommand(obsidian, CMD_CREATE_CARD);
    await obsidian.focus(LINEAGE_VIEW);
    await runCommand(obsidian, CMD_CLOSE_OTHER_TABS, false);
    await obsidian.focus(LINEAGE_VIEW);

    // create a card
    await obsidian.focus(LINEAGE_CARD);
    const n1_text = 'card 1';
    await obsidian.keyboard.type(n1_text);

    // create a card below
    await obsidian.keyboard.press('Control+J');
    const n2_text = 'card 2';
    await obsidian.keyboard.type(n2_text);

    // move card 2 right without saving
    await obsidian.keyboard.press('Shift+Alt+ArrowRight');

    // assert that both cards are saved
    const columns = await obsidian.$$(COLUMN);
    expect(columns.length).toBe(2);

    // assert n1 content
    const c1_cards = await columns[0].$$(LINEAGE_CARD);
    expect(c1_cards.length).toBe(1);
    expect(await getCardText(c1_cards[0])).toEqual(n1_text);

    // assert n2 content
    const c2_cards = await columns[1].$$(LINEAGE_CARD);
    expect(c2_cards.length).toBe(1);
    expect(await getCardText(c2_cards[0])).toEqual(n2_text);
});
