import { MatrixNode } from '../document-reducer';
import { id } from 'src/helpers/id';

export const createNode = (
    parentId: string,
    __nodeId__?: string,
): MatrixNode => ({
    id: __nodeId__ || id.node(),
    parentId,
    content: '',
});
