import {
    Column,
    Content,
    LineageDocument,
} from 'src/stores/document/document-state-type';

import { __stringifySets } from 'src/helpers/test-helpers/stringify-sets';
import { generateContent } from 'src/helpers/test-helpers/generate-content';

const refactorContent = (IDsMap: Map<string, string>, content: Content) => {
    const indexBasedContent: string[] = [];
    for (const [newId, oldID] of IDsMap.entries()) {
        if (!newId.startsWith('n')) continue;
        indexBasedContent.push(
            `[${newId}]: { content: "${content[oldID]?.content}" }`,
        );
    }
    return `"content": {${indexBasedContent.join(',')}}`;
};

const createIDsMap = (content: Content, columns: Column[]) => {
    const IDsMap = new Map<string, string>();
    let i = 0;
    for (const column of columns) {
        IDsMap.set('c' + i, column.id);
        i++;
    }
    const root = columns[0].groups[0].parentId;
    IDsMap.set('root', root);

    for (const [id, value] of Object.entries(content)) {
        if (!value) continue;
        const content = value.content.replace(/\./g, '_');
        const newId = `n${content}`;
        IDsMap.set(newId, id);
    }
    return IDsMap;
};

const replaceIDs = (IDsMap: Map<string, string>, columns: Column[]) => {
    let inputString = __stringifySets({
        columns: columns,
    });
    for (const [id, oldId] of IDsMap.entries()) {
        inputString = inputString.replace(
            new RegExp(`'${oldId}'|"${oldId}"`, 'g'),
            id,
        );
    }
    return inputString;
};

const createVariableDeclarations = (IDsMap: Map<string, string>) => {
    return (
        [...IDsMap.entries()]
            .map(([id, oldId]) => `const ${id} = "${oldId}";`)
            .join('\n') + '\n'
    );
};

const insertContent = (input: string, content: string) => {
    return `${input.replace(/}$/, ',' + content + '}')}`;
};

const insertVariableName = (input: string, name: string) => {
    return `const ${name} = ${input}`;
};
export const __logDocument__ = (
    input: Partial<LineageDocument> & { columns: Column[] },
    name: string,
    variables = true,
) => {
    const content: Content = input.content || generateContent(input.columns);

    const IDsMap = createIDsMap(content, input.columns);

    let output = replaceIDs(IDsMap, input.columns);

    if (input.content) {
        const content = refactorContent(IDsMap, input.content);
        output = insertContent(output, content);
    }
    output = insertVariableName(output, name);
    if (variables) {
        const variableDeclarations = createVariableDeclarations(IDsMap);
        output = variableDeclarations + output;
    }

    // eslint-disable-next-line no-console
    console.log(output);
    return output;
};
