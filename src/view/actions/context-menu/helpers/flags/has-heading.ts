export const hasHeading = (input: string): boolean => {
    const lines = input.split('\n');
    for (const line of lines) {
        if (/^#+\s+/.test(line)) {
            return true;
        }
    }
    return false;
};
