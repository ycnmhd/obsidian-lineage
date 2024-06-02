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
                                                    'Notes on this reference.',
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

const annotatedMd = `<!--section: 1-->
# Title: **Statement** of your core result or finding.
Try to make your title an assertive statement, such as:
- "Changes in cytoplasmic volume are sufficient to drive spindle scaling." 

and not
- "High-performance silicon photoanodes passivated with ultrathin nickel films for water oxidation"

Rule of thumb: if your title would look weird with a period at the end, it is probably a poor title.

Don't do [this](http://www.phdcomics.com/comics/archive/phd053106s.gif).

<!--section: 1.1-->
# Abstract
Try to tell a *story* here, no matter what your field. You are writing for human beings, not computers. What's the area, what's the problem you are trying to understand. How? What have you found?

(You are *summarizing* your core results, not *cramming* them into this tiny space).

---
###### target:  84-151 words
###### current: 43 ![](https://dl.dropboxusercontent.com/s/6k720i6vkig7siq/cross_circle.png)

<!-- URL for checkmark: https://dl.dropboxusercontent.com/s/elo7ckzspvxvx0t/checkmark.gif -->

###### (This is a word count footer. We don't have automatic word counts yet, so I use is [this Chrome extension](https://chrome.google.com/webstore/detail/word-count/pnngehidikgomgfjbpffonkeimgbpjlh))

<!--section: 1.1.1-->
## Introduction - "The Setup"
### [In field X, we still don't understand Y & Z.]

Write a summary of *the question(s) you are trying to answer*.
What is the state of the world before your research came along?
Also, answer the harsh but important question: *Who cares*?

In writing this, you can start general, but make sure clearly define the "before" state of the world's knowledge for the *specific area* this paper is addressing.

<!--section: 1.1.1.1-->
### Intro - Assertive Statement 1

Here you can expand on your introduction. To guide your writing, title this card with assertive statements:
Instead of "Problem Description", be direct: "The problem is that X doesn't do Y."

<!--section: 1.1.1.1.1-->
# Introduction

<!--section: 1.1.1.1.2-->
[You can write your actual paper here in this column. Then choosing "Export column 5" to Word or Markdown will help you move it to your final platform.]

<!--section: 1.1.1.1.2.1-->
You can keep notes & comments here.

<!--section: 1.1.1.1.3-->
...

<!--section: 1.1.1.1.4-->
...

<!--section: 1.1.1.2-->
### Intro - Assertive Statement 2

<!--section: 1.1.1.2.1-->
...

<!--section: 1.1.1.2.2-->
...

<!--section: 1.1.1.3-->
### Intro - Assertive Statement 3

<!--section: 1.1.1.3.1-->
...

<!--section: 1.1.1.3.2-->
...

<!--section: 1.1.2-->
## Materials & Methods - "The Characters"
### [We have here method A, B, and our new method C.]
You have established the core question(s) of your research. Now introduce the tools you are going to  use to understand it.

<!--section: 1.1.2.1-->
## Method A
More details on the method, experiment design, etc.

Remember that these are cards, so you can drag and drop them to rearrange if necessary.

<!--section: 1.1.2.1.1-->
# Methods

<!--section: 1.1.2.1.2-->
### Method A

<!--section: 1.1.2.1.2.1-->
Some other note. For example:

#Xusheng , make sure you include the voltage you used."

(the # syntax makes it easier to search for & filter comments directed at a specific person).

<!--section: 1.1.2.1.3-->
...

<!--section: 1.1.2.1.4-->
...

<!--section: 1.1.2.2-->
## Method B
More details on the method, experiment design, etc.

<!--section: 1.1.2.2.1-->
### Method B...

<!--section: 1.1.2.2.2-->
...

<!--section: 1.1.2.2.3-->
...

<!--section: 1.1.2.3-->
## Method C
More details on the method, experiment design, etc.

If you need a checklist to make sure you address all points, go ahead:
[ ] e.g. "Mention pH of the setup"
[ ] What temperature?
[ ] For how long?

<!--section: 1.1.2.3.1-->
### Method C

<!--section: 1.1.2.3.2-->
...

<!--section: 1.1.2.3.3-->
...

<!--section: 1.1.3-->
## Results
What happened (objectively)?

Do not interpret, simply state the facts.

Let's be honest: the first thing most of us do when skimming a paper is look at the figures. If your key results can be presented in figures, then start with that, and structure your paper around that.

<!--section: 1.1.3.1-->
## Key Result
You can add figures if you'd like:

![](https://dl.dropboxusercontent.com/s/gieldum0s47m25v/1-plot.jpg)

<!--section: 1.1.3.1.1-->
# Results

<!--section: 1.1.3.1.2-->
Final text for results goes here

<!--section: 1.1.3.1.3-->
...

<!--section: 1.1.3.1.4-->
...

<!--section: 1.1.3.2-->
Remember these are **cards** so you can rearrange your results at will.
Any subcards will follow.

<!--section: 1.1.3.2.1-->
Other results

<!--section: 1.1.4-->
## Discussion
Results are objective, but science isn't about listing data, it's about extracting meaning from what we observe.

What do your results tell you about the core problem you were investigating?

<!--section: 1.1.5-->
## Conclusion
Bring it back to the big picture. How do your results fit into the current body of knowledge?

Most importantly, how can these results help you [ask better questions](http://www.youtube.com/watch?v=nq0_zGzSc8g#t=493)?

<!--section: 1.1.5.1-->
## Conclusion (further detail)

Expand on your conclusion summary, and add more details to it.

<!--section: 1.1.5.1.1-->
# Conclusion

<!--section: 1.1.5.1.2-->
Final text for conclusion goes here

<!--section: 1.1.5.1.3-->
in as many

<!--section: 1.1.5.1.4-->
cards as you like.

<!--section: 1.1.6-->
## References
We don't have bibliography support yet, but we do have "named links" so you can refer to specific links by name rather than retyping it each time.

"Black holes are cool." [[1]][prl2010], and DNA is cool too [[2]][dnaRef]. But black holes are still cool, though not "absolute zero" cool [[1]][prl2010].

[prl2010]: http://arxiv.org/abs/1311.3007
[dnaRef]: http://biorxiv.org/content/early/2013/11/07/000026

<!--section: 1.1.6.1-->
## List
Or you can simply list your references here:

1. some ref
1. some other ref. Numbering fixes itself automatically.
2. A third ref.

<!--section: 1.1.6.1.1-->
# References

<!--section: 1.1.6.1.2-->
Some reference by J. Doe

<!--section: 1.1.6.1.2.1-->
Notes on this reference. 

<!--section: 1.1.6.1.3-->
Some other reference

<!--section: 1.2-->
## How to use this template
The idea here is to start at the far left, and clarify what the core of what you want to say is *first*, and then expand on it by moving to the right, one column at a time.

After a couple of "passes" of expanding, you will end up with your complete, and well structured paper on column 5, which you can export separately.

Here's a (somewhat dated) video which might help.
<iframe width="256" height="144" src="//www.youtube.com/embed/J4prcx0jZ9M?rel=0" frameborder="0" allowfullscreen></iframe>`;

