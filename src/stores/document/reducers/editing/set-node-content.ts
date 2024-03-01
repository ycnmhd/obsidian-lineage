import { DocumentState } from 'src/stores/document/document-type';

export type SetNodeContentAction = {
    type: 'SET_NODE_CONTENT';
    payload: {
        nodeId: string;
        content: string;
    };
};
export const setNodeContent = (
    state: DocumentState,
    action: SetNodeContentAction,
) => {
    const nodeId = action.payload.nodeId;
    const nodeContent = state.document.content[nodeId];
    if (!nodeContent)
        state.document.content[nodeId] = { content: action.payload.content };
    else nodeContent.content = action.payload.content;
};
