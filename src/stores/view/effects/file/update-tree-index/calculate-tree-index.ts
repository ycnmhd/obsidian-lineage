import { Column } from 'src/stores/view/view-state-type';

export type TreeIndexDict = { [nodeId: string]: string };

export const calculateColumnTreeIndexes = (
    columns: Column[],
): TreeIndexDict => {
    const treeIndexDict: TreeIndexDict = {};

    for (let nI = 0; nI < columns[0].groups[0].nodes.length; nI++) {
        const node = columns[0].groups[0].nodes[nI];

        treeIndexDict[node] = String(nI + 1);
    }
    for (let cI = 1; cI < columns.length; cI++) {
        const column = columns[cI];
        for (let gI = 0; gI < column.groups.length; gI++) {
            const group = column.groups[gI];
            for (let nI = 0; nI < group.nodes.length; nI++) {
                const node = group.nodes[nI];

                treeIndexDict[node] =
                    treeIndexDict[group.parentId] + '.' + (nI + 1);
            }
        }
    }
    return treeIndexDict;
};
