type Logger = {
    debug: (...message: string[]) => void;
    info: (...message: string[]) => void;
    warn: (...message: string[]) => void;
    error: (...message: string[]) => void;
};

const createLogger = (env?: string): Logger => {
    const isDev = env === 'development';

    const debug = (...message: string[]) => {
        if (isDev) {
            console.log(`[DEBUG]: `, ...message);
        }
    };

    const info = (...message: string[]) => {
        if (isDev) {
            console.log(`[INFO]: `, ...message);
        }
    };

    const warn = (...message: string[]) => {
        if (isDev) {
            console.warn(`[WARN]: `, ...message);
        }
    };

    const error = (...message: string[]) => {
        console.error(`[ERROR]: `, ...message);
    };

    return { debug, info, warn, error };
};

export const logger = createLogger(process.env.NODE_ENV);
