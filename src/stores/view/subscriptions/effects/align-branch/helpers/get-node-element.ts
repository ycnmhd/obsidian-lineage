import { NodeId } from 'src/stores/document/document-state-type';

export const getNodeElement = (container: HTMLElement, nodeId: NodeId) => {
    return container.querySelector('#' + nodeId) as HTMLElement | null;
};
