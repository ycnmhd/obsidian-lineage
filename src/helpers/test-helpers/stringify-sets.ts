export const __stringifySets = <T>(object: T) =>
    JSON.stringify(object, (_key, value) =>
        value instanceof Set
            ? `_$_$_new Set([${
                  [...value].length
                      ? [...value].map((s) => `'${s}'`).join(', ')
                      : ''
              }])_$_$_`
            : value,
    ).replace(/_\$_\$_"|"_\$_\$_/g, '');
