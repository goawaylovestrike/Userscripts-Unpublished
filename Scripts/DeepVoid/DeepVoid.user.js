// ==UserScript==
// @name         DeepVoid
// @namespace    https://github.com/GoAwayLoveStrike/UnlistedUserscripts
// @version      0.1
// @description  Converts text to mathematical sans-serif Unicode characters
// @author       GoAwayLoveStrike
// @match        https://*.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = '[Script-Debug]';
    const log = (...args) => console.log('%c' + LOG_PREFIX, 'color: #4CAF50; font-weight: bold;', ...args);
    const warn = (...args) => console.warn('%c' + LOG_PREFIX, 'color: #FF9800; font-weight: bold;', ...args);
    const error = (...args) => console.error('%c' + LOG_PREFIX, 'color: #F44336; font-weight: bold;', ...args);

    // Script state management
    const STORAGE_KEY = 'deepvoid_enabled';
    let scriptEnabled = true;
    let requestInterceptorActive = false;
    let displayObserverActive = false;
    let displayObserver = null;

    /**
     * Converts regular text to mathematical sans-serif Unicode characters
     * Mathematical Sans-Serif: U+1D5A0-U+1D5B9 (A-Z), U+1D5BA-U+1D5D3 (a-z), U+1D7E2-U+1D7EB (0-9)
     */
    function convertToMathSansSerif(text) {
        if (!text) return text;
        
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            
            if (code >= 65 && code <= 90) {        // A-Z
                return String.fromCodePoint(0x1D5A0 + (code - 65));
            }
            if (code >= 97 && code <= 122) {       // a-z
                return String.fromCodePoint(0x1D5BA + (code - 97));
            }
            if (code >= 48 && code <= 57) {       // 0-9
                return String.fromCodePoint(0x1D7E2 + (code - 48));
            }
            return char;                           // Keep other characters
        }).join('');
    }

    /**
     * Converts mathematical sans-serif Unicode characters back to regular ASCII
     * Handles both regular and bold variants
     */
    function convertFromMathSansSerif(text) {
        if (!text) return text;
        
        let result = '';
        let i = 0;
        
        while (i < text.length) {
            const code = text.codePointAt(i);
            
            // Regular uppercase A-Z: U+1D5A0 to U+1D5B9 -> 65-90
            if (code >= 0x1D5A0 && code <= 0x1D5B9) {
                result += String.fromCharCode(65 + (code - 0x1D5A0));
                i += (code > 0xFFFF ? 2 : 1);
            }
            // Regular lowercase a-z: U+1D5BA to U+1D5D3 -> 97-122
            else if (code >= 0x1D5BA && code <= 0x1D5D3) {
                result += String.fromCharCode(97 + (code - 0x1D5BA));
                i += (code > 0xFFFF ? 2 : 1);
            }
            // Bold uppercase A-Z: U+1D5D4 to U+1D5ED -> 65-90
            else if (code >= 0x1D5D4 && code <= 0x1D5ED) {
                result += String.fromCharCode(65 + (code - 0x1D5D4));
                i += (code > 0xFFFF ? 2 : 1);
            }
            // Bold lowercase a-z: U+1D5EE to U+1D607 -> 97-122
            else if (code >= 0x1D5EE && code <= 0x1D607) {
                result += String.fromCharCode(97 + (code - 0x1D5EE));
                i += (code > 0xFFFF ? 2 : 1);
            }
            // Regular digits 0-9: U+1D7E2 to U+1D7EB -> 48-57
            else if (code >= 0x1D7E2 && code <= 0x1D7EB) {
                result += String.fromCharCode(48 + (code - 0x1D7E2));
                i += (code > 0xFFFF ? 2 : 1);
            }
            // Bold digits 0-9: U+1D7CE to U+1D7D7 -> 48-57
            else if (code >= 0x1D7CE && code <= 0x1D7D7) {
                result += String.fromCharCode(48 + (code - 0x1D7CE));
                i += (code > 0xFFFF ? 2 : 1);
            }
            else {
                result += text[i];
                i++;
            }
        }
        
        return result;
    }

    /**
     * Gets the current enabled state from localStorage (defaults to true)
     */
    function getScriptEnabled() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === null ? true : stored === 'true';
    }

    /**
     * Saves the enabled state to localStorage
     */
    function setScriptEnabled(enabled) {
        scriptEnabled = enabled;
        localStorage.setItem(STORAGE_KEY, enabled.toString());
        log(`Script ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Intercepts and modifies POST request bodies to convert text to mathematical sans-serif
     */
    function setupRequestInterception() {
        if (requestInterceptorActive) {
            log('Request interception already active');
            return;
        }
        log('Setting up request interception');
        
        // Intercept fetch() API
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options = {}] = args;
            
            // Only intercept POST requests
            if (options.method === 'POST' || options.method === 'post') {
                log(`Intercepted fetch POST to: ${url}`);
                
                // Only modify if script is enabled
                if (!scriptEnabled) {
                    return originalFetch.apply(this, [url, options]);
                }
                
                // Handle different body types
                if (options.body) {
                    let modified = false;
                    let modifiedBody = options.body;
                    
                    // If body is a string (JSON), parse and modify
                    if (typeof options.body === 'string') {
                        try {
                            const json = JSON.parse(options.body);
                            const modifiedJson = convertTextFields(json);
                            if (modifiedJson !== json) {
                                modifiedBody = JSON.stringify(modifiedJson);
                                modified = true;
                                log('Modified fetch POST body (JSON string)');
                            }
                        } catch (e) {
                            // Not JSON, might be form data or plain text
                            log('Body is string but not JSON:', options.body.substring(0, 100));
                        }
                    }
                    // If body is FormData
                    else if (options.body instanceof FormData) {
                        const formData = new FormData();
                        let hasChanges = false;
                        for (const [key, value] of options.body.entries()) {
                            if (typeof value === 'string') {
                                const converted = convertToMathSansSerif(value) + ' DeepVoid';
                                if (converted !== value) {
                                    formData.append(key, converted);
                                    hasChanges = true;
                                    log(`Modified FormData field "${key}"`);
                                } else {
                                    formData.append(key, value);
                                }
                            } else {
                                formData.append(key, value);
                            }
                        }
                        if (hasChanges) {
                            modifiedBody = formData;
                            modified = true;
                            log('Modified fetch POST body (FormData)');
                        }
                    }
                    // If body is a ReadableStream or Blob, we can't easily modify it
                    else {
                        log('Body type not easily modifiable:', options.body.constructor.name);
                    }
                    
                    if (modified) {
                        options.body = modifiedBody;
                        log('Returning modified fetch request');
                    }
                }
            }
            
            return originalFetch.apply(this, [url, options]);
        };
        
        // Intercept XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._method = method;
            this._url = url;
            return originalXHROpen.apply(this, [method, url, ...rest]);
        };
        
        XMLHttpRequest.prototype.send = function(body) {
            // Only intercept POST requests
            if (this._method === 'POST' || this._method === 'post') {
                log(`Intercepted XMLHttpRequest POST to: ${this._url}`);
                
                // Only modify if script is enabled
                if (!scriptEnabled) {
                    return originalXHRSend.apply(this, [body]);
                }
                
                if (body) {
                    let modified = false;
                    let modifiedBody = body;
                    
                    // If body is a string (JSON)
                    if (typeof body === 'string') {
                        try {
                            const json = JSON.parse(body);
                            const modifiedJson = convertTextFields(json);
                            if (modifiedJson !== json) {
                                modifiedBody = JSON.stringify(modifiedJson);
                                modified = true;
                                log('Modified XMLHttpRequest POST body (JSON string)');
                            }
                        } catch (e) {
                            log('Body is string but not JSON');
                        }
                    }
                    // If body is FormData
                    else if (body instanceof FormData) {
                        const formData = new FormData();
                        let hasChanges = false;
                        for (const [key, value] of body.entries()) {
                            if (typeof value === 'string') {
                                const converted = convertToMathSansSerif(value) + ' DeepVoid';
                                if (converted !== value) {
                                    formData.append(key, converted);
                                    hasChanges = true;
                                    log(`Modified FormData field "${key}"`);
                                } else {
                                    formData.append(key, value);
                                }
                            } else {
                                formData.append(key, value);
                            }
                        }
                        if (hasChanges) {
                            modifiedBody = formData;
                            modified = true;
                            log('Modified XMLHttpRequest POST body (FormData)');
                        }
                    }
                    
                    if (modified) {
                        body = modifiedBody;
                        log('Returning modified XMLHttpRequest');
                    }
                }
            }
            
            return originalXHRSend.apply(this, [body]);
        };
        
        requestInterceptorActive = true;
        log('Request interception set up');
    }
    
    /**
     * Recursively converts text fields in an object to mathematical sans-serif
     */
    function convertTextFields(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(item => {
                if (typeof item === 'string') {
                    return convertToMathSansSerif(item) + ' DeepVoid';
                } else if (typeof item === 'object') {
                    return convertTextFields(item);
                }
                return item;
            });
        }
        
        const modified = {};
        let hasChanges = false;
        
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                // Convert text in common message/content fields
                if (key.toLowerCase().includes('message') || 
                    key.toLowerCase().includes('content') || 
                    key.toLowerCase().includes('text') ||
                    key.toLowerCase().includes('prompt') ||
                    key.toLowerCase().includes('input')) {
                    const converted = convertToMathSansSerif(value) + ' DeepVoid';
                    modified[key] = converted;
                    if (converted !== value) {
                        hasChanges = true;
                        log(`Converting field "${key}": "${value.substring(0, 30)}..." -> "${converted.substring(0, 30)}..."`);
                    }
                } else {
                    modified[key] = value;
                }
            } else if (typeof value === 'object' && value !== null) {
                const converted = convertTextFields(value);
                modified[key] = converted;
                if (converted !== value) {
                    hasChanges = true;
                }
            } else {
                modified[key] = value;
            }
        }
        
        return hasChanges ? modified : obj;
    }

    /**
     * Converts mathematical sans-serif text in displayed elements back to ASCII
     */
    function convertDisplayedText() {
        if (!scriptEnabled) return;
        
        // Find all markdown paragraph elements and their spans
        const paragraphs = document.querySelectorAll('.ds-markdown-paragraph');
        log(`Found ${paragraphs.length} markdown paragraphs to convert`);
        
        let convertedCount = 0;
        
        for (const para of paragraphs) {
            // Get all spans inside the paragraph
            const spans = para.querySelectorAll('span');
            
            // If no spans, process the paragraph directly
            const elementsToProcess = spans.length > 0 ? spans : [para];
            
            for (const element of elementsToProcess) {
                // Use TreeWalker to find all text nodes
                const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null
                );
                
                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    if (node.textContent && node.textContent.trim()) {
                        textNodes.push(node);
                    }
                }
                
                // If no text nodes found, try innerText directly
                if (textNodes.length === 0 && element.innerText) {
                    const originalText = element.innerText;
                    const converted = convertFromMathSansSerif(originalText);
                    if (converted !== originalText) {
                        log(`Converting element text: "${originalText.substring(0, 30)}..." -> "${converted.substring(0, 30)}..."`);
                        element.innerText = converted;
                        convertedCount++;
                    }
                } else {
                    for (const textNode of textNodes) {
                        const originalText = textNode.textContent;
                        const converted = convertFromMathSansSerif(originalText);
                        if (converted !== originalText) {
                            log(`Converting text node: "${originalText.substring(0, 30)}..." -> "${converted.substring(0, 30)}..."`);
                            textNode.textContent = converted;
                            convertedCount++;
                        }
                    }
                }
            }
        }
        
        if (convertedCount > 0) {
            log(`Converted ${convertedCount} text nodes/elements`);
        }
    }

    /**
     * Sets up observer to convert displayed text as it appears
     */
    function setupDisplayConversion() {
        if (displayObserverActive) {
            log('Display conversion already active');
            return;
        }
        log('Setting up display text conversion');
        
        // Convert existing text periodically
        const convertInterval = setInterval(() => {
            convertDisplayedText();
        }, 500);
        
        // Stop interval after 30 seconds (page should be loaded by then)
        setTimeout(() => {
            clearInterval(convertInterval);
            log('Stopped periodic conversion, using observer only');
        }, 30000);
        
        // Watch for new content
        const observer = new MutationObserver((mutations) => {
            let shouldConvert = false;
            
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if it's a paragraph or contains one
                            if (node.classList?.contains('ds-markdown-paragraph')) {
                                shouldConvert = true;
                                break;
                            }
                            // Check if it contains markdown paragraphs
                            if (node.querySelector?.('.ds-markdown-paragraph')) {
                                shouldConvert = true;
                                break;
                            }
                            // Also check for spans with math sans-serif characters (regular or bold)
                            if (node.textContent) {
                                const firstChar = node.textContent.trim()[0];
                                if (firstChar) {
                                    const code = firstChar.codePointAt(0);
                                    if ((code >= 0x1D5A0 && code <= 0x1D5D3) ||  // Regular
                                        (code >= 0x1D5D4 && code <= 0x1D607) ||  // Bold
                                        (code >= 0x1D7E2 && code <= 0x1D7EB) ||  // Regular digits
                                        (code >= 0x1D7CE && code <= 0x1D7D7)) {  // Bold digits
                                        shouldConvert = true;
                                        break;
                                    }
                                }
                            }
                        } else if (node.nodeType === Node.TEXT_NODE) {
                            // Check if text node contains math sans-serif (regular or bold)
                            if (node.textContent) {
                                const firstChar = node.textContent.trim()[0];
                                if (firstChar) {
                                    const code = firstChar.codePointAt(0);
                                    if ((code >= 0x1D5A0 && code <= 0x1D5D3) ||  // Regular
                                        (code >= 0x1D5D4 && code <= 0x1D607) ||  // Bold
                                        (code >= 0x1D7E2 && code <= 0x1D7EB) ||  // Regular digits
                                        (code >= 0x1D7CE && code <= 0x1D7D7)) {  // Bold digits
                                        shouldConvert = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (shouldConvert) break;
                }
            }
            
            if (shouldConvert && scriptEnabled) {
                setTimeout(convertDisplayedText, 50);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        displayObserver = observer;
        displayObserverActive = true;
        log('Display text conversion observer set up');
    }

    /**
     * Creates a settings button next to the DeepSeek logo
     */
    function createSettingsButton() {
        // Look for the logo container - try multiple strategies
        let logoContainer = null;
        
        // Strategy 1: Find the container with class that contains the logo SVG
        const containers = document.querySelectorAll('div[class*="_262baab"], div[class*="e066abb8"]');
        for (const container of containers) {
            // Check if it contains the DeepSeek logo SVG (143x23 viewBox)
            const svg = container.querySelector('svg[viewBox="0 0 143 23"]');
            if (svg || container.querySelector('svg[width="143"][height="23"]')) {
                logoContainer = container;
                break;
            }
        }
        
        // Strategy 2: Find any SVG with DeepSeek logo dimensions and get its parent container
        if (!logoContainer) {
            const logos = document.querySelectorAll('svg[viewBox="0 0 143 23"], svg[width="143"][height="23"]');
            if (logos.length > 0) {
                // Find the container that holds the logo and the button next to it
                const logoSVG = logos[0];
                let parent = logoSVG.parentElement;
                // Look for a container that has both the logo and a button
                while (parent && parent !== document.body) {
                    const hasButton = parent.querySelector('.ds-icon-button');
                    if (hasButton) {
                        logoContainer = parent;
                        break;
                    }
                    parent = parent.parentElement;
                }
                if (!logoContainer) {
                    logoContainer = logoSVG.parentElement;
                }
            }
        }
        
        // Strategy 3: Look for the container with class pattern that typically contains logo
        if (!logoContainer) {
            const possibleContainers = document.querySelectorAll('div[class*="_262"], div[class*="b8812"]');
            for (const container of possibleContainers) {
                if (container.querySelector('svg')) {
                    logoContainer = container;
                    break;
                }
            }
        }

        // Create settings button
        const settingsButton = document.createElement('button');
        settingsButton.id = 'deepvoid-settings-btn';
        settingsButton.innerHTML = scriptEnabled ? '✓' : '✗';
        settingsButton.title = scriptEnabled ? 'DeepVoid: Enabled (click to disable)' : 'DeepVoid: Disabled (click to enable)';
        settingsButton.style.cssText = `
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: ${scriptEnabled ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)'};
            color: ${scriptEnabled ? '#4CAF50' : '#9E9E9E'};
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            transition: all 0.2s ease;
            z-index: 10000;
        `;

        settingsButton.addEventListener('mouseenter', () => {
            settingsButton.style.background = scriptEnabled ? 'rgba(76, 175, 80, 0.3)' : 'rgba(158, 158, 158, 0.3)';
        });

        settingsButton.addEventListener('mouseleave', () => {
            settingsButton.style.background = scriptEnabled ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)';
        });

        settingsButton.addEventListener('click', () => {
            const newState = !scriptEnabled;
            setScriptEnabled(newState);
            
            // Update button appearance
            settingsButton.innerHTML = newState ? '✓' : '✗';
            settingsButton.title = newState ? 'DeepVoid: Enabled (click to disable)' : 'DeepVoid: Disabled (click to enable)';
            settingsButton.style.background = newState ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)';
            settingsButton.style.color = newState ? '#4CAF50' : '#9E9E9E';
        });

        // Insert button next to DeepSeek's menu button
        // First, try to find the menu button directly
        const deepseekButton = document.querySelector('.ds-icon-button._7d1f5e2');
        if (deepseekButton && deepseekButton.parentElement) {
            // Insert right after the DeepSeek menu button
            deepseekButton.parentElement.insertBefore(settingsButton, deepseekButton.nextSibling);
            log('Settings button created next to DeepSeek menu button');
        } else if (logoContainer) {
            // Try to insert after the DeepSeek menu button in the logo container
            const menuButton = logoContainer.querySelector('.ds-icon-button._7d1f5e2');
            if (menuButton && menuButton.parentElement) {
                menuButton.parentElement.insertBefore(settingsButton, menuButton.nextSibling);
                log('Settings button created next to DeepSeek menu button (in container)');
            } else {
                // Find the _262baab container and insert there
                const innerContainer = logoContainer.querySelector('div[class*="_262baab"]') || logoContainer;
                const logoSVG = innerContainer.querySelector('svg[viewBox="0 0 143 23"], svg[width="143"][height="23"]');
                if (logoSVG && logoSVG.parentElement && logoSVG.nextSibling) {
                    // Insert after the logo's parent div (e066abb8)
                    logoSVG.parentElement.parentElement.insertBefore(settingsButton, logoSVG.parentElement.nextSibling);
                    log('Settings button created after logo container');
                } else {
                    innerContainer.appendChild(settingsButton);
                    log('Settings button created in inner container');
                }
            }
        } else {
            // Fallback: add to top of page
            document.body.insertBefore(settingsButton, document.body.firstChild);
            settingsButton.style.position = 'fixed';
            settingsButton.style.top = '10px';
            settingsButton.style.left = '10px';
            log('Settings button created in top-left corner (fallback)');
        }
    }

    /**
     * Attempts to find and add settings button, retries if needed
     */
    function initSettingsButton() {
        const maxAttempts = 10;
        let attempts = 0;

        function tryCreateButton() {
            if (document.getElementById('deepvoid-settings-btn')) {
                log('Settings button already exists');
                return;
            }

            attempts++;
            if (document.querySelector('header, nav, [class*="header"], [class*="nav"], a[href*="/"]')) {
                createSettingsButton();
            } else if (attempts < maxAttempts) {
                setTimeout(tryCreateButton, 500);
            } else {
                // Create in fixed position as fallback
                createSettingsButton();
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryCreateButton);
        } else {
            tryCreateButton();
        }
    }

    // Initialize
    log('Initializing script');
    
    // Load saved state
    scriptEnabled = getScriptEnabled();
    log(`Script ${scriptEnabled ? 'enabled' : 'disabled'} (from storage)`);
    
    // Set up request interception (always set up, but checks scriptEnabled internally)
    setupRequestInterception();
    
    // Set up display conversion when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupDisplayConversion();
            initSettingsButton();
        });
    } else {
        setupDisplayConversion();
        initSettingsButton();
    }
})();
