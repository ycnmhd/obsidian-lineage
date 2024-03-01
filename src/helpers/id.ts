import uniqid from 'uniqid';

export const id = {
    rootNode: () => uniqid.time('r-'),
    node: () => uniqid.time('n-'),
    column: () => uniqid.time('c-'),
    snapshot: () => uniqid.time('s-'),
};