const lineageDocument = {
    content: {
        'n-lt8yutmx': {
            content:
                '# Title: **Statement** of your core result or finding.\nTry to make your title an assertive statement, such as:\n- "Changes in cytoplasmic volume are sufficient to drive spindle scaling." \n\nand not\n- "High-performance silicon photoanodes passivated with ultrathin nickel films for water oxidation"\n\nRule of thumb: if your title would look weird with a period at the end, it is probably a poor title.\n\nDon\'t do [this](http://www.phdcomics.com/comics/archive/phd053106s.gif).',
        },
        'n-lt8yutmz': {
            content:
                "# Abstract\nTry to tell a *story* here, no matter what your field. You are writing for human beings, not computers. What's the area, what's the problem you are trying to understand. How? What have you found?\n\n(You are *summarizing* your core results, not *cramming* them into this tiny space).\n\n---\n###### target:  84-151 words\n###### current: 43 ![](https://dl.dropboxusercontent.com/s/6k720i6vkig7siq/cross_circle.png)\n\n<!-- URL for checkmark: https://dl.dropboxusercontent.com/s/elo7ckzspvxvx0t/checkmark.gif -->\n\n###### (This is a word count footer. We don't have automatic word counts yet, so I use is [this Chrome extension](https://chrome.google.com/webstore/detail/word-count/pnngehidikgomgfjbpffonkeimgbpjlh))",
        },
        'n-lt8yutn1': {
            content:
                '## Introduction - "The Setup"\n### [In field X, we still don\'t understand Y & Z.]\n\nWrite a summary of *the question(s) you are trying to answer*.\nWhat is the state of the world before your research came along?\nAlso, answer the harsh but important question: *Who cares*?\n\nIn writing this, you can start general, but make sure clearly define the "before" state of the world\'s knowledge for the *specific area* this paper is addressing.',
        },
        'n-lt8yutn3': {
            content:
                '### Intro - Assertive Statement 1\n\nHere you can expand on your introduction. To guide your writing, title this card with assertive statements:\nInstead of "Problem Description", be direct: "The problem is that X doesn\'t do Y."',
        },
        'n-lt8yutn5': { content: '# Introduction' },
        'n-lt8yutn7': {
            content:
                '[You can write your actual paper here in this column. Then choosing "Export column 5" to Word or Markdown will help you move it to your final platform.]',
        },
        'n-lt8yutn8': { content: 'You can keep notes & comments here.' },
        'n-lt8yutna': { content: '...' },
        'n-lt8yutnb': { content: '...' },
        'n-lt8yutnc': { content: '### Intro - Assertive Statement 2' },
        'n-lt8yutnd': { content: '...' },
        'n-lt8yutne': { content: '...' },
        'n-lt8yutnf': { content: '### Intro - Assertive Statement 3' },
        'n-lt8yutng': { content: '...' },
        'n-lt8yutnh': { content: '...' },
        'n-lt8yutni': {
            content:
                '## Materials & Methods - "The Characters"\n### [We have here method A, B, and our new method C.]\nYou have established the core question(s) of your research. Now introduce the tools you are going to  use to understand it.',
        },
        'n-lt8yutnj': {
            content:
                '## Method A\nMore details on the method, experiment design, etc.\n\nRemember that these are cards, so you can drag and drop them to rearrange if necessary.',
        },
        'n-lt8yutnk': { content: '# Methods' },
        'n-lt8yutnl': { content: '### Method A' },
        'n-lt8yutnm': {
            content:
                'Some other note. For example:\n\n#Xusheng , make sure you include the voltage you used."\n\n(the # syntax makes it easier to search for & filter comments directed at a specific person).',
        },
        'n-lt8yutnn': { content: '...' },
        'n-lt8yutno': { content: '...' },
        'n-lt8yutnp': {
            content:
                '## Method B\nMore details on the method, experiment design, etc.',
        },
        'n-lt8yutnq': { content: '### Method B...' },
        'n-lt8yutnr': { content: '...' },
        'n-lt8yutns': { content: '...' },
        'n-lt8yutnt': {
            content:
                '## Method C\nMore details on the method, experiment design, etc.\n\nIf you need a checklist to make sure you address all points, go ahead:\n[ ] e.g. "Mention pH of the setup"\n[ ] What temperature?\n[ ] For how long?',
        },
        'n-lt8yutnu': { content: '### Method C' },
        'n-lt8yutnv': { content: '...' },
        'n-lt8yutnw': { content: '...' },
        'n-lt8yutnx': {
            content:
                "## Results\nWhat happened (objectively)?\n\nDo not interpret, simply state the facts.\n\nLet's be honest: the first thing most of us do when skimming a paper is look at the figures. If your key results can be presented in figures, then start with that, and structure your paper around that.",
        },
        'n-lt8yutny': {
            content:
                "## Key Result\nYou can add figures if you'd like:\n\n![](https://dl.dropboxusercontent.com/s/gieldum0s47m25v/1-plot.jpg)",
        },
        'n-lt8yutnz': { content: '# Results' },
        'n-lt8yuto0': { content: 'Final text for results goes here' },
        'n-lt8yuto1': { content: '...' },
        'n-lt8yuto2': { content: '...' },
        'n-lt8yuto3': {
            content:
                'Remember these are **cards** so you can rearrange your results at will.\nAny subcards will follow.',
        },
        'n-lt8yuto4': { content: 'Other results' },
        'n-lt8yuto5': {
            content:
                "## Discussion\nResults are objective, but science isn't about listing data, it's about extracting meaning from what we observe.\n\nWhat do your results tell you about the core problem you were investigating?",
        },
        'n-lt8yuto6': {
            content:
                '## Conclusion\nBring it back to the big picture. How do your results fit into the current body of knowledge?\n\nMost importantly, how can these results help you [ask better questions](http://www.youtube.com/watch?v=nq0_zGzSc8g#t=493)?',
        },
        'n-lt8yuto7': {
            content:
                '## Conclusion (further detail)\n\nExpand on your conclusion summary, and add more details to it.',
        },
        'n-lt8yuto8': { content: '# Conclusion' },
        'n-lt8yuto9': { content: 'Final text for conclusion goes here' },
        'n-lt8yutoa': { content: 'in as many' },
        'n-lt8yutob': { content: 'cards as you like.' },
        'n-lt8yutoc': {
            content:
                '## References\nWe don\'t have bibliography support yet, but we do have "named links" so you can refer to specific links by name rather than retyping it each time.\n\n"Black holes are cool." [[1]][prl2010], and DNA is cool too [[2]][dnaRef]. But black holes are still cool, though not "absolute zero" cool [[1]][prl2010].\n\n[prl2010]: http://arxiv.org/abs/1311.3007\n[dnaRef]: http://biorxiv.org/content/early/2013/11/07/000026',
        },
        'n-lt8yutod': {
            content:
                '## List\nOr you can simply list your references here:\n\n1. some ref\n1. some other ref. Numbering fixes itself automatically.\n2. A third ref.',
        },
        'n-lt8yutoe': { content: '# References' },
        'n-lt8yutof': { content: 'Some reference by J. Doe' },
        'n-lt8yutog': { content: 'Notes on this reference.' },
        'n-lt8yutoh': { content: 'Some other reference' },
        'n-lt8yutoi': {
            content:
                '## How to use this template\nThe idea here is to start at the far left, and clarify what the core of what you want to say is *first*, and then expand on it by moving to the right, one column at a time.\n\nAfter a couple of "passes" of expanding, you will end up with your complete, and well structured paper on column 5, which you can export separately.\n\nHere\'s a (somewhat dated) video which might help.\n<iframe width="256" height="144" src="//www.youtube.com/embed/J4prcx0jZ9M?rel=0" frameborder="0" allowfullscreen></iframe>',
        },
    },
    columns: [
        {
            id: 'c-lt8yutmy',
            groups: [{ nodes: ['n-lt8yutmx'], parentId: 'r-lt8yutmw' }],
        },
        {
            id: 'c-lt8yutn0',
            groups: [
                { nodes: ['n-lt8yutmz', 'n-lt8yutoi'], parentId: 'n-lt8yutmx' },
            ],
        },
        {
            id: 'c-lt8yutn2',
            groups: [
                {
                    nodes: [
                        'n-lt8yutn1',
                        'n-lt8yutni',
                        'n-lt8yutnx',
                        'n-lt8yuto5',
                        'n-lt8yuto6',
                        'n-lt8yutoc',
                    ],
                    parentId: 'n-lt8yutmz',
                },
            ],
        },
        {
            id: 'c-lt8yutn4',
            groups: [
                {
                    nodes: ['n-lt8yutn3', 'n-lt8yutnc', 'n-lt8yutnf'],
                    parentId: 'n-lt8yutn1',
                },
                {
                    nodes: ['n-lt8yutnj', 'n-lt8yutnp', 'n-lt8yutnt'],
                    parentId: 'n-lt8yutni',
                },
                { nodes: ['n-lt8yutny', 'n-lt8yuto3'], parentId: 'n-lt8yutnx' },
                { nodes: ['n-lt8yuto7'], parentId: 'n-lt8yuto6' },
                { nodes: ['n-lt8yutod'], parentId: 'n-lt8yutoc' },
            ],
        },
        {
            id: 'c-lt8yutn6',
            groups: [
                {
                    nodes: [
                        'n-lt8yutn5',
                        'n-lt8yutn7',
                        'n-lt8yutna',
                        'n-lt8yutnb',
                    ],
                    parentId: 'n-lt8yutn3',
                },
                { nodes: ['n-lt8yutnd', 'n-lt8yutne'], parentId: 'n-lt8yutnc' },
                { nodes: ['n-lt8yutng', 'n-lt8yutnh'], parentId: 'n-lt8yutnf' },
                {
                    nodes: [
                        'n-lt8yutnk',
                        'n-lt8yutnl',
                        'n-lt8yutnn',
                        'n-lt8yutno',
                    ],
                    parentId: 'n-lt8yutnj',
                },
                {
                    nodes: ['n-lt8yutnq', 'n-lt8yutnr', 'n-lt8yutns'],
                    parentId: 'n-lt8yutnp',
                },
                {
                    nodes: ['n-lt8yutnu', 'n-lt8yutnv', 'n-lt8yutnw'],
                    parentId: 'n-lt8yutnt',
                },
                {
                    nodes: [
                        'n-lt8yutnz',
                        'n-lt8yuto0',
                        'n-lt8yuto1',
                        'n-lt8yuto2',
                    ],
                    parentId: 'n-lt8yutny',
                },
                { nodes: ['n-lt8yuto4'], parentId: 'n-lt8yuto3' },
                {
                    nodes: [
                        'n-lt8yuto8',
                        'n-lt8yuto9',
                        'n-lt8yutoa',
                        'n-lt8yutob',
                    ],
                    parentId: 'n-lt8yuto7',
                },
                {
                    nodes: ['n-lt8yutoe', 'n-lt8yutof', 'n-lt8yutoh'],
                    parentId: 'n-lt8yutod',
                },
            ],
        },
        {
            id: 'c-lt8yutn9',
            groups: [
                { nodes: ['n-lt8yutn8'], parentId: 'n-lt8yutn7' },
                { nodes: ['n-lt8yutnm'], parentId: 'n-lt8yutnl' },
                { nodes: ['n-lt8yutog'], parentId: 'n-lt8yutof' },
            ],
        },
    ],
};
export const ginkgo_academic_paper = { json, md, annotatedMd, lineageDocument };
