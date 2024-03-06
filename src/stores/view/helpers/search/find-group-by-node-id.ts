import { Columns } from 'src/stores/view/view-state-type';

export const findGroupByNodeId = (columns: Columns, nodeId: string) => {
    for (const column of columns) {
        for (const group of column.groups) {
            for (const _nodeId of group.nodes) {
                if (_nodeId === nodeId) return group;
            }
        }
    }
};

export const findGroupByParentId = (columns: Columns, parentId: string) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === parentId) {
                return group;
            }
        }
    }
};
