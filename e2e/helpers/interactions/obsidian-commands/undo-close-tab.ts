import { CMD_UNDO_CLOSE_TAB, runCommand } from './run-command';

export const undoCloseTab = async () => {
    await runCommand(CMD_UNDO_CLOSE_TAB);
};
