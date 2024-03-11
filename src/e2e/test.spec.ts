import { _electron as electron } from 'playwright';
import { expect, test } from '@playwright/test';
import {
    LINEAGE_CARD,
    LINEAGE_VIEW,
    MARKDOWN_PREVIEW,
} from './helpers/consts/selectors';
import { runCommand } from './helpers/interactions/run-command';

test('can run', async ({ page }) => {
    const electronApp = await electron.launch({
        executablePath: process.env.OBSIDIAN_EXECUTABLE_PATH,
    });

    const obsidian = await electronApp.firstWindow();
    await runCommand(obsidian, 'Lineage create');
    await obsidian.waitForSelector(LINEAGE_VIEW);
    await obsidian.focus(LINEAGE_VIEW);
    const typedText = 'card 1';
    await obsidian.keyboard.type(typedText);
    await obsidian.keyboard.press('Control+Shift+Enter');
    const cards = await obsidian.$$(LINEAGE_CARD);
    expect(cards.length).toBe(1);
    const content = await cards[0].$(MARKDOWN_PREVIEW);
    if (!content) throw new Error('content is undefined');
    expect(await content.textContent()).toEqual(typedText);
});
