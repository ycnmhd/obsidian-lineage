import { LineageDocumentFormat } from 'src/stores/settings/settings-type';
import { Sections } from 'src/stores/document/document-state-type';
import { LineageView } from 'src/view/view';

export const loadFullDocument = (
    view: LineageView,
    data: string,
    frontmatter: string,
    format: LineageDocumentFormat,
    activeSection: string | null,
    oldSections?: Sections,
) => {
    view.documentStore.dispatch({
        payload: {
            document: { data: data, frontmatter, position: null },
            format,
            activeSection,
            oldSections,
        },
        type: 'document/file/load-from-disk',
    });
};
