import { Page } from '@playwright/test';
import { runCommand } from './run-command';
import { delay, MEDIUM } from '../../general/helpers';
import { LINEAGE_VIEW, SEL_ACTIVE_LEAF } from '../../consts/selectors';

export const goToTab = async (obsidian: Page, tab: number) => {
    await runCommand(obsidian, `Go to tab #${tab}`);
    await delay(MEDIUM);
    await obsidian.focus(SEL_ACTIVE_LEAF);
    await obsidian.focus(LINEAGE_VIEW);
};
