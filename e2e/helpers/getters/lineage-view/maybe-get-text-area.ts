import { getActiveView } from './get-active-view';

import { LINEAGE_TEXTAREA } from './get-text-area';

export const maybeGetTextArea = async () => {
    const view = await getActiveView();
    return await view.$(LINEAGE_TEXTAREA);
};
