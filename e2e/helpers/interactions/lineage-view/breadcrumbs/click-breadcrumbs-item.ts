import { getBreadcrumbs } from '../../../getters/lineage-view/breadcrumbs/get-breadcrumbs';
import invariant from 'tiny-invariant';
import { delay, MEDIUM } from '../../../general/delay';

export const clickBreadcrumbsItem = async (index: number) => {
    const breadcrumbs = await getBreadcrumbs();
    const item = breadcrumbs[index];
    invariant(item);
    await item.click();
    await delay(MEDIUM);
};
