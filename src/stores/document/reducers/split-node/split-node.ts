import { LineageDocument } from 'src/stores/document/document-state-type';
import { SilentError } from 'src/stores/view/helpers/errors';
import { pasteNode } from 'src/stores/document/reducers/clipboard/paste-node/paste-node';
import { deleteNode } from 'src/stores/document/reducers/delete-node/delete-node';
import { findChildGroup } from 'src/stores/view/helpers/search/find-child-group';
import { lang } from 'src/lang/lang';
import { annotateNodeBasedOnHeadings } from 'src/stores/document/reducers/split-node/helpers/annotate-node-based-on-headings';

export type SplitNodeMode = 'heading';
export type SplitNodeAction = {
    type: 'DOCUMENT/SPLIT_NODE';
    payload: {
        target: string;
        mode: SplitNodeMode;
    };
};

export const splitNode = (
    document: LineageDocument,
    action: Pick<SplitNodeAction, 'payload'>,
) => {
    const targetNode = action.payload.target;
    const content = document.content[targetNode];
    if (!content?.content) throw new SilentError('empty node');
    const sections = annotateNodeBasedOnHeadings(content.content);
    if (sections === content.content) throw new Error(lang.cant_split_card);
    const childGroup = findChildGroup(document.columns, targetNode);
    if (childGroup) throw new Error(lang.cant_split_card_that_has_children);

    const newActiveNode = pasteNode(document, {
        payload: {
            position: 'down',
            targetNodeId: targetNode,
            text: sections,
        },
    });
    deleteNode(document, targetNode);
    return newActiveNode;
};
