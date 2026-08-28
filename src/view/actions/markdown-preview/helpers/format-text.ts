const applyNbsp = (text: string) => {
    // No longer replaces empty lines with &nbsp; to preserve markdown paragraph breaks.
    // Empty lines are now left as-is so Obsidian's markdown renderer can create
    // proper paragraph breaks.
    return text;
};

export const formatText = (text: string) => {
    if (/\s+(\^[a-zA-Z0-9]{4,})$/.test(text)) {
        text = text.replace(
            /\s+(\^[a-zA-Z0-9]{4,})$/gm,
            ' <sup class="cm-blockid" data-block-id="$1">$1</sup>',
        );
    }
    if (/%%/.test(text)) {
        text = text.replace(
            /%%(.*?)%%/gms,
            `<span class="cm-comment">%\u200B%$1%\u200B%</span>`,
        );
    }
    if (/<!--/.test(text)) {
        text = text.replace(
            /<!--(.*?)-->/gms,
            '<span class="cm-comment">&lt;!--$1--&gt;</span>',
        );
    }

    // emptylines && !tables
    if (/^\s*$/gm.test(text) && !/^\|.*\|/m.test(text)) {
        text = applyNbsp(text);
    }
    return text;
};
