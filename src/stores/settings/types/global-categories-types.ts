export type GlobalCategoryType = 'folder' | 'category';

export type GlobalCategoryNode = {
    id: string;
    name: string;
    type: GlobalCategoryType;
    parentId: string | null;
    children: GlobalCategoryNode[];
};

export type GlobalCardRef = {
    filePath: string;
    section: string;
};

export type GlobalCategories = {
    tree: GlobalCategoryNode[];
    globalCards: Record<string, GlobalCardRef[]>;
    /** sidebar toggle: whether global categories are offered in the sidebar */
    globalCategoriesEnabled: boolean;
};

/** namespaced value stored in `nodeToCategory` for a global category assignment */
export const globalCategoryValue = (id: string) => `global:${id}`;

export const isGlobalCategoryValue = (value: string | undefined | null) =>
    Boolean(value && value.startsWith('global:'));
