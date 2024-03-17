import { getBreadcrumbs } from './get-breadcrumbs';

export const getBreadcrumbsText = async () => {
    const breadcrumbs = await getBreadcrumbs();
    return (await Promise.all(breadcrumbs.map((el) => el.textContent()))).map(
        (t) => (t ? t.trim() : t),
    ) as string[];
};
