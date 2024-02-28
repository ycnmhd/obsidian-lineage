export const slugify = (inputString: string) => {
    return inputString
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
        .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
};
