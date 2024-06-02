import { SilentError } from 'src/lib/errors/errors';
import { Notice } from 'obsidian';
import { lang } from 'src/lang/lang';

export const onPluginError = (
    error: Error,
    location: 'reducer' | 'subscriber' | 'command',
    action: unknown,
) => {
    if (!(error instanceof SilentError)) {
        // eslint-disable-next-line no-console
        console.error(`[${location}] action: `, action);
        // eslint-disable-next-line no-console
        console.error(`[${location}]`, error);
        const message = error.message.replace(/Invariant failed(: )?/, '');
        if (message) new Notice(message);
        else new Notice(lang.error_generic);
    }
};
