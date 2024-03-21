import { describe, expect, it } from 'vitest';
import { NavigationHistory } from 'src/stores/document/document-state-type';
import { addNavigationHistoryItem } from 'src/stores/view/reducers/ui/helpers/add-navigation-history-item';

describe('add navigation history item', () => {
    it('should not add a duplicate', () => {
        const input: NavigationHistory = {
            state: {
                activeIndex: 3,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '2', '3', '4'],
            context: undefined,
        };

        const output: NavigationHistory = {
            state: {
                activeIndex: 3,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '2', '3', '4'],
            context: undefined,
        };

        addNavigationHistoryItem(input, '4');
        expect(input).toEqual(output);
    });
    it('should correct active index', () => {
        const input: NavigationHistory = {
            state: {
                activeIndex: 2,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '4', '3', '4'],
            context: undefined,
        };

        const output: NavigationHistory = {
            state: {
                activeIndex: 2,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '4', '3'],
            context: undefined,
        };

        addNavigationHistoryItem(input, '3');
        expect(input).toEqual(output);
    });
});
