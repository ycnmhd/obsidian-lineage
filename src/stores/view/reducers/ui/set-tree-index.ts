import { TreeIndexDict } from 'src/stores/view/effects/file/update-tree-index/calculate-tree-index';
import { ViewState } from 'src/stores/view/view-state-type';

export type SetTreeIndex = {
    type: 'UI/SET_TREE_INDEX';
    payload: {
        treeIndex: TreeIndexDict;
    };
};

export const setTreeIndex = (ui: ViewState['ui'], treeIndex: TreeIndexDict) => {
    ui.treeIndex = treeIndex;
};
