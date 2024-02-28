import { getContext } from 'svelte';
import { DocumentStore } from 'src/view/view';
import Lineage from 'src/main';

export const getStore = () => {
    return getContext('store') as DocumentStore;
};

export const getPlugin = () => {
    return getContext('plugin') as Lineage;
};
