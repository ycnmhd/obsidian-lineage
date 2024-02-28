// stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
const isObject = (item: unknown) =>
    item && typeof item === 'object' && !Array.isArray(item);

export const deepMerge = <T extends Record<string, unknown>>(
    target: T | Partial<T>,
    ...sources: (T | Partial<T>)[]
): T | Partial<T> => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                // @ts-ignore
                deepMerge(target[key], source[key]);
            } else {
                if (typeof target[key] === 'undefined')
                    Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
};
