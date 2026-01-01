// ==UserScript==
// @name         EZ-Scrape
// @namespace    stash-ez-scrape
// @version      0.8.3
// @description  UI with logging XPaths and match type (fixed overlapping matches)
// @author       GoAwayLoveStrike
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    const LOG_PREFIX = GM_info?.script?.name + '-Debug';
    const log = (...args) => console.log('%c' + LOG_PREFIX, 'color: #4CAF50; font-weight: bold;', ...args);
    const warn = (...args) => console.warn('%c' + LOG_PREFIX, 'color: #FF9800; font-weight: bold;', ...args);
    const error = (...args) => console.error('%c' + LOG_PREFIX, 'color: #F44336; font-weight: bold;', ...args);

    log("Userscript loaded! Version: " + GM_info?.script?.version);

    GM_registerMenuCommand("Open Scraper Builder", openUI);
    let activeField = null;

    GM_addStyle(`
      #ssb-panel {position: fixed; top: 80px; right: 40px; width: 520px; max-height: 85vh;
        background: #1e1e1e; color: #eee; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.7);
        font-family: system-ui, sans-serif; z-index: 999999; display: flex; flex-direction: column;}
      #ssb-header {cursor: move; background: #2a2a2a; padding: 10px 12px; font-size: 14px; font-weight: 600;
        display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; user-select: none;}
      #ssb-body { padding: 12px; overflow-y: auto; }
      .ssb-field { margin-bottom: 12px; }
      .ssb-field label { display: block; font-size: 12px; opacity: 0.85; margin-bottom: 4px; }
      .ssb-field input, .ssb-field textarea { width: 100%; box-sizing: border-box; border: 1px solid #444; border-radius: 4px; padding: 6px 8px; font-size: 13px; }
      #ssb-title { background: #E06C1E; color: #000; }
      #ssb-performers { background: #FF81B5; color: #000; }
      #ssb-tags { background: #624A70; color: #fff; }
      #ssb-studio { background: #F0DA9D; color: #000; }
      #ssb-studio-code { background: #8d99ae; color: #000; }
      #ssb-director { background: #6BB684; color: #000; }
      #ssb-cover { background: #116B6E; color: #fff; }
      #ssb-details { background: #7986D3; color: #fff; }
      .ssb-field input.ssb-armed, .ssb-field textarea.ssb-armed { border-color: #6aa9ff; box-shadow: 0 0 0 1px #6aa9ff; }
      .ssb-hint { font-size: 11px; opacity: 0.6; margin-top: 2px; }
      #ssb-actions { padding: 10px 12px; border-top: 1px solid #333; display: flex; justify-content: space-between; }
      #ssb-actions button { background: #3a3a3a; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 6px 12px; cursor: pointer; }
      body.ssb-capture { cursor: crosshair !important; }
      .ssb-highlight { border-radius: 2px; padding: 0 2px; }
    `);

    function openUI() {
      if (document.getElementById("ssb-panel")) return;

      const panel = document.createElement("div");
      panel.id = "ssb-panel";
      panel.innerHTML = `
        <div id="ssb-header">
            <span>EZ-Scrape v${GM_info?.script?.version}</span>
            <span id="ssb-close">✕</span>
        </div>
        <div id="ssb-body">
            ${field("Title", "ssb-title")}
            ${field("Performers", "ssb-performers", "Comma separated")}
            ${field("Tags", "ssb-tags", "Comma separated")}
            ${field("Studio", "ssb-studio")}
            ${field("Studio Code", "ssb-studio-code")}
            ${field("Creation Date", "ssb-date", null, "date")}
            ${field("Director", "ssb-director")}
            ${textarea("Details / Description", "ssb-details")}
            ${field("Cover Image URL", "ssb-cover")}
        </div>
        <div id="ssb-actions">
            <button id="ssb-submit">Submit</button>
            <button id="ssb-cancel">Close</button>
            <button id="ssb-exit-capture">Exit Capture Mode</button>
            <button id="ssb-log">Log All Fields</button>
        </div>
      `;
      document.body.appendChild(panel);

      panel.querySelector("#ssb-close").onclick = closeUI;
      panel.querySelector("#ssb-cancel").onclick = closeUI;
      panel.querySelector("#ssb-submit").onclick = submitForm;
      panel.querySelector("#ssb-exit-capture").onclick = () => disarmField();
      panel.querySelector("#ssb-log").onclick = logAllWithXPath;

      panel.querySelectorAll("input, textarea").forEach(el => {
        el.addEventListener("focus", () => armField(el));
        el.addEventListener("input", () => updateHighlights(el));
      });

      document.addEventListener("click", pageClickCapture, true);
      makeDraggable(panel, panel.querySelector("#ssb-header"));
    }

    // --- Logging function with proper exact/partial handling ---
    function logAllWithXPath() {
      const fields = [
        "ssb-title","ssb-performers","ssb-tags","ssb-studio",
        "ssb-studio-code","ssb-date","ssb-director","ssb-details","ssb-cover"
      ];

      const multiValueFields = ["ssb-tags", "ssb-performers"];

      const data = {};
      fields.forEach(id => data[id] = get(id));
      console.log("[EZ-Scrape-Debug] Current field values:", data);

      fields.forEach(id => {
        const value = get(id);
        if (!value) return;

        // Split multi-value fields
        const terms = multiValueFields.includes(id)
          ? value.split(",").map(v => v.trim()).filter(Boolean)
          : [value];

        terms.forEach(term => {
          console.log(`[EZ-Scrape-Debug] [${id}] Searching for: "${term}"`);

          const regex = new RegExp(escapeRegExp(term), "i");
          const matches = [];

          // Walk all text nodes without touching DOM
          walkTextNodes(document.body, node => {
            if (node.parentNode?.closest("#ssb-panel")) return;
            if (regex.test(node.nodeValue)) matches.push(node);
          });

          if (!matches.length) {
            console.log(`[EZ-Scrape-Debug]   No matches found on page.`);
            return;
          }

          matches.forEach(node => {
            const text = node.nodeValue.trim();
            const exact = text.toLowerCase() === term.toLowerCase();
            const matchType = exact ? "[EXACT MATCH]" : "[PARTIAL MATCH]";
            const xpath = getXPath(node.parentNode);

            // Show full XPath
            console.log(`[EZ-Scrape-Debug]   ${matchType}`);
            console.log(`[EZ-Scrape-Debug]   XPath: ${xpath}`);
            console.log(`[EZ-Scrape-Debug]   Text: "${text}"`);
          });
        });
      });
    }

    // --- Helpers ---
    function field(label, id, hint = null, type = "text") {
      return `<div class="ssb-field">
        <label>${label}</label>
        <input id="${id}" type="${type}">
        ${hint ? `<div class="ssb-hint">${hint}</div>` : ""}
      </div>`;
    }

    function textarea(label, id) {
      return `<div class="ssb-field">
        <label>${label}</label>
        <textarea id="${id}"></textarea>
      </div>`;
    }

    function armField(el) {
      disarmField();
      activeField = el;
      el.classList.add("ssb-armed");
      document.body.classList.add("ssb-capture");
      activeField.appendMode = el.id === "ssb-performers" || el.id === "ssb-tags";
    }

    function disarmField() {
      if (!activeField) return;
      activeField.classList.remove("ssb-armed");
      activeField.appendMode = false;
      activeField = null;
      document.body.classList.remove("ssb-capture");
    }

    function pageClickCapture(e) {
      if (!activeField || e.target.closest("#ssb-panel")) return;
      e.preventDefault();
      e.stopPropagation();

      if (activeField.id === "ssb-cover") {
        let value = "";
        if (e.target.tagName === "IMG" && e.target.src) value = e.target.src;
        else if (e.target.tagName === "VIDEO" && e.target.poster) value = e.target.poster;
        else {
          const bg = window.getComputedStyle(e.target).getPropertyValue("background-image");
          if (bg && bg !== "none") value = bg.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
        }
        if (value) { activeField.value = value; updateHighlights(activeField); }
        disarmField();
        return;
      }

      const text = e.target.textContent?.trim();
      if (!text) return;
      if (activeField.appendMode) {
        if (activeField.value.trim()) activeField.value += ", ";
        activeField.value += text;
      } else activeField.value = text;
      updateHighlights(activeField);
      if (!activeField.appendMode) disarmField();
      if (e.target.closest("a")) e.preventDefault();
    }

    function closeUI() {
      document.removeEventListener("click", pageClickCapture, true);
      document.getElementById("ssb-panel")?.remove();
      disarmField();
    }

    function submitForm() {
      const data = {
        title: get("ssb-title"),
        performers: split("ssb-performers"),
        tags: split("ssb-tags"),
        studio: get("ssb-studio"),
        studioCode: get("ssb-studio-code"),
        creationDate: get("ssb-date"),
        director: get("ssb-director"),
        details: get("ssb-details"),
        coverImage: get("ssb-cover"),
      };
      console.log("[EZ-Scrape-Debug] Collected data:", data);
      alert("Data collected (check console). UI only — no scraping yet.");
    }

    function get(id) { return document.getElementById(id)?.value.trim() || ""; }
    function split(id) { return get(id).split(",").map(v => v.trim()).filter(Boolean); }

    function makeDraggable(panel, handle) {
      let startX, startY, startLeft, startTop, dragging = false;
      handle.addEventListener("mousedown", e => {
        dragging = true; startX = e.clientX; startY = e.clientY;
        const rect = panel.getBoundingClientRect(); startLeft = rect.left; startTop = rect.top;
        e.preventDefault();
      });
      document.addEventListener("mousemove", e => {
        if (!dragging) return;
        panel.style.left = startLeft + (e.clientX - startX) + "px";
        panel.style.top = startTop + (e.clientY - startY) + "px";
        panel.style.right = "auto";
      });
      document.addEventListener("mouseup", () => dragging = false);
    }

    function updateHighlights(fieldEl) {
      const typeMap = {
        "ssb-title":"title","ssb-performers":"performers","ssb-tags":"tags",
        "ssb-studio":"studio","ssb-studio-code":"studioCode","ssb-director":"director",
        "ssb-cover":"coverImage","ssb-details":"details"
      };
      const type = typeMap[fieldEl.id];
      if (!type) return;
      const values = fieldEl.value.split(",").map(v => v.trim()).filter(Boolean);
      highlightValues(values, type);
    }

    function highlightValues(values, field) {
      document.querySelectorAll(`.ssb-highlight[data-field="${field}"]`).forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      });
      if (!values.length) return;

      const colorMap = {
        title: "#E06C1E", performers: "#FF81B5", tags: "#624A70",
        studio: "#F0DA9D", studioCode: "#8d99ae", director: "#6BB684",
        coverImage: "#116B6E", details: "#7986D3"
      };
      const color = colorMap[field] || "#ffff00";
      const regex = new RegExp(values.map(escapeRegExp).join("|"), "gi");

      walkTextNodes(document.body, node => {
        if (node.parentNode?.closest("#ssb-panel")) return;
        const frag = document.createDocumentFragment();
        let textNode = node.nodeValue, lastIndex = 0, match;
        while ((match = regex.exec(textNode)) !== null) {
          if (match.index > lastIndex) frag.appendChild(document.createTextNode(textNode.slice(lastIndex, match.index)));
          const span = document.createElement("span");
          span.className = "ssb-highlight"; span.setAttribute("data-field", field);
          span.style.background = color; span.style.color = "#000"; span.textContent = match[0];
          frag.appendChild(span); lastIndex = regex.lastIndex;
        }
        if (lastIndex < textNode.length) frag.appendChild(document.createTextNode(textNode.slice(lastIndex)));
        if (frag.childNodes.length) node.parentNode.replaceChild(frag, node);
      });
    }

    function walkTextNodes(node, callback) {
      if (node.nodeType === Node.TEXT_NODE) callback(node);
      else node.childNodes.forEach(child => walkTextNodes(child, callback));
    }

    function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

    function getXPath(node) {
      if (node.id) return `//*[@id="${node.id}"]`;
      const parts = [];
      while (node && node.nodeType === Node.ELEMENT_NODE) {
        let index = 1, sibling = node.previousSibling;
        while (sibling) { if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === node.nodeName) index++; sibling = sibling.previousSibling; }
        parts.unshift(`${node.nodeName.toLowerCase()}[${index}]`); node = node.parentNode;
      }
      return "/" + parts.join("/");
    }

})();
