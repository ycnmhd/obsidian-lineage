import { describe, expect, it } from 'vitest';
import { NavigationHistory } from 'src/stores/document/document-state-type';
import { removeDeletedNavigationItems } from 'src/stores/view/reducers/ui/helpers/remove-deleted-navigation-items';

describe('add navigation history item', () => {
    it('case 1', () => {
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

        removeDeletedNavigationItems(input, content);
        expect(input).toEqual(output);
    });
    it('case 2', () => {
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
            context: undefined,
        };

        const output: NavigationHistory = {
            state: {
                activeIndex: 1,
                canGoForward: false,
                canGoBack: true,
            },
            items: ['1', '4'],
            context: undefined,
        };

        removeDeletedNavigationItems(input, content);
        expect(input).toEqual(output);
    });
});
