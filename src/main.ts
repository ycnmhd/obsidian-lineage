import { Plugin, WorkspaceLeaf } from 'obsidian';
import { TREE_VIEW_TYPE, TreeView } from './view/view';
import {
    setViewState,
    subscribeDocumentsTypeCacheToSettings,
} from 'src/patches/set-view-state';
import { around } from 'monkey-around';
import {
    SettingsActions,
    settingsReducer,
} from 'src/settings/settings-reducer';
import { deepMerge } from 'src/helpers/deep-merge';
import { DEFAULT_SETTINGS } from 'src/settings/default-settings';
import { Store } from 'src/helpers/store';
import { Settings } from 'src/settings/settings-type';
import { registerFileMenuEvent } from 'src/events/workspace/register-file-menu-event';
import { registerFileRenameEvent } from 'src/events/vault/register-file-move-event';
import { registerFileDeleteEvent } from 'src/events/vault/register-file-delete-event';

export default class TreeEdit extends Plugin {
    settings: Store<Settings, SettingsActions>;

    async onload() {
        await this.loadSettings();

        this.registerExtensions(['tree'], TREE_VIEW_TYPE);

        this.registerView(TREE_VIEW_TYPE, (leaf) => new TreeView(leaf, this));
        // @ts-ignore
        this.register(around(WorkspaceLeaf.prototype, { setViewState }));
        this.registerEvents();
    }

    onunload() {}

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
}
