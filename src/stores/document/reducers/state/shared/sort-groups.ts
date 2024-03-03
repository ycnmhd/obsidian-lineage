import { NodeGroup } from 'src/stores/document/document-type';

export const sortGroups = (parents: NodeGroup[], children: NodeGroup[]) => {
    const parentsIndices = Object.fromEntries(
        parents
            .map((x) => x.nodes)
            .flat()
            .map((x, i) => [x, i]),
    );
    return children.sort((a, b) => {
        return parentsIndices[a.parentId] - parentsIndices[b.parentId];
    });
};
