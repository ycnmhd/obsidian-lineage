import { getContext } from 'svelte';
import { LineageView, ViewStore } from 'src/view/view';
import Lineage from 'src/main';

export const getStore = () => {
    return getContext('store') as ViewStore;
};

export const getPlugin = () => {
    return getContext('plugin') as Lineage;
};
export const getView = () => {
    return getContext('view') as LineageView;
};
