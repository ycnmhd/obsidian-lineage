import { runCommand } from './run-command';
import { CMD_UNDO_CLOSE_TAB } from '../../consts/commands';
import { Page } from '@playwright/test';

export const undoCloseTab = async (obsidian: Page) => {
    await runCommand(obsidian, CMD_UNDO_CLOSE_TAB);
};
