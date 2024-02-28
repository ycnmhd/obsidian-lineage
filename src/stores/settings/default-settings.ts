import { Settings } from './settings-type';

export const DEFAULT_SETTINGS = (): Settings => ({
    documents: {},
    ui: {
        theme: 'dark',
    },
});
