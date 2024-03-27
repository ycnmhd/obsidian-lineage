import { CMD_CLOSE_OTHER_TABS, runCommand } from './run-command';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';
import { LINEAGE_VIEW } from '../../getters/lineage-view/card/get-active-view';

export const closeOtherTabs = async () => {
    await runCommand(CMD_CLOSE_OTHER_TABS, false);
    await __obsidian__.focus(LINEAGE_VIEW);
};
