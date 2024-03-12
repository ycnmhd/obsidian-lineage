import { Page } from '@playwright/test';
import { runCommand } from './run-command';
import { CMD_CREATE_FILE } from '../consts/commands';
import { LINEAGE_VIEW } from '../consts/selectors';

export const createNewLineageFile = async (obsidian: Page) => {
    await runCommand(obsidian, CMD_CREATE_FILE);
    await obsidian.focus(LINEAGE_VIEW);
};
