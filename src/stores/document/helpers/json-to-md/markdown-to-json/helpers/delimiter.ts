export const level = (parentNumber: string, index: number) =>
    `${parentNumber ? parentNumber + '.' : ''}${index}`;
export const delimiter = (parentNumber: string, index: number) =>
    `\n<!--section: ${level(parentNumber, index)}-->`;

const delimiterRegex = /\s*<!--\s*section:\s*((\d\.?)*(\d))[\w\s]*-->/;
export const parseDelimiter = (line: string) => {
    const results = delimiterRegex.exec(line);
    if (results) {
        const result = results[1];
        const split = result.split('.');
        const index = split[split.length - 1] as string;
        const parent = result.substring(0, result.length - index.length - 1);
        return [parent, index, result];
    }
};
