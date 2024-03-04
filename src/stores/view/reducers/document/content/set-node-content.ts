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
    const nodeContent = content[action.payload.nodeId];
    if (nodeContent?.content === action.payload.content) return;
    const nodeId = action.payload.nodeId;
    if (!nodeContent) content[nodeId] = { content: action.payload.content };
    else nodeContent.content = action.payload.content;
    return true;
};
