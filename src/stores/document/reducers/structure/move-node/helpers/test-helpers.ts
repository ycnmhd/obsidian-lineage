export const __log__ = <T>(object: T, name: string, post = '') => {
    console.log(
        `const ${name} = ${JSON.stringify(object, (_key, value) =>
            value instanceof Set
                ? `_$_$_new Set([${
                      [...value].length
                          ? [...value].map((s) => `'${s}'`).join(', ')
                          : ''
                  }])_$_$_`
                : value,
        )} ${post}`.replace(/_\$_\$_"|"_\$_\$_/g, ''),
    );
};
