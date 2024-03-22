import { Content } from 'src/stores/document/document-state-type';
import { SilentError } from 'src/stores/view/helpers/errors';

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
    const contentString = nodeContent?.content || '';
    if (contentString === action.payload.content)
        throw new SilentError('identical content');
    const nodeId = action.payload.nodeId;
    if (!nodeContent) content[nodeId] = { content: action.payload.content };
    else nodeContent.content = action.payload.content;
};
