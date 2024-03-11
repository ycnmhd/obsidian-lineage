import { Page } from '@playwright/test';
import { PROMPT_INPUT } from '../consts/selectors';

export const runCommand = async (obsidian: Page, commandName: string) => {
    await obsidian.waitForSelector('.workspace-tabs');
    await obsidian.keyboard.press('Control+P');
    await obsidian.waitForSelector(PROMPT_INPUT);
    await obsidian.keyboard.type(commandName);
    await obsidian.keyboard.press('Enter');
};
