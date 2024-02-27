const md = `# Title: **Statement** of your core result or finding.
Try to make your title an assertive statement, such as:
- "Changes in cytoplasmic volume are sufficient to drive spindle scaling." 

and not
- "High-performance silicon photoanodes passivated with ultrathin nickel films for water oxidation"

Rule of thumb: if your title would look weird with a period at the end, it is probably a poor title.

Don't do [this](http://www.phdcomics.com/comics/archive/phd053106s.gif).

# Abstract
Try to tell a *story* here, no matter what your field. You are writing for human beings, not computers. What's the area, what's the problem you are trying to understand. How? What have you found?

(You are *summarizing* your core results, not *cramming* them into this tiny space).

---
###### target:  84-151 words
###### current: 43 ![](https://dl.dropboxusercontent.com/s/6k720i6vkig7siq/cross_circle.png)

<!-- URL for checkmark: https://dl.dropboxusercontent.com/s/elo7ckzspvxvx0t/checkmark.gif -->

###### (This is a word count footer. We don't have automatic word counts yet, so I use is [this Chrome extension](https://chrome.google.com/webstore/detail/word-count/pnngehidikgomgfjbpffonkeimgbpjlh))

## Introduction - "The Setup"
### [In field X, we still don't understand Y & Z.]

Write a summary of *the question(s) you are trying to answer*.
What is the state of the world before your research came along?
Also, answer the harsh but important question: *Who cares*?

In writing this, you can start general, but make sure clearly define the "before" state of the world's knowledge for the *specific area* this paper is addressing.

### Intro - Assertive Statement 1

Here you can expand on your introduction. To guide your writing, title this card with assertive statements:
Instead of "Problem Description", be direct: "The problem is that X doesn't do Y."

# Introduction

[You can write your actual paper here in this column. Then choosing "Export column 5" to Word or Markdown will help you move it to your final platform.]

You can keep notes & comments here.

...

...

### Intro - Assertive Statement 2

...

...

### Intro - Assertive Statement 3

...

...

## Materials & Methods - "The Characters"
### [We have here method A, B, and our new method C.]
You have established the core question(s) of your research. Now introduce the tools you are going to  use to understand it.

## Method A
More details on the method, experiment design, etc.

Remember that these are cards, so you can drag and drop them to rearrange if necessary.

# Methods

### Method A

Some other note. For example:

#Xusheng , make sure you include the voltage you used."

(the # syntax makes it easier to search for & filter comments directed at a specific person).

...

...

## Method B
More details on the method, experiment design, etc.

### Method B...

...

...

## Method C
More details on the method, experiment design, etc.

If you need a checklist to make sure you address all points, go ahead:
[ ] e.g. "Mention pH of the setup"
[ ] What temperature?
[ ] For how long?

### Method C

...

...

## Results
What happened (objectively)?

Do not interpret, simply state the facts.

Let's be honest: the first thing most of us do when skimming a paper is look at the figures. If your key results can be presented in figures, then start with that, and structure your paper around that.

## Key Result
You can add figures if you'd like:

![](https://dl.dropboxusercontent.com/s/gieldum0s47m25v/1-plot.jpg)

# Results

Final text for results goes here

...

...

Remember these are **cards** so you can rearrange your results at will.
Any subcards will follow.

Other results

## Discussion
Results are objective, but science isn't about listing data, it's about extracting meaning from what we observe.

What do your results tell you about the core problem you were investigating?

## Conclusion
Bring it back to the big picture. How do your results fit into the current body of knowledge?

Most importantly, how can these results help you [ask better questions](http://www.youtube.com/watch?v=nq0_zGzSc8g#t=493)?

## Conclusion (further detail)

Expand on your conclusion summary, and add more details to it.

# Conclusion

Final text for conclusion goes here

in as many

cards as you like.

## References
We don't have bibliography support yet, but we do have "named links" so you can refer to specific links by name rather than retyping it each time.

"Black holes are cool." [[1]][prl2010], and DNA is cool too [[2]][dnaRef]. But black holes are still cool, though not "absolute zero" cool [[1]][prl2010].

[prl2010]: http://arxiv.org/abs/1311.3007
[dnaRef]: http://biorxiv.org/content/early/2013/11/07/000026

## List
Or you can simply list your references here:

1. some ref
1. some other ref. Numbering fixes itself automatically.
2. A third ref.

# References

Some reference by J. Doe

Notes on this reference. 

Some other reference

## How to use this template
The idea here is to start at the far left, and clarify what the core of what you want to say is *first*, and then expand on it by moving to the right, one column at a time.

After a couple of "passes" of expanding, you will end up with your complete, and well structured paper on column 5, which you can export separately.

Here's a (somewhat dated) video which might help.
<iframe width="256" height="144" src="//www.youtube.com/embed/J4prcx0jZ9M?rel=0" frameborder="0" allowfullscreen></iframe>`;

