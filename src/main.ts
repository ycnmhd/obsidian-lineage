import { Plugin, WorkspaceLeaf } from 'obsidian';
import { FILE_VIEW_TYPE, LineageView } from './view/view';
import { setViewState } from 'src/obsidian/patches/set-view-state';
import { around } from 'monkey-around';
import {
    SettingsActions,
    settingsReducer,
} from 'src/stores/settings/settings-reducer';
import { deepMerge } from 'src/helpers/deep-merge';
import { DEFAULT_SETTINGS } from 'src/stores/settings/default-settings';
import { Store } from 'src/lib/store/store';
import { Settings } from 'src/stores/settings/settings-type';
import { registerFileMenuEvent } from 'src/obsidian/events/workspace/register-file-menu-event';
import { registerFileRenameEvent } from 'src/obsidian/events/vault/register-file-move-event';
import { registerFileDeleteEvent } from 'src/obsidian/events/vault/register-file-delete-event';
import { addCommands } from 'src/obsidian/commands/add-commands';
import { loadCommands } from 'src/view/actions/keyboard-shortcuts/helpers/commands/load-commands';
import { hotkeySubscriptions } from 'src/stores/hotkeys/hotkey-subscriptions';
import { settingsSubscriptions } from 'src/stores/settings/subscriptions/settings-subscriptions';
import { DocumentsState } from 'src/stores/documents/documents-state-type';
import { DocumentsStoreAction } from 'src/stores/documents/documents-store-actions';
import { documentsReducer } from 'src/stores/documents/documents-reducer';
import { DefaultDocumentsState } from 'src/stores/documents/default-documents-state';
import { StatusBar } from 'src/obsidian/status-bar/status-bar';
import { documentsStoreSubscriptions } from 'src/stores/documents/subscriptions/documents-store-subscriptions';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { registerActiveLeafChange } from 'src/obsidian/events/workspace/register-active-leaf-change';
import { registerWorkspaceResize } from 'src/obsidian/events/workspace/register-workspace-resize';
import { registerLayoutReady } from 'src/obsidian/events/workspace/register-layout-ready';
import { loadCustomIcons } from 'src/helpers/load-custom-icons';
import { setActiveLeaf } from 'src/obsidian/patches/set-active-leaf';

export type SettingsStore = Store<Settings, SettingsActions>;
export type DocumentsStore = Store<DocumentsState, DocumentsStoreAction>;

export default class Lineage extends Plugin {
    settings: SettingsStore;
    documents: DocumentsStore;
    statusBar: StatusBar;
    async onload() {
        await this.loadSettings();
        this.documents = new Store<DocumentsState, DocumentsStoreAction>(
            DefaultDocumentsState(),
            documentsReducer,
            onPluginError,
        );
        loadCustomIcons();
        this.registerView(
            FILE_VIEW_TYPE,
            (leaf) => new LineageView(leaf, this),
        );
        this.registerPatches();
        this.registerEffects();
        this.registerEvents();
        addCommands(this);
        loadCommands(this);
        this.statusBar = new StatusBar(this);
    }

    async saveSettings() {
        await this.saveData(this.settings.getValue());
    }

    async loadSettings() {
        const settings = (await this.loadData()) || {};
        this.settings = new Store<Settings, SettingsActions>(
            deepMerge(settings, DEFAULT_SETTINGS()),
            settingsReducer,
            onPluginError,
        );
        this.settings.subscribe(() => {
            this.saveSettings();
        });
        settingsSubscriptions(this);
    }

    private registerEvents() {
        registerFileMenuEvent(this);
        registerFileRenameEvent(this);
        registerFileDeleteEvent(this);
        registerActiveLeafChange(this);
        registerWorkspaceResize(this);
        registerLayoutReady(this);
    }

    private registerEffects() {
        hotkeySubscriptions(this);
        documentsStoreSubscriptions(this);
    }

    private registerPatches() {
        this.register(around(this.app.workspace, { setActiveLeaf }));
        // @ts-ignore
        this.register(around(WorkspaceLeaf.prototype, { setViewState }));
    }
}
