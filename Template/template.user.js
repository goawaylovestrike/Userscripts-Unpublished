// ==UserScript==
// @name         My Userscript
// @namespace    https://github.com/GoAwayLoveStrike/UnlistedUserscripts
// @version      0.1
// @description  Short description of what this script does
// @author       GoAwayLoveStrike
// @match        https://example.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=example.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = (GM_info?.script?.name + '-Debug');
    const log = (...args) => console.log('%c' + LOG_PREFIX, 'color: #4CAF50; font-weight: bold;', ...args);
    const warn = (...args) => console.warn('%c' + LOG_PREFIX, 'color: #FF9800; font-weight: bold;', ...args);
    const error = (...args) => console.error('%c' + LOG_PREFIX, 'color: #F44336; font-weight: bold;', ...args);
  
    // Your code here...
    log("Userscript loaded! Version: " + GM_info?.script?.version);
})();
