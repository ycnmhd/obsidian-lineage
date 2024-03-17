import { getNavigateForwardButton } from '../../../getters/lineage-view/navigation/get-navigate-forward-button';

export const navigateForwardUsingButton = async () => {
    const button = await getNavigateForwardButton();
    await button.click();
};
