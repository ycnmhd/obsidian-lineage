import uniqid from 'uniqid';

export const id = {
    rootNode: () => uniqid('root-node-'),
    node: () => uniqid('node-'),
    column: () => uniqid('column-'),
    group: () => uniqid('group-'),
};
