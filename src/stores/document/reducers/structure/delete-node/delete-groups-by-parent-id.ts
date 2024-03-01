import { LineageDocument } from 'src/stores/document/document-type';

export const deleteGroupsByParentId = (
    document: LineageDocument,
    parentIds: Set<string>,
): void => {
    for (const column of document.columns) {
        const groups = [];
        for (const group of column.groups) {
            if (parentIds.has(group.parentId)) {
                for (const node of group.nodes) {
                    delete document.content[node];
                }
            } else {
                groups.push(group);
            }
        }
        column.groups = groups;
    }
};
