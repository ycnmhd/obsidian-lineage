import {
    Column,
    Content,
    DocumentInstanceState,
    DocumentState,
} from 'src/stores/view/view-state-type';

import { __stringifySets } from 'src/helpers/test-helpers/stringify-sets';

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

const replaceIDs = (
    IDsMap: Map<string, string>,
    columns: Column[],
    state: DocumentInstanceState,
) => {
    let inputString = __stringifySets({
        columns: columns,
        state: state,
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
    input: DocumentState,
    name: string,
    variables = true,
) => {
    const IDsMap = createIDsMap(input.content, input.columns);

    let output = replaceIDs(IDsMap, input.columns, input.state);

    const content = refactorContent(IDsMap, input.content);

    output = insertContent(output, content);
    output = insertVariableName(output, name);
    if (variables) {
        const variableDeclarations = createVariableDeclarations(IDsMap);
        output = variableDeclarations + output;
    }

    console.log(output);
    return output;
};
