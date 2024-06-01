import { parseDelimiter } from 'src/stores/view/helpers/json-to-md/markdown-to-json/helpers/delimiter';

const getSectionComment = (level: number, state: State): string => {
    while (state.sectionNumbers.length < level) {
        state.sectionNumbers.push(0);
    }

    state.sectionNumbers[level - 1]++;
    // reset all lower levels
    for (let i = level; i < state.sectionNumbers.length; i++) {
        state.sectionNumbers[i] = 0;
    }

    const section = state.sectionNumbers
        .slice(0, level)
        .filter((num) => num > 0)
        .join('.');
    state.numberOfSections++;
    return `<!--section: ${section}-->`;
};

type State = {
    sectionNumbers: number[];
    numberOfSections: number;
};

export const annotateNodeBasedOnHeadings = (input: string): string => {
    const lines = input.split('\n');
    const state: State = {
        numberOfSections: 0,
        sectionNumbers: [],
    };
    const outputLines: string[] = [];
    let foundFirstHeading = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (parseDelimiter(line)) return input;
        const headingMatch = line.match(/^(#+) (.+)/);
        if (headingMatch) {
            const textAboveFirstHeading =
                !foundFirstHeading && outputLines.filter((x) => x).length;
            if (textAboveFirstHeading) {
                const sectionComment = getSectionComment(1, state);
                outputLines.unshift(sectionComment);
            }
            foundFirstHeading = true;
            const level = headingMatch[1].length;
            const sectionComment = getSectionComment(level, state);
            outputLines.push(sectionComment);
        }
        outputLines.push(line);
    }

    if (state.numberOfSections < 2) return input;
    return outputLines.join('\n');
};
