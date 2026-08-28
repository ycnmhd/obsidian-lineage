import Lineage from 'src/main';

/**
 * Body class applied while global zen mode is on. The matching CSS lives in
 * src/styles/zen.css and hides Obsidian's native workspace chrome (view
 * header, tab bar, left ribbon, left/right docks, titlebar buttons, status
 * bar).
 */
export const ZEN_MODE_CLASS = 'lineage-zen-mode';

/**
 * Body class added while the cursor is within the reveal zone at the top of
 * the window, showing the floating tab bar. The matching CSS lives in
 * src/styles/zen.css.
 */
const ZEN_TABS_VISIBLE_CLASS = 'lineage-zen-tabs-visible';

/**
 * Distance (in px) from the top of the window within which the floating tab
 * bar is revealed (i.e. "crossing the top bar").
 */
const REVEAL_THRESHOLD_PX = 56;

/**
 * Subscribes to the plugin store and toggles the zen body class on <body>
 * while global zen mode is on. It also drives the floating, responsive tab
 * bar: a window-level mouse-move listener reveals the tabs while the cursor
 * is near the top of the window and, after a short debounce, hides them again
 * once the cursor moves away.
 */
export const subscribeZenModeToBody = (plugin: Lineage) => {
    const body = document.body;

    // Wait this long (ms) after the cursor leaves the reveal zone before
    // hiding the tabs, so brief excursions don't flicker the bar.
    const HIDE_DELAY_MS = 500;

    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const showTabs = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        body.addClass(ZEN_TABS_VISIBLE_CLASS);
    };
    const hideTabs = (delay = HIDE_DELAY_MS) => {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            body.removeClass(ZEN_TABS_VISIBLE_CLASS);
            hideTimeout = null;
        }, delay);
    };
    // How long (ms) the tabs stay visible after the active tab is changed via
    // hotkey, independent of the hover debounce.
    const PULSE_DELAY_MS = 2000;
    // Show the tabs briefly even when the cursor isn't near the top (e.g. when
    // the active tab is changed with a hotkey). We schedule a hide with the
    // longer pulse delay because no mouse-move will come to hide them. If the
    // cursor is (or moves to) the top zone, showTabs() from the mouse handler
    // cancels this pending hide and keeps them up.
    const pulseTabs = () => {
        if (body.hasClass(ZEN_MODE_CLASS)) {
            showTabs();
            hideTabs(PULSE_DELAY_MS);
        }
    };

    const onZenChange = (zenMode: boolean) => {
        if (zenMode) {
            body.addClass(ZEN_MODE_CLASS);
        } else {
            body.removeClass(ZEN_MODE_CLASS);
            body.removeClass(ZEN_TABS_VISIBLE_CLASS);
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        }
    };
    // Apply the current state immediately, then keep in sync.
    onZenChange(plugin.store.getValue().zenMode);
    const unsubscribeStore = plugin.store.subscribe((state) =>
        onZenChange(state.zenMode),
    );

    const onMouseMove = (event: MouseEvent) => {
        const nearTop = event.clientY <= REVEAL_THRESHOLD_PX;
        if (body.hasClass(ZEN_MODE_CLASS)) {
            if (nearTop) {
                showTabs();
            } else {
                hideTabs();
            }
        }
    };
    document.addEventListener('mousemove', onMouseMove);
    const onMouseLeave = () => hideTabs();
    document.addEventListener('mouseleave', onMouseLeave);

    // Reveal the tab bar when the active tab changes (e.g. switching tabs with
    // a hotkey like Ctrl+Tab), so the tabs are visible while cycling through
    // them, then hide again after the debounce.
    const onLeafChange = () => pulseTabs();
    plugin.registerEvent(
        plugin.app.workspace.on('active-leaf-change', onLeafChange),
    );

    return () => {
        unsubscribeStore();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseleave', onMouseLeave);
        if (hideTimeout) clearTimeout(hideTimeout);
        body.removeClass(ZEN_MODE_CLASS);
        body.removeClass(ZEN_TABS_VISIBLE_CLASS);
    };
};
