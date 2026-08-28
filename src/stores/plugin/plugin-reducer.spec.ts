import { describe, expect, it } from 'vitest';
import { pluginReducer } from 'src/stores/plugin/plugin-reducer';
import { DefaultPluginState } from 'src/stores/plugin/default-plugin-state';

describe('plugin/zen/toggle', () => {
    it('flips zenMode from false to true', () => {
        const state = DefaultPluginState();
        pluginReducer(state, { type: 'plugin/zen/toggle' });
        expect(state.zenMode).toBe(true);
    });

    it('flips zenMode from true back to false', () => {
        const state = DefaultPluginState();
        state.zenMode = true;
        pluginReducer(state, { type: 'plugin/zen/toggle' });
        expect(state.zenMode).toBe(false);
    });
});