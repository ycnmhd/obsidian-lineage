export const clone = <T>(object: T): T => JSON.parse(JSON.stringify(object));
