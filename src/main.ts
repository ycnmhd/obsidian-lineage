import { Plugin, WorkspaceLeaf } from 'obsidian';
import { FILE_VIEW_TYPE, LineageView } from './view/view';
import {
    setViewState,
    subscribeDocumentsTypeCacheToSettings,
} from 'src/obsidian/patches/set-view-state';
import { around } from 'monkey-around';
import {
    SettingsActions,
    settingsReducer,
} from 'src/stores/settings/settings-reducer';
import { deepMerge } from 'src/helpers/deep-merge';
import { DEFAULT_SETTINGS } from 'src/stores/settings/default-settings';
import { Store } from 'src/helpers/store/store';
import { Settings } from 'src/stores/settings/settings-type';
import { registerFileMenuEvent } from 'src/obsidian/events/workspace/register-file-menu-event';
import { registerFileRenameEvent } from 'src/obsidian/events/vault/register-file-move-event';
import { registerFileDeleteEvent } from 'src/obsidian/events/vault/register-file-delete-event';
import { addCommands } from 'src/obsidian/commands/add-commands';
import { loadCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/load-commands';
import { saveCustomHotkeys } from 'src/stores/hotkeys/effects/plugin/save-custom-hotkeys';
import { checkForHotkeyConflicts } from 'src/stores/hotkeys/effects/plugin/check-for-hotkey-conflicts';

export default class Lineage extends Plugin {
    settings: Store<Settings, SettingsActions>;

    async onload() {
        await this.loadSettings();

        this.registerView(
            FILE_VIEW_TYPE,
            (leaf) => new LineageView(leaf, this),
        );
        // @ts-ignore
        this.register(around(WorkspaceLeaf.prototype, { setViewState }));
        this.registerEvents();
        addCommands(this);
        loadCommands(this);
        this.registerEffects();
    }

    async saveSettings() {
        await this.saveData(this.settings.getValue());
    }

    async loadSettings() {
        const settings = (await this.loadData()) || {};
        this.settings = new Store<Settings, SettingsActions>(
            deepMerge(settings, DEFAULT_SETTINGS()),
            settingsReducer,
        );
        this.settings.subscribe(() => {
            this.saveSettings();
        });
        subscribeDocumentsTypeCacheToSettings(this);
    }

    private registerEvents() {
        registerFileMenuEvent(this);
        registerFileRenameEvent(this);
        registerFileDeleteEvent(this);
    }

    private registerEffects() {
        checkForHotkeyConflicts(this);
        saveCustomHotkeys(this);
    }
}
