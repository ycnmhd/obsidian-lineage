export const groupArrayByProperty = <T>(
    array: T[],
    property: keyof T,
    grouped: Record<string, T[]> = {},
): Record<string, T[]> => {
    for (const item of array) {
        const key = String(item[property]);
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    }
    for (const key of Object.keys(grouped)) {
        if (grouped[key].length === 0) {
            delete grouped[key];
        }
    }

    return grouped;
};
