import { getContext } from 'svelte';
import { DocumentStore } from 'src/view/view';

export const container: {
    current: HTMLDivElement | null;
} = {
    current: null,
};

export const getStore = () => {
    const store = getContext('store');
    return store as DocumentStore;
};
