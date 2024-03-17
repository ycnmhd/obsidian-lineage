import { getActiveView } from '../get-active-view';
import invariant from 'tiny-invariant';

export const getBreadcrumbs = async () => {
    const view = await getActiveView();
    const breadcrumbs = await view.$('.breadcrumbs');
    invariant(breadcrumbs);
    return await breadcrumbs.$$('.breadcrumbs-item');
};
