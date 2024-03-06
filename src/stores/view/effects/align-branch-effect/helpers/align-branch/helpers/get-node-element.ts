import { NodeId } from 'src/stores/view/view-state-type';

export const getNodeElement = (container: HTMLElement, nodeId: NodeId) => {
    return container.querySelector('#' + nodeId) as HTMLElement | null;
};
