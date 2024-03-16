export const delay = async (milliseconds: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
export const SHORT = 150;
export const MEDIUM = 500;
export const LONG = 1500;
