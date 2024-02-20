import { Plugin } from 'obsidian';
import { TREE_VIEW_TYPE, TreeView } from './view/view';

interface Settings {
    mySetting: string;
}

const DEFAULT_SETTINGS: Settings = {
    mySetting: 'default',
};

export default class TreeEdit extends Plugin {
    settings: Settings;

    async onload() {
        await this.loadSettings();

        this.registerExtensions(['tree'], TREE_VIEW_TYPE);

        this.registerView(TREE_VIEW_TYPE, (leaf) => new TreeView(leaf, this));
        // await this.activateView()
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
