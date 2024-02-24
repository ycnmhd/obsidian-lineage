const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'long' });
export const relativeTime = (updated: number) => {
    const difference = Date.now() - updated;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor(difference / (1000 * 60));
    const seconds = Math.floor(difference / 1000);

    let relativeTime;
    if (days > 0) {
        relativeTime = rtf1.format(-days, 'day');
    } else if (hours > 0) {
        relativeTime = rtf1.format(-hours, 'hour');
    } else if (minutes > 0) {
        relativeTime = rtf1.format(-minutes, 'minute');
    } else if (seconds >= 30) {
        relativeTime = 'A moment ago';
    } else {
        relativeTime = 'Just now';
    }
    return relativeTime;
};
