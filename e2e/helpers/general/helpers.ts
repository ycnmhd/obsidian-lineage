export const delay = async (milliseconds: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

let cardIndex = 1;
export const text = (b?: number) => {
    // return `card ${i++} ${Math.random().toString(16).substring(2, 5)}`;

    return `${b ? ' ' : ''}(card ${b ? `${b} b` : cardIndex++})`;
};

export const resetTextIndex = () => {
    cardIndex = 1;
};

export const SHORT = 100;
export const MEDIUM = 300;
