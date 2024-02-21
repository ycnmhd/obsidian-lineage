import { defineConfig } from 'vite';

const configMain = defineConfig({
    test: {
        threads: false,
        environment: 'node',
    },
});

export default configMain;
