export const __log__ = <T>(object: T, name: string) => {
    console.log(
        `const ${name} = ${JSON.stringify(object, (_key, value) =>
            value instanceof Set
                ? `_$_$_new Set([${
                      [...value].length
                          ? [...value].map((s) => `'${s}'`).join(', ')
                          : ''
                  }])_$_$_`
                : value,
        )}`.replace(/_\$_\$_"|"_\$_\$_/g, ''),
    );
};
