import { CMD_CLOSE_THIS_TAB_GROUP, runCommand } from './run-command';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

export const SEL_EMPTY_TAB = '.workspace-leaf-content[data-type="empty"]';
export const closeThisTabGroup = async () => {
    await runCommand(CMD_CLOSE_THIS_TAB_GROUP, false);
    await __obsidian__.focus(SEL_EMPTY_TAB);
};
