import { getNavigateBackButton } from '../../../getters/lineage-view/navigation/get-navigate-back-button';

export const navigateBackUsingButton = async () => {
    const button = await getNavigateBackButton();
    await button.click();
};
