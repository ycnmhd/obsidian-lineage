import { describe, expect, it } from 'vitest';
import { NavigationHistory } from 'src/stores/view/view-state-type';
import { addNavigationHistoryItem } from 'src/stores/view/reducers/ui/helpers/add-navigation-history-item';

describe('add navigation history item', () => {
    it('should not add a duplicate', () => {
        const contentItem = { content: '' };
        const content = {
            1: contentItem,
            2: null,
            3: null,
            4: null,
        };

        const input: NavigationHistory = {
            state: {
                activeIndex: 3,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '2', '3', '4'],
        };

        const output: NavigationHistory = {
            state: {
                activeIndex: 3,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '2', '3', '4'],
        };

        addNavigationHistoryItem(input, content, '4');
        expect(input).toEqual(output);
    });
    it('should not add a duplicate after removing obsolete items', () => {
        const contentItem = { content: '' };
        const content = {
            1: contentItem,
            2: null,
            4: null,
        };

        const input: NavigationHistory = {
            state: {
                activeIndex: 3,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '4', '3', '4'],
        };

        const output: NavigationHistory = {
            state: {
                activeIndex: 1,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '4'],
        };

        addNavigationHistoryItem(input, content, '4');
        expect(input).toEqual(output);
    });
});
