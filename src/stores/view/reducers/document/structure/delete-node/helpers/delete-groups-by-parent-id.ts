import { Column, Content } from 'src/stores/view/view-state-type';

export const deleteGroupsByParentId = (
    columns: Column[],
    content: Content,
    parentIds: Set<string>,
): void => {
    for (const column of columns) {
        const groups = [];
        for (const group of column.groups) {
            if (parentIds.has(group.parentId)) {
                for (const node of group.nodes) {
                    delete content[node];
                }
            } else {
                groups.push(group);
            }
        }
        column.groups = groups;
    }
};
