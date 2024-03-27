let cardIndex = 1;
export const text = (b?: number) => {
    // return `card ${i++} ${Math.random().toString(16).substring(2, 5)}`;

    return `${b ? ' ' : ''}(card ${b ? `${b} b` : cardIndex++})`;
};

export const resetTextIndex = () => {
    cardIndex = 1;
};
