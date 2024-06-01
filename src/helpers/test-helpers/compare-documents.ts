import { LineageDocument } from 'src/stores/document/document-state-type';

export const compareDocuments = (
    docA: LineageDocument,
    docB: LineageDocument,
): boolean => {
    if (docA.columns.length !== docB.columns.length) {
        // debugger;
        return false;
    }

    for (let i = 0; i < docA.columns.length; i++) {
        const colA = docA.columns[i];
        const colB = docB.columns[i];
        if (colA.groups.length !== colB.groups.length) {
            // debugger;
            return false;
        }
        for (let j = 0; j < colA.groups.length; j++) {
            const groupA = colA.groups[j];
            const groupB = colB.groups[j];
            if (groupA.nodes.length !== groupB.nodes.length) {
                // debugger;
                return false;
            }
            for (let i = 0; i < groupA.nodes.length; i++) {
                const nodeA = groupA.nodes[i];
                const nodeB = groupB.nodes[i];
                const contentA = docA.content[nodeA]?.content;
                const contentB = docB.content[nodeB]?.content;
                if (contentA !== contentB) {
                    // debugger;
                    return false;
                }
            }
        }
    }

    return true;
};
