const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    onwarn: (warning, handler) => {
        if (warning.code.startsWith('a11y-')) {
            return;
        }
        handler(warning);
    },
};

export default config;
