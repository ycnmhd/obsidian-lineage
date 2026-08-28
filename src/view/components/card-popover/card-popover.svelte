<script lang="ts">
    import { setContext } from 'svelte';
    import Lineage from 'src/main';
    import Node from 'src/view/components/container/column/components/group/components/card/card.svelte';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import { VirtualView } from 'src/view/components/global-categories/helpers/create-virtual-view';
    import { NodeStylesStore } from 'src/stores/view/derived/style-rules';
    import { LineageView } from 'src/view/view';
    import { renderContextMenu } from 'src/obsidian/context-menu/render-context-menu';
    import { copyLinkToBlock } from 'src/view/actions/context-menu/card-context-menu/helpers/copy-link-to-block';
    import { openCardInLineage } from 'src/view/components/global-categories/helpers/open-card-in-lineage';
    import { lang } from 'src/lang/lang';

    /**
     * Renders a single Lineage card inside a popover (used by the
     * `lineage-card-popover` view that other plugins — e.g. Hover Editor —
     * open for links pointing into a Lineage document).
     *
     * Reuses the exact card component from the main view, bound to a
     * `VirtualLineageView` for the file, so editing, links and styling behave
     * like the cards in the global categories view.
     */
    export let plugin: Lineage;
    export let virtualView: VirtualView;
    export let nodeId: string;

    setContext('plugin', plugin);
    // The card subtree reads `getView()` from svelte context; bind it to the
    // virtual view so inline editing and links operate on this file's store.
    setContext('view', virtualView as unknown as LineageView);

    const viewStore = virtualView.viewStore;
    const styleRules = NodeStylesStore(virtualView as unknown as LineageView);

    // Card actions like "Copy link to block" resolve the target card from the
    // active node of the sidebar stores (pinned/recent, depending on the
    // active sidebar tab) — exactly like in the global categories view. Set
    // both so the actions work regardless of that setting.
    const setActiveNode = () => {
        viewStore.dispatch({
            type: 'view/pinned-nodes/set-active-node',
            payload: { id: nodeId },
        });
        viewStore.dispatch({
            type: 'view/recent-nodes/set-active-node',
            payload: { id: nodeId },
        });
    };
    setActiveNode();

    $: editing = $viewStore.document.editing;
    $: pending = $viewStore.document.pendingConfirmation;
    $: section =
        virtualView.documentStore.getValue().sections.id_section[nodeId] ?? '';

    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveNode();
        const items: Parameters<typeof renderContextMenu>[1] = [
            {
                title: lang.cm_copy_link_to_block,
                icon: 'links-coming-in',
                action: () =>
                    copyLinkToBlock(
                        virtualView as unknown as LineageView,
                        true,
                    ),
            },
        ];
        const file = virtualView.file;
        if (file) {
            items.push(
                { type: 'separator' },
                {
                    title: lang.cm_open_in_lineage,
                    icon: 'link',
                    action: () => openCardInLineage(plugin, file, section),
                },
            );
        }
        renderContextMenu(e, items);
    };
</script>

<div
    class="lineage-card-popover"
    role="presentation"
    on:contextmenu={onContextMenu}
>
    <Node
        node={nodeId}
        active={ActiveStatus.node}
        editing={editing.activeNodeId === nodeId && editing.isInSidebar}
        confirmDisableEdit={editing.activeNodeId === nodeId &&
            pending.disableEdit === nodeId &&
            editing.isInSidebar}
        confirmDelete={pending.deleteNode.has(nodeId)}
        isInSidebar={true}
        firstColumn={true}
        {section}
        hasActiveChildren={false}
        hasChildren={false}
        selected={false}
        pinned={false}
        style={$styleRules.get(nodeId)}
        outlineMode={false}
        collapsed={false}
        hidden={false}
        alwaysShowCardButtons={true}
        enableDroppable={false}
    />
</div>

<style>
    .lineage-card-popover {
        display: flex;
        justify-content: center;
        padding: 16px;
        width: 100%;
    }
</style>
