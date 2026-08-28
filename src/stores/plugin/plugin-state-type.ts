import { DocumentStore } from 'src/view/view';

export type PluginState = {
    documents: {
        [path: string]: {
            documentStore: DocumentStore;
            viewId: string;
        };
    };
    // Global zen mode: hides all UI chrome (in every Lineage view and
    // Obsidian's native workspace chrome) until toggled off again.
    zenMode: boolean;
};
