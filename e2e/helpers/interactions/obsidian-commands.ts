import { Page } from '@playwright/test';
import { runCommand } from './run-command';
import {
    CMD_CLOSE_OTHER_TABS,
    CMD_CLOSE_THIS_TAB_GROUP,
} from '../consts/commands';
import { LINEAGE_VIEW, SEL_EMPTY_TAB } from '../consts/selectors';

export const closeOtherTabs = async (obsidian: Page) => {
    await runCommand(obsidian, CMD_CLOSE_OTHER_TABS, false);
    await obsidian.focus(LINEAGE_VIEW);
};

export const closeThisTabGroup = async (obsidian: Page) => {
    await runCommand(obsidian, CMD_CLOSE_THIS_TAB_GROUP, false);
    await obsidian.focus(SEL_EMPTY_TAB);
};
