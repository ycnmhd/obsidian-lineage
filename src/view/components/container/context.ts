import { getContext } from 'svelte';
import { LineageView } from 'src/view/view';
import Lineage from 'src/main';

export const getPlugin = () => {
    return getContext('plugin') as Lineage;
};
export const getView = () => {
    return getContext('view') as LineageView;
};
