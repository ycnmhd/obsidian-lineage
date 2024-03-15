import { runCommand } from './run-command';
import { CMD_CLOSE_CURRENT_TAB } from '../../consts/commands';
import { Page } from '@playwright/test';

export const closeThisTab = async (obsidian: Page) => {
    await runCommand(obsidian, CMD_CLOSE_CURRENT_TAB);
};
