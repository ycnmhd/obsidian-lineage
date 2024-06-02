import { LineageDocument } from 'src/stores/document/document-state-type';
import { jsonToSections } from 'src/lib/data-conversion/json-to-sections';
import { columnsToJson } from 'src/lib/data-conversion/columns-to-json';

export const text = (document: LineageDocument) =>
    jsonToSections(columnsToJson(document.columns, document.content));
