import { TFile } from 'obsidian';
import Lineage from 'src/main';
import { LINEAGE_VIEW_TYPE, LineageView } from 'src/view/view';
import { openFileInLineage } from 'src/obsidian/events/workspace/effects/open-file-in-lineage';
import { getOrDetectFormat } from './document-store-manager';
import { delay } from 'src/helpers/delay';

const waitForLineageView = async (
    plugin: Lineage,
    filePath: string,
    timeoutMs = 4000,
): Promise<LineageView | null> => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const leaf = plugin.app.workspace
            .getLeavesOfType(LINEAGE_VIEW_TYPE)
            .find(
                (l) =>
                    (l.view as { file?: { path?: string } }).file?.path ===
                    filePath,
            );
        if (leaf && leaf.view instanceof LineageView) return leaf.view;
        await delay(50);
    }
    return null;
};

const waitForSection = async (
    view: LineageView,
    section: string,
    timeoutMs = 4000,
): Promise<string | null> => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const nodeId = view.documentStore.getValue().sections.section_id[section];
        if (nodeId) return nodeId;
        await delay(50);
    }
    return null;
};

const waitForCardElement = async (
    view: LineageView,
    nodeId: string,
    timeoutMs = 4000,
): Promise<HTMLElement | null> => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const el = view.container?.querySelector(`[id="${nodeId}"]`);
        if (el) return el as HTMLElement;
        await delay(50);
    }
    return null;
};

const findLineageView = (plugin: Lineage, filePath: string) => {
    const leaf = plugin.app.workspace
        .getLeavesOfType(LINEAGE_VIEW_TYPE)
        .find(
            (l) =>
                (l.view as { file?: { path?: string } }).file?.path ===
                filePath,
        );
    return leaf && leaf.view instanceof LineageView
        ? (leaf.view as LineageView)
        : null;
};

/** Open a global card's source file in a Lineage view and jump to the node. */
export const openCardInLineage = async (
    plugin: Lineage,
    file: TFile,
    section: string,
) => {
    // reuse an already open Lineage view for this file; only open a new leaf
    // when the file isn't shown in Lineage yet
    let lineageView = findLineageView(plugin, file.path);
    if (!lineageView) {
        const format = getOrDetectFormat(plugin, file.path);
        await openFileInLineage(plugin, file, format, 'split');
        lineageView = await waitForLineageView(plugin, file.path);
        if (!lineageView) return;
    }
    plugin.app.workspace.setActiveLeaf(lineageView.leaf);
    const nodeId = await waitForSection(lineageView, section);
    if (!nodeId) return;
    lineageView.viewStore.dispatch({
        type: 'view/pinned-nodes/set-active-node',
        payload: { id: nodeId },
    });
    const el = await waitForCardElement(lineageView, nodeId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
