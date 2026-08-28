import { PluginState } from 'src/stores/plugin/plugin-state-type';

export const DefaultPluginState = (): PluginState => ({
    documents: {},
    zenMode: false,
});
