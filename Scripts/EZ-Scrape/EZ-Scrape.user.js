// ==UserScript==
// @name         EZ-Scrape
// @namespace    ez-scrape
// @version      1.1.0
// @description  XPath-based text matcher with draggable, resizable UI and in-panel results
// @match        *://*/*
// @grant        GM_info
// ==/UserScript==

(() => {
    'use strict';

    const UI_STATE_KEY = 'ez-scrape-ui-state';
    let activeInput = null;

    function saveUIState(panel) {
        const r = panel.getBoundingClientRect();
        localStorage.setItem(UI_STATE_KEY, JSON.stringify({
            left: r.left, top: r.top, width: r.width, height: r.height
        }));
    }

    function restoreUIState(panel) {
        const s = JSON.parse(localStorage.getItem(UI_STATE_KEY) || 'null');
        if (!s) return;
        panel.style.left = s.left + 'px';
        panel.style.top = s.top + 'px';
        panel.style.width = s.width + 'px';
        panel.style.height = s.height + 'px';
    }

    function splitTerms(value) {
        return value.split(',').map(v => v.trim()).filter(Boolean);
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
    
        // iterate over all elements on the page
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            // check all attributes
            for (const attr of el.attributes) {
                const val = attr.value;
                if (exact ? val === term : val.includes(term)) {
                    matches.push({ text: val, xpath: getXPath(el) });
                }
            }
    
            // check text content
            if (el.childNodes.length === 0 || el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const text = el.textContent.trim();
                if (text && (exact ? text === term : text.includes(term))) {
                    matches.push({ text, xpath: getXPath(el) });
                }
            }
        });
    
        // remove duplicates (same text + xpath)
        const seen = new Set();
        return matches.filter(m => {
            const key = m.text + '|' + m.xpath;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    

    function createField(id, label) {
        const row = document.createElement('div');
        row.style.marginBottom = '6px';
        row.style.marginRight = '12px';
        row.style.display = 'flex';
        row.style.flexDirection = 'column';
    
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.gap = '4px';
    
        const input = document.createElement('input');
        input.id = id;
        input.placeholder = label;
        input.style.flex = '1';
        input.style.fontSize = '18px';
        input.addEventListener('focus', () => activeInput = input);
    
        const exactBtn = document.createElement('button');
        exactBtn.textContent = 'E';
        exactBtn.style.fontSize = '16px';
        const partialBtn = document.createElement('button');
        partialBtn.textContent = 'P';
        partialBtn.style.fontSize = '16px';
    
        inputRow.append(input, exactBtn, partialBtn);
        row.appendChild(inputRow);
    
        const results = document.createElement('div');
        results.style.fontSize = '16px';
        results.style.whiteSpace = 'pre-wrap';
        results.style.marginTop = '4px';
        results.style.maxHeight = '160px';
        results.style.overflow = 'auto';
        results.style.border = '1px solid #333';
        results.style.padding = '4px';
        results.style.background = '#222';
        row.appendChild(results);
    
        function runSearch(exact) {
            results.textContent = '';
        
            // Only split by commas for Performers and Tags
            const terms = (id === 'ssb-performers' || id === 'ssb-tags' || id === 'ssb-aditional urls') ? splitTerms(input.value) : [input.value.trim()];
        
            terms.forEach(term => {
                if (!term) return;
                const found = findMatches(term, exact);
                results.textContent += `▶ "${term}" (${exact ? 'exact' : 'partial'})\n`;
        
                if (!found.length) {
                    results.textContent += '  No matches\n\n';
                    return;
                }
        
                // Remove duplicates using a Set keyed by xpath + text
                const seen = new Set();
                found.forEach(m => {
                    const key = m.xpath + '||' + m.text;
                    if (seen.has(key)) return;
                    seen.add(key);
                    results.textContent += `  XPath: ${m.xpath}\n  Text: ${m.text}\n\n`;
                });
            });
        }
        
    
        exactBtn.onclick = () => runSearch(true);
        partialBtn.onclick = () => runSearch(false);
    
        return row;
    }
    

    function makeDraggable(panel, handle) {
        let isDragging = false, offsetX, offsetY;


        handle.addEventListener('mousedown', e => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            panel.style.cursor = 'move';
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) saveUIState(panel);
            isDragging = false;
            panel.style.cursor = 'default';
        });
    }

    function makeResizable(panel) {
        const resizer = document.createElement('div');
        resizer.style.width = '10px';
        resizer.style.height = '10px';
        resizer.style.position = 'absolute';
        resizer.style.right = '0';
        resizer.style.bottom = '0';
        resizer.style.cursor = 'se-resize';
        resizer.style.background = '#888';
        panel.appendChild(resizer);

        let isResizing = false, startX, startY, startW, startH;
        resizer.addEventListener('mousedown', e => {
            e.stopPropagation();
            isResizing = true;
            const rect = panel.getBoundingClientRect();
            startX = e.clientX; startY = e.clientY;
            startW = rect.width; startH = rect.height;
        });
        document.addEventListener('mousemove', e => {
            if (!isResizing) return;
            panel.style.width = startW + (e.clientX - startX) + 'px';
            panel.style.height = startH + (e.clientY - startY) + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (isResizing) saveUIState(panel);
            isResizing = false;
        });
    }

    function getImageFromElement(el) {
        if (!el) return null;
    
        // Collect all text content and attributes
        let values = [];
    
        // 1. Text content
        if (el.textContent) values.push(el.textContent);
    
        // 2. All attributes
        for (const attr of el.attributes) {
            values.push(attr.value);
        }
    
        // 3. Look for child elements recursively
        for (const child of el.children) {
            const childSrc = getImageFromElement(child);
            if (childSrc) return childSrc; // first match
        }
    
        // Regex to match image files
        const imgRegex = /(https?:\/\/[^\s"'()<>]+?\.(?:jpg|jpeg|png|gif|webp|bmp))/i;
    
        for (const v of values) {
            const match = v.match(imgRegex);
            if (match) return match[1];
        }
    
        return null;
    }
    
    function createXPathField() {
        const row = document.createElement('div');
        row.style.marginBottom = '6px';
        row.style.display = 'flex';
        row.style.flexDirection = 'column';
    
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.gap = '4px';
    
        const input = document.createElement('input');
        input.placeholder = 'Custom XPath';
        input.style.flex = '1';
        input.style.fontSize = '16px';
        input.addEventListener('focus', () => activeInput = input); // optional, just to track focus
    
        const runBtn = document.createElement('button');
        runBtn.textContent = 'Run XPath';
        runBtn.style.fontSize = '16px';
    
        inputRow.append(input, runBtn);
        row.appendChild(inputRow);
    
        const results = document.createElement('div');
        results.style.fontSize = '16px';
        results.style.whiteSpace = 'pre-wrap';
        results.style.marginTop = '4px';
        results.style.maxHeight = '160px';
        results.style.overflow = 'auto';
        results.style.border = '1px solid #333';
        results.style.padding = '4px';
        results.style.background = '#222';
        row.appendChild(results);
    
        runBtn.onclick = () => {
            results.textContent = '';
            const xpathInput = input.value.trim();
            if (!xpathInput) return;
    
            try {
                const snapshot = document.evaluate(
                    xpathInput,
                    document,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );
    
                if (snapshot.snapshotLength === 0) {
                    results.textContent = 'No matches';
                    return;
                }
    
                const seen = new Set(); // prevent duplicates
                for (let i = 0; i < snapshot.snapshotLength; i++) {
                    const node = snapshot.snapshotItem(i);
                    let text = '';
                    if (node.nodeType === 1) text = node.outerHTML;
                    else if (node.nodeType === 2) text = node.nodeValue;
                    else if (node.nodeType === 3) text = node.textContent;
    
                    // skip duplicates
                    if (seen.has(text)) continue;
                    seen.add(text);
    
                    results.textContent += `XPath: ${getXPath(node instanceof Element ? node : node.parentElement)}\n`;
                    results.textContent += `Text: ${text}\n\n`;
                }
            } catch (err) {
                results.textContent = 'Invalid XPath: ' + err.message;
            }
        };
    
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
        ui.style.padding = '0';
        ui.style.fontSize = '18px';
        ui.style.border = '1px solid #444';
        ui.style.boxSizing = 'border-box';
        ui.style.minWidth = '300px';
        ui.style.minHeight = '150px';
        ui.style.maxWidth = '90%';
        ui.style.maxHeight = '80%';
        // ui.style.width = '400px';
        // ui.style.height = '250px';
        ui.style.resize = 'both';
        ui.style.overflow = 'hidden'; // prevent panel itself from scrolling
    
        restoreUIState(ui);
    
        // Top title bar
        const title = document.createElement('div');
        title.textContent = `EZ-Scrape v${GM_info?.script?.version ?? ''}`;
        title.style.marginBottom = '6px';
        title.style.fontWeight = 'bold';
        title.style.cursor = 'move';
        title.style.background = '#222';
        title.style.padding = '10px';
        // title.style.position = 'sticky';   // <--- keep it always visible
        title.style.borderBottom = '1px solid #444';
        // title.style.top = '0';
        ui.appendChild(title);
    
        // Container for the fields/results
        const content = document.createElement('div');
        content.style.overflow = 'auto'; // only this scrolls
        content.style.maxHeight = 'calc(100% - 30px)'; // leave space for title
        content.style.padding = '10px';
        ui.appendChild(content);

        ['Title','Performers','Tags','Studio','Details','Cover', 'Date', 'Director', 'Studio Code', "Aditional Urls"].forEach(label => {
            content.appendChild(createField('ssb-' + label.toLowerCase(), label));
        });
    


        // ui.appendChild(content);
        document.body.appendChild(ui);
        ui.appendChild(createXPathField());

    
        makeDraggable(ui, title);
        makeResizable(ui);
    }
    

    document.addEventListener('click', e => {
        if (!activeInput) return;
    
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            e.stopPropagation();
        }
    
        // Ignore clicks on the UI itself
        if (e.target.closest('input, button, textarea')) return;
    
        // If the active input is the cover field, try to extract an image URL
        if (activeInput.id === 'ssb-cover') {
            const imageUrl = getImageFromElement(e.target); // <-- use const
            if (imageUrl) {
                activeInput.value = imageUrl;
            }
            e.preventDefault();
            e.stopPropagation();
            return;
        }
    
        // Otherwise, extract text as usual
        const text = e.target.textContent?.trim();
        if (!text) return;
    
        activeInput.value = activeInput.value ? activeInput.value + ', ' + text : text;
    });
    

    openUI();
})();
