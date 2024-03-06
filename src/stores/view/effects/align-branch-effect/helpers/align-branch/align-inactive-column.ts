import { Column } from 'src/stores/view/view-state-type';
import { alignElement } from 'src/stores/view/effects/align-branch-effect/helpers/align-branch/helpers/align-element';
import { getNodeElement } from 'src/stores/view/effects/align-branch-effect/helpers/align-branch/helpers/get-node-element';

export const alignInactiveColumn = (
    column: Column,
    container: HTMLElement,
    behavior?: ScrollBehavior,
) => {
    const nodes = column.groups.map((g) => g.nodes).flat();
    if (nodes.length > 0) {
        const element = getNodeElement(container, nodes[nodes.length - 1]);
        if (element) alignElement(container, element, behavior);
    }
};
