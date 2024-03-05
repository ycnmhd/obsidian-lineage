import { __stringifySets } from 'src/helpers/test-helpers/stringify-sets';

export const __log__ = <T>(object: T, name: string, post = '') => {
    console.log(`const ${name} = ${__stringifySets(object)} ${post}`);
};
