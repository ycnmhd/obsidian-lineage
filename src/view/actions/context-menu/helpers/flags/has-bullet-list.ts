export const hasBulletList = (input: string): boolean => {
    const lines = input.split('\n');
    for (const line of lines) {
        if (/^\t*- /.test(line)) {
            return true;
        }
    }
    return false;
};
