import { Column, Content } from 'src/stores/view/view-state-type';

export const generateContent = (columns: Column[]) => {
    const content: Content = {};

    columns.forEach((column) => {
        column.groups.forEach((group) => {
            const parent = content[group.parentId];
            const parentContent = parent ? parent.content + '.' : ''; // Get parent's content
            group.nodes.forEach((nodeId, index) => {
                const nodeContent = `${parentContent}${index + 1}`; // Generate node content
                content[nodeId] = { content: nodeContent };
            });
        });
    });

    return content;
};
