import { Content } from 'src/stores/document/document-state-type';

export const isEmptyDocument = (content: Content) => {
    const values = Object.values(content);
    return values.length === 1 && values[0] === null;
};
