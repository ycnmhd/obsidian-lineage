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
import { Store } from 'src/helpers/store';
import { Settings } from 'src/stores/settings/settings-type';
import { registerFileMenuEvent } from 'src/obsidian/events/workspace/register-file-menu-event';
import { registerFileRenameEvent } from 'src/obsidian/events/vault/register-file-move-event';
import { registerFileDeleteEvent } from 'src/obsidian/events/vault/register-file-delete-event';
import { applySnapshotEffect } from 'src/stores/file-history/effects/apply-snapshot-effect';
import { addCommands } from 'src/obsidian/commands/add-commands';

export default class Lineage extends Plugin {
    settings: Store<Settings, SettingsActions>;
    private onDestroyCallbacks: Set<() => void> = new Set();

    async onload() {
        await this.loadSettings();

        this.registerView(
            FILE_VIEW_TYPE,
            (leaf) => new LineageView(leaf, this),
        );
        // @ts-ignore
        this.register(around(WorkspaceLeaf.prototype, { setViewState }));
        this.registerEvents();
        this.registerEffects();
        addCommands(this);
    }

    onunload() {
        for (const s of this.onDestroyCallbacks) {
            s();
        }
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
        this.onDestroyCallbacks.add(applySnapshotEffect());
    }
}
