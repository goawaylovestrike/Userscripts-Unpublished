// ==UserScript==
// @name         EZ-Scrape
// @namespace    ez-scrape
// @version      1.0.1
// @description  XPath-based text matcher with UI results (no highlighting)
// @match        *://*/*
// @grant        GM_info
// ==/UserScript==

(() => {
    'use strict';

    const DEBUG_PREFIX = '[EZ-Scrape-Debug]';

    function splitTerms(value) {
        return value
            .split(',')
            .map(v => v.trim())
            .filter(Boolean);
    }

    function getXPath(el) {
        if (el === document.body) return '/html/body';
        const parts = [];
        while (el && el.nodeType === 1) {
            let index = 1;
            let sib = el.previousSibling;
            while (sib) {
                if (sib.nodeType === 1 && sib.tagName === el.tagName) index++;
                sib = sib.previousSibling;
            }
            parts.unshift(`${el.tagName.toLowerCase()}[${index}]`);
            el = el.parentNode;
        }
        return '/' + parts.join('/');
    }

    function findMatches(term, exact) {
        const matches = [];

        const xpath = document.evaluate(
            '//text()[normalize-space()]',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < xpath.snapshotLength; i++) {
            const node = xpath.snapshotItem(i);
            const text = node.textContent;

            if (exact ? text === term : text.includes(term)) {
                matches.push({
                    text,
                    xpath: getXPath(node.parentElement)
                });
            }
        }
        return matches;
    }

    let activeInput = null;

    function createField(id, label) {
        const row = document.createElement('div');
        row.style.marginBottom = '6px';

        const input = document.createElement('input');
        input.id = id;
        input.placeholder = label;
        input.style.width = '260px';
        input.addEventListener('focus', () => activeInput = input);

        const exactBtn = document.createElement('button');
        exactBtn.textContent = 'E';

        const partialBtn = document.createElement('button');
        partialBtn.textContent = 'P';

        const results = document.createElement('div');
        results.style.fontSize = '11px';
        results.style.whiteSpace = 'pre-wrap';
        results.style.marginTop = '4px';
        results.style.maxHeight = '140px';
        results.style.overflow = 'auto';

        function runSearch(exact) {
            results.textContent = '';
            splitTerms(input.value).forEach(term => {
                const found = findMatches(term, exact);
                results.textContent += `▶ "${term}" (${exact ? 'exact' : 'partial'})\n`;
                if (!found.length) {
                    results.textContent += '  No matches\n\n';
                    return;
                }
                found.forEach(m => {
                    results.textContent += `  XPath: ${m.xpath}\n  Text: ${m.text}\n\n`;
                });
            });
        }

        exactBtn.onclick = () => runSearch(true);
        partialBtn.onclick = () => runSearch(false);

        row.append(input, exactBtn, partialBtn, results);
        return row;
    }

    function openUI() {
        const ui = document.createElement('div');
        ui.style.position = 'fixed';
        ui.style.bottom = '10px';
        ui.style.right = '10px';
        ui.style.zIndex = '999999';
        ui.style.background = '#111';
        ui.style.color = '#fff';
        ui.style.padding = '10px';
        ui.style.fontSize = '12px';
        ui.style.border = '1px solid #444';

        const title = document.createElement('div');
        title.textContent = `EZ-Scrape v${GM_info?.script?.version ?? ''}`;
        title.style.marginBottom = '6px';
        title.style.fontWeight = 'bold';

        ui.append(
            title,
            createField('ssb-title', 'Title'),
            createField('ssb-performers', 'Performers'),
            createField('ssb-tags', 'Tags'),
            createField('ssb-studio', 'Studio'),
            createField('ssb-details', 'Details')
        );

        document.body.appendChild(ui);
    }

    document.addEventListener('click', e => {
        if (!activeInput) return;

        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (e.target.closest('input, button, textarea')) return;

        const text = e.target.textContent?.trim();
        if (!text) return;

        activeInput.value = activeInput.value
            ? activeInput.value + ', ' + text
            : text;
    });

    openUI();
})();
