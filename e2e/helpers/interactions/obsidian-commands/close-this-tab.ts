import { CMD_CLOSE_CURRENT_TAB, runCommand } from './run-command';

export const closeThisTab = async () => {
    await runCommand(CMD_CLOSE_CURRENT_TAB);
};
