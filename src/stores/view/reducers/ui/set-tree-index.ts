import { TreeIndexDict } from 'src/stores/view/subscriptions/helpers/calculate-tree-index';
import { ViewState } from 'src/stores/view/view-state-type';

export type SetTreeIndex = {
    type: 'UI/SET_TREE_INDEX';
    payload: {
        treeIndex: TreeIndexDict;
    };
};

export const setTreeIndex = (
    document: ViewState['document'],
    treeIndex: TreeIndexDict,
) => {
    document.treeIndex = treeIndex;
};
