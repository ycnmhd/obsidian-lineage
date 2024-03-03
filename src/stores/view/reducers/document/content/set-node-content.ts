import { Content } from 'src/stores/view/view-state-type';

export type SetNodeContentAction = {
    type: 'DOCUMENT/SET_NODE_CONTENT';
    payload: {
        nodeId: string;
        content: string;
    };
};
export const setNodeContent = (
    content: Content,
    action: SetNodeContentAction,
) => {
    const nodeId = action.payload.nodeId;
    const nodeContent = content[nodeId];
    if (!nodeContent) content[nodeId] = { content: action.payload.content };
    else nodeContent.content = action.payload.content;
};
