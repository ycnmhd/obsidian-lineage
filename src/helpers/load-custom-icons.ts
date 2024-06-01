import { addIcon } from 'obsidian';

type SvgStyleType = 'fill' | 'stroke';
const svgWrapper = (innerSVG: string, mode: SvgStyleType = 'stroke') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon" ${mode === 'fill' ? 'stroke="transparent" fill="currentColor"' : 'stroke="currentColor" fill="transparent"'}> ${innerSVG.trim().replace(/\n/g, '')}</svg>`;

type Icon = {
    name: string;
    svg: string;
    mode: SvgStyleType;
};

const cards: Icon = {
    name: 'lineage-cards',
    svg: `
    <path
    d="m 13.115181,16.644424 h 6.605231 v 5.578301 H 13.115181 Z M 4.3082043,9.2066877 H 10.913436 V 14.784989 H 4.3082043 Z m 8.8069767,0 h 6.605231 v 5.5783013 h -6.605231 z m 0,-7.4377346 h 6.605231 V 7.347254 h -6.605231 z"
    />
  `,
    mode: 'fill',
};

const split: Icon = {
    name: 'lineage-split',
    svg: `<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/>`,
    mode: 'stroke',
};

export const customIcons = { cards, split };

export const loadCustomIcons = () => {
    for (const icon of Object.values(customIcons)) {
        addIcon(icon.name, svgWrapper(icon.svg, icon.mode));
    }
};
