import { Page } from '@playwright/test';
import { runCommand } from './run-command';
import { CMD_CLOSE_OTHER_TABS } from '../../consts/commands';
import { LINEAGE_VIEW } from '../../consts/selectors';

export const closeOtherTabs = async (obsidian: Page) => {
    await runCommand(obsidian, CMD_CLOSE_OTHER_TABS, false);
    await obsidian.focus(LINEAGE_VIEW);
};
