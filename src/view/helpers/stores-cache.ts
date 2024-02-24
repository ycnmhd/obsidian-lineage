import { DocumentStore } from 'src/view/view';

export const deletePath = (oldPath: string) => {
    if (oldPath in stores) {
        const oldEntry = stores[oldPath];
        delete stores[oldPath];
        oldEntry.dispatch({
            type: 'FS/SET_FILE_PATH',
            payload: {
                path: null,
            },
        });
    }
};
export const updatePath = (oldPath: string, newPath: string) => {
    if (oldPath in stores) {
        const oldEntry = stores[oldPath];
        delete stores[oldPath];
        stores[newPath] = oldEntry;
        oldEntry.dispatch({
            type: 'FS/SET_FILE_PATH',
            payload: {
                path: newPath,
            },
        });
    }
};
export const stores: {
    [path: string]: DocumentStore;
} = {};