const json = [
    {
        content:
            '# Title: **Statement** of your core result or finding.\nTry to make your title an assertive statement, such as:\n- "Changes in cytoplasmic volume are sufficient to drive spindle scaling." \n\nand not\n- "High-performance silicon photoanodes passivated with ultrathin nickel films for water oxidation"\n\nRule of thumb: if your title would look weird with a period at the end, it is probably a poor title.\n\nDon\'t do [this](http://www.phdcomics.com/comics/archive/phd053106s.gif).',
        children: [
            {
                content:
                    "# Abstract\nTry to tell a *story* here, no matter what your field. You are writing for human beings, not computers. What's the area, what's the problem you are trying to understand. How? What have you found?\n\n(You are *summarizing* your core results, not *cramming* them into this tiny space).\n\n---\n###### target:  84-151 words\n###### current: 43 ![](https://dl.dropboxusercontent.com/s/6k720i6vkig7siq/cross_circle.png)\n\n<!-- URL for checkmark: https://dl.dropboxusercontent.com/s/elo7ckzspvxvx0t/checkmark.gif -->\n\n###### (This is a word count footer. We don't have automatic word counts yet, so I use is [this Chrome extension](https://chrome.google.com/webstore/detail/word-count/pnngehidikgomgfjbpffonkeimgbpjlh))",
                children: [
                    {
                        content:
                            '## Introduction - "The Setup"\n### [In field X, we still don\'t understand Y & Z.]\n\nWrite a summary of *the question(s) you are trying to answer*.\nWhat is the state of the world before your research came along?\nAlso, answer the harsh but important question: *Who cares*?\n\nIn writing this, you can start general, but make sure clearly define the "before" state of the world\'s knowledge for the *specific area* this paper is addressing.',
                        children: [
                            {
                                content:
                                    '### Intro - Assertive Statement 1\n\nHere you can expand on your introduction. To guide your writing, title this card with assertive statements:\nInstead of "Problem Description", be direct: "The problem is that X doesn\'t do Y."',
                                children: [
                                    {
                                        content: '# Introduction',
                                        children: [],
                                    },
                                    {
                                        content:
                                            '[You can write your actual paper here in this column. Then choosing "Export column 5" to Word or Markdown will help you move it to your final platform.]',
                                        children: [
                                            {
                                                content:
                                                    'You can keep notes & comments here.',
                                                children: [],
                                            },
                                        ],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                content: '### Intro - Assertive Statement 2',
                                children: [
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                content: '### Intro - Assertive Statement 3',
                                children: [
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        content:
                            '## Materials & Methods - "The Characters"\n### [We have here method A, B, and our new method C.]\nYou have established the core question(s) of your research. Now introduce the tools you are going to  use to understand it.',
                        children: [
                            {
                                content:
                                    '## Method A\nMore details on the method, experiment design, etc.\n\nRemember that these are cards, so you can drag and drop them to rearrange if necessary.',
                                children: [
                                    {
                                        content: '# Methods',
                                        children: [],
                                    },
                                    {
                                        content: '### Method A',
                                        children: [
                                            {
                                                content:
                                                    'Some other note. For example:\n\n#Xusheng , make sure you include the voltage you used."\n\n(the # syntax makes it easier to search for & filter comments directed at a specific person).',
                                                children: [],
                                            },
                                        ],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                content:
                                    '## Method B\nMore details on the method, experiment design, etc.',
                                children: [
                                    {
                                        content: '### Method B...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                content:
                                    '## Method C\nMore details on the method, experiment design, etc.\n\nIf you need a checklist to make sure you address all points, go ahead:\n[ ] e.g. "Mention pH of the setup"\n[ ] What temperature?\n[ ] For how long?',
                                children: [
                                    {
                                        content: '### Method C',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        content:
                            "## Results\nWhat happened (objectively)?\n\nDo not interpret, simply state the facts.\n\nLet's be honest: the first thing most of us do when skimming a paper is look at the figures. If your key results can be presented in figures, then start with that, and structure your paper around that.",
                        children: [
                            {
                                content:
                                    "## Key Result\nYou can add figures if you'd like:\n\n![](https://dl.dropboxusercontent.com/s/gieldum0s47m25v/1-plot.jpg)",
                                children: [
                                    {
                                        content: '# Results',
                                        children: [],
                                    },
                                    {
                                        content:
                                            'Final text for results goes here',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                    {
                                        content: '...',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                content:
                                    'Remember these are **cards** so you can rearrange your results at will.\nAny subcards will follow.',
                                children: [
                                    {
                                        content: 'Other results',
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        content:
                            "## Discussion\nResults are objective, but science isn't about listing data, it's about extracting meaning from what we observe.\n\nWhat do your results tell you about the core problem you were investigating?",
                        children: [],
                    },
                    {
                        content:
                            '## Conclusion\nBring it back to the big picture. How do your results fit into the current body of knowledge?\n\nMost importantly, how can these results help you [ask better questions](http://www.youtube.com/watch?v=nq0_zGzSc8g#t=493)?',
                        children: [
                            {
                                content:
                                    '## Conclusion (further detail)\n\nExpand on your conclusion summary, and add more details to it.',
                                children: [
                                    {
                                        content: '# Conclusion',
                                        children: [],
                                    },
                                    {
                                        content:
                                            'Final text for conclusion goes here',
                                        children: [],
                                    },
                                    {
                                        content: 'in as many',
                                        children: [],
                                    },
                                    {
                                        content: 'cards as you like.',
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        content:
                            '## References\nWe don\'t have bibliography support yet, but we do have "named links" so you can refer to specific links by name rather than retyping it each time.\n\n"Black holes are cool." [[1]][prl2010], and DNA is cool too [[2]][dnaRef]. But black holes are still cool, though not "absolute zero" cool [[1]][prl2010].\n\n[prl2010]: http://arxiv.org/abs/1311.3007\n[dnaRef]: http://biorxiv.org/content/early/2013/11/07/000026',
                        children: [
                            {
                                content:
                                    '## List\nOr you can simply list your references here:\n\n1. some ref\n1. some other ref. Numbering fixes itself automatically.\n2. A third ref.',
                                children: [
                                    {
                                        content: '# References',
                                        children: [],
                                    },
                                    {
                                        content: 'Some reference by J. Doe',
                                        children: [
                                            {
                                                content:
                                                    'Notes on this reference. ',
                                                children: [],
                                            },
                                        ],
                                    },
                                    {
                                        content: 'Some other reference',
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                content:
                    '## How to use this template\nThe idea here is to start at the far left, and clarify what the core of what you want to say is *first*, and then expand on it by moving to the right, one column at a time.\n\nAfter a couple of "passes" of expanding, you will end up with your complete, and well structured paper on column 5, which you can export separately.\n\nHere\'s a (somewhat dated) video which might help.\n<iframe width="256" height="144" src="//www.youtube.com/embed/J4prcx0jZ9M?rel=0" frameborder="0" allowfullscreen></iframe>',
                children: [],
            },
        ],
    },
];

export const ginkgo_academic_paper = { json, md };
