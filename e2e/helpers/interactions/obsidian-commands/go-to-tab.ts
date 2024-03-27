import { runCommand } from './run-command';
import { SEL_ACTIVE_LEAF } from '../../getters/obsidian/get-active-leaf';
import { delay, MEDIUM } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';
import { LINEAGE_VIEW } from '../../getters/lineage-view/card/get-active-view';

export const goToTab = async (tab: number) => {
    await runCommand(`Go to tab #${tab}`);
    await delay(MEDIUM);
    await __obsidian__.focus(SEL_ACTIVE_LEAF);
    await __obsidian__.focus(LINEAGE_VIEW);
};
