import { Page } from '@playwright/test';
import { PROMPT_INPUT } from '../consts/selectors';
import { delay } from 'src/e2e/helpers/general/delay';
import invariant from 'tiny-invariant';

const SEL_PALETTE_RESULTS = '.prompt-results';
const SEL_PALETTE_ITEM = '.suggestion-item';

export const runCommand = async (
    obsidian: Page,
    commandName: string,
    required = true,
) => {
    await obsidian.waitForSelector('.workspace-tabs');
    await obsidian.keyboard.press('Control+P');
    await obsidian.waitForSelector(PROMPT_INPUT);
    await obsidian.keyboard.type(commandName);
    await delay(500);

    // find matching command
    const results = await obsidian.$(SEL_PALETTE_RESULTS);
    invariant(results);
    const items = await results.$$(SEL_PALETTE_ITEM);
    const item = items[0];

    let content: string | null = null;
    if (item) content = await item.textContent();
    if (content && content.includes(commandName.replace(': ', ''))) {
        await obsidian.keyboard.press('Enter');
    } else {
        if (required) {
            throw new Error('could not find command');
        } else {
            await obsidian.keyboard.press('Escape');
        }
    }
    await delay(1000);
};
