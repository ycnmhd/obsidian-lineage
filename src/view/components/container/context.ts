import { getContext } from 'svelte';
import { ViewStore } from 'src/view/view';
import Lineage from 'src/main';

export const getStore = () => {
    return getContext('store') as ViewStore;
};

export const getPlugin = () => {
    return getContext('plugin') as Lineage;
};
