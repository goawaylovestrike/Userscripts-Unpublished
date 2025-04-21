// ==UserScript==
// @name         Quick Porn Search
// @namespace    https://github.com/goawaylovestrike/Userscripts/quick-porn-search
// @description  Adds a dropdown on many porn sites to search various sites either using data found in the html or simply pulling it from the url.
// @author       GoAwayLoveStrike
// @version      4.3
// @updateURL    https://github.com/goawaylovestrike/Userscripts/raw/refs/heads/main/Scripts/quick-porn-search/quick-porn-search.user.js
// @downloadURL  https://github.com/goawaylovestrike/Userscripts/raw/refs/heads/main/Scripts/quick-porn-search/quick-porn-search.user.js
// @include https://bangbros.com/*
// @include https://www.pervmom.com/*
// @include https://pornpros.com/*
// @include https://www.mofos.com/*
// @include https://www.teamskeet.com/*
// @include https://www.brazzers.com/*
// @include https://tour.nympho.com/*
// @include https://tour.trueanal.com/*
// @include https://tour.analonly.com/*
// @include https://tour.allanal.com/*
// @include https://www.mylf.com/*
// @include https://tiny4k.com/*
// @include https://lubed.com/*
// @include https://cum4k.com/*
// @include https://exotic4k.com/*
// @include https://nubiles-porn.com/*
// @include https://www.realitykings.com/*
// @include https://povd.com/*
// @include https://www.milfed.com/*
// @include https://momlover.com/*
// @include https://www.sislovesme.com/*
// @include https://www.dadcrush.com/*
// @include https://theporndb.net/*
// @include https://www.manyvids.com/Video/*
// @include https://www.daughterswap.com/*
// @include https://www.adultdvdempire.com/*
// @include https://gloryholeswallow.com/*
// @include https://www.gloryholesecrets.com/*
// @include https://dirtyauditions.com/*
// @include https://www.bang.com/*
// @include https://jayspov.net/*
// @include https://holed.com/*
// @include https://anal4k.com/*
// @include https://www.naughtyamerica.com/*
// @include https://www.mrluckypov.com/*
// @include https://www.porndupe.net/*
// @include https://inserted.com/*
// @include https://pervcity.com/*
// @include https://www.tushyraw.com/*
// @include https://girlcum.com/*
// @include https://www.propertysex.com/*
// @include https://www.vixen.com/*
// @include https://bangpremium.com/*
// @include https://stashdb.org/*
// @include https://fansdb.cc/*
// @include https://www.mormongirlz.com/*
// @include https://www.bangadventures.com/*
// @include https://www.wifey.com/*
// @include https://www.lookathernow.com/*
// @include https://tour.swallowed.com/*
// @include https://stepsiblingscaught.com/*
// @include https://badteenspunished.com/*
// @include https://bountyhunterporn.com/*
// @include https://caughtmycoach.com/*
// @include https://cheatingsis.com/*
// @include https://cumswappingsis.com/*
// @include https://daddyslilangel.com/*
// @include https://detentiongirls.com/*
// @include https://driverxxx.com/*
// @include https://familyswap.xxx/*
// @include https://momsteachsex.com/*
// @include https://myfamilypies.com/*
// @include https://nubiles.net/*
// @include https://nubiles-casting.com/*
// @include https://nubileset.com/*
// @include https://nubilesunscripted.com/*
// @include https://petiteballerinasfucked.com/*
// @include https://petitehdporn.com/*
// @include https://princesscum.com/*
// @include https://realitysis.com/*
// @include https://smashed.xxx/*
// @include https://teacherfucksteens.com/*
// @include https://youngermommy.com/*
// @include https://www.nubilefilms.com/*
// @include https://nubilefilms.com/*
// @include https://www.girlsonlyporn.com/*
// @include https://nfbusty.com/*
// @include https://www.thatsitcomshow.com/*
// @include https://hotcrazymess.com/*
// @include https://momlover.com/*
// @include https://MomWantsToBreed.com/*
// @include https://MomWantsCreampie.com/*
// @include https://MomSwapped.com/*
// @include https://brattymilf.com/*
// @include https://MomsBoyToy.com/*
// @include https://MomsTight.com/*
// @include https://ImNotYourMommy.com/*
// @include https://MomsFamilySecrets.com/*
// @include https://www.thePOVGod.com/*
// @include https://thepovgod.com/*
// @include https://brattysis.com/*
// @include https://anilos.com/*
// @include https://deeplush.com/*
// @include https://www.concoxxxion.com/*
// @include https://www.kaiiaeve.com/*
// @include https://lewood.com/*
// @include https://adameveplus.com/*
// @include https://www.stephousexxx.com/*
// @include https://18lust.com/*
// @include https://joannaangel.com/*
// @include https://*.empirestores.co/*
// @include https://www.pornstarempire.com/*
// @include https://www.mypervyfamily.com/*
// @include https://www.lethalhardcorevr.com/*
// @include https://www.lethalhardcorevr.com/*
// @include https://store.fapnado.com/*
// @include https://www.fetishmovies.com/*
// @include https://*.fapnado.com/*
// @include https://jonathanjordanxxx.com/*
// @include https://bruthasinc.com/*
// @include https://www.westcoastproductions.com/*
// @include https://www.stephousexxx.com/*
// @include https://www.spankmonster.com/*
// @include https://18lust.com/*
// @include https://www.lethalhardcore.com/*
// ==/UserScript==

// Search button configuration - Edit these to add/remove/modify search options
const searchButtons = [
    {
        name: '1337x',
        url: 'https://1337x.to/sort-search/{query}/time/desc/1/'
    },
    {
        name: 'PornoLabs',
        url: 'https://pornolab.net/forum/tracker.php?max=1&nm={query}'
    },
    {
        name: 'Yandex',
        url: 'https://yandex.com/search/?text={query}'
    },
    {
        name: 'Custom Google',
        url: 'https://cse.google.com/cse?cx=4158a1b0ef111426d#gsc.tab=0&gsc.q={query}'
    },
    {
        name: 'Full Porn',
        url: 'https://www.fullporn.xxx/search/{query}/',
        queryTransform: (query) => query.replace(/\s+/g, '-') //This replaces all spaces with dashes in the url which is required for some sites.
    },
    {
        name: 'WatchPorn.to',
        url: 'https://watchporn.to/search/{query}/',
        queryTransform: (query) => query.replace(/\s+/g, '-')
    },
    {
        name: 'Porn Horder',
        url: 'https://w15.pornhoarder.tv/search/?search={query}&sort=0&date=0&servers%5B%5D=47&servers%5B%5D=21&servers%5B%5D=40&servers%5B%5D=45&servers%5B%5D=12&servers%5B%5D=35&servers%5B%5D=25&servers%5B%5D=41&servers%5B%5D=44&servers%5B%5D=42&servers%5B%5D=43&servers%5B%5D=29&author=0&page=1'
    }
];

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 768;
}

(function() {
    'use strict';

    var searchterm = null;
    let initAttempts = 0;
    const MAX_ATTEMPTS = 5;

    // Remove this line - it's unused
    // let patternFound = false;

    // These are still needed
    let includeTitle = true;
    let includePerformers = true;
    let includeSite = true;


    // Initialize with retry mechanism
    console.log('DOM ready state:', document.readyState);
    console.log('Current URL:', window.location.href);
    console.log('Attempt number:', initAttempts + 1, 'of', MAX_ATTEMPTS);

    function initialize() {
        if (initAttempts >= MAX_ATTEMPTS) {
            console.log('Failed to initialize after maximum attempts');
            return;
        }

        initAttempts++;

        // First detect the pattern
        const pattern = detectSitePattern();

        if (!pattern) {
            // Remove buttons
            document.querySelectorAll('.search-button-container').forEach(el => el.remove());

            // Retry after delay if we haven't hit max attempts
            if (initAttempts < MAX_ATTEMPTS) {
                setTimeout(initialize, 1000);
            }
            return;
        }

        // Set the current pattern for use by other functions
        window._currentPattern = pattern;

        updateSearchButtons();
    }

    function getHostnameSite() {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        // Always take the part before the TLD (second-to-last part)
        return parts[parts.length - 2].toLowerCase();
    }

    function getsearchterm() {
        const hostname = window.location.hostname;
        const path = window.location.pathname;

        if (!path || path === '/' || path.includes('/categories') ||
            path.includes('/search') || path.includes('/models') ||
            path.includes('/channels') || path.includes('/tags')) {
            return;
        }

        let title = null;
        let performers = [];
        let site = null;
        searchterm = null;

        if (window._currentPattern) {
            const { selectors } = window._currentPattern;

            const titleElement = document.querySelector(selectors.title);
            if (titleElement) {
                title = titleElement.textContent.trim();
            }

            const performerElements = Array.from(document.querySelectorAll(selectors.performers));
            if (performerElements.length > 0) {
                if (window._currentPattern && window._currentPattern.name === 'GLORY') {
                    performers = performerElements
                        .map(el => {
                            const text = el.textContent.trim();
                            const match = text.match(/\((.*?)\)/);
                            return match ? match[1].trim().replace(/[@\s]/g, '') : '';
                        })
                        .filter(name => name !== '');
                } else {
                    performers = performerElements
                        .map(el => el.textContent.trim())
                        .filter(name => name && name !== '');
                }
            }

            const siteElement = document.querySelector(selectors.site);
            if (siteElement) {
                site = window._currentPattern.siteTransform ?
                    window._currentPattern.siteTransform(siteElement) :
                    siteElement.textContent.trim();
            }

            if (!site) {
                site = getHostnameSite();
            }
        }

        // Build searchterm based on checkbox preferences
        const parts = [];

        if (includePerformers && performers.length > 0) {
            parts.push(performers.join(' '));
        }

        if (includeTitle && title) {
            parts.push(title);
        }

        if (includeSite && site) {
            parts.push(site.replace(/\((\w+)\)/g, '$1')); // Remove parentheses but keep content
        }

        searchterm = parts.join(' ').trim()
            .replace(/[^\w\s-.!&]/g, ' ')
            .replace(/\s+/g, ' ');
        console.log(`Final searchterm for ${hostname}:`, searchterm);
    }

    function updateSearchLinks() {
        // Get all existing links in the dropdown
        const links = document.querySelectorAll('.search-button-container a');

        // Update each link's href with the new searchterm
        links.forEach(link => {
            const buttonName = link.textContent.trim();
            const button = searchButtons.find(b => b.name === buttonName);
            if (button) {
                const query = button.queryTransform ?
                    button.queryTransform(searchterm) :
                    encodeURIComponent(searchterm);
                link.href = button.url.replace('{query}', query);
            }
        });
    }

    function updateSearchButtons() {
        // Remove the pattern check since it's already done in initialize()
        getsearchterm();

        // Only create dropdown if we have a valid searchterm
        if (searchterm && searchterm.length > 0) {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'search-button-container';

            // Adjust container position based on device
            const isMobile = isMobileDevice();
            dropdownContainer.style.cssText = `
                position: fixed !important;
                ${isMobile ? 'left: 5px !important; top: 10px !important;' : 'left: 15px !important; top: 80px !important;'}
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;

            // Create the dropdown button
            const dropdownButton = document.createElement('button');
            if (isMobile) {
                dropdownButton.textContent = '🔍';
                dropdownButton.style.cssText = `
                    background: #ffffff !important;
                    color: #000000 !important;
                    font-family: Arial, sans-serif !important;
                    font-weight: bold !important;
                    padding: 8px !important;
                    border: 2px solid #000000 !important;
                    border-radius: 50% !important;
                    font-size: 16px !important;
                    cursor: pointer !important;
                    width: 40px !important;
                    height: 40px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
                `;
            } else {
                dropdownButton.textContent = '🔍 Search';
                dropdownButton.style.cssText = `
                    background: #ffffff !important;
                    color: #000000 !important;
                    font-family: Arial, sans-serif !important;
                    font-weight: bold !important;
                    padding: 10px 15px !important;
                    border: 2px solid #000000 !important;
                    border-radius: 7px !important;
                    font-size: 18px !important;
                    cursor: pointer !important;
                    min-width: 140px !important;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
                `;
            }

            // Create the dropdown content
            const dropdownContent = document.createElement('div');
            dropdownContent.style.cssText = `
                display: none;
                position: absolute !important;
                background-color: #ffffff !important;
                min-width: ${isMobile ? '200px' : '140px'} !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
                border-radius: 7px !important;
                margin-top: 5px !important;
                border: 2px solid #000000 !important;
                overflow: hidden !important;
                ${isMobile ? 'left: 0 !important;' : ''}
            `;

            searchButtons.forEach(button => {
                const link = document.createElement('a');
                link.id = button.name;

                // Create favicon image
                const favicon = document.createElement('img');
                const urlObj = new URL(button.url);
                const domain = urlObj.hostname.split('.').slice(-2).join('.');
                favicon.src = `${urlObj.protocol}//${domain}/favicon.ico`;
                favicon.style.cssText = `
                    width: 16px !important;
                    height: 16px !important;
                    margin-right: 8px !important;
                    vertical-align: middle !important;
                    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2)) !important;
                `;

                const textSpan = document.createElement('span');
                textSpan.textContent = button.name;
                textSpan.style.cssText = `
                    vertical-align: middle !important;
                    font-weight: bold !important;
                    color: #000000 !important;
                    font-size: 14px !important;
                    font-family: Arial, sans-serif !important;
                    line-height: normal !important;
                `;

                const query = button.queryTransform ?
                    button.queryTransform(searchterm) :
                    encodeURIComponent(searchterm);
                link.href = button.url.replace('{query}', query);
                link.target = '_blank';
                link.style.cssText = `
                    color: #000000 !important;
                    background: white !important;
                    padding: 10px 10px !important;
                    text-decoration: none !important;
                    display: flex !important;
                    align-items: center !important;
                    text-align: left !important;
                    font-size: 14px !important;
                    cursor: pointer !important;
                    border-bottom: 1px solid #eee !important;
                    font-family: Arial, sans-serif !important;
                    line-height: normal !important;
                    width: auto !important;
                    height: auto !important;
                `;

                textSpan.style.cssText = `
                    vertical-align: middle !important;
                    font-weight: bold !important;
                    color: #000000 !important;
                    font-size: 15px !important;
                    line-height: normal !important;
                `;

                const container = document.createElement('div');
                container.className = 'search-button-container';
                container.style.cssText = `
                    position: fixed !important;
                    top: 10px !important;
                    right: 10px !important;
                    background: white !important;
                    border: 1px solid #ddd !important;
                    border-radius: 4px !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                    z-index: 9999999 !important;
                    width: auto !important;
                    min-width: 200px !important;
                `;

                link.onmouseover = function() {
                    this.style.backgroundColor = '#f1f1f1 !important';
                };
                link.onmouseout = function() {
                    this.style.backgroundColor = '#ffffff !important';
                };

                link.appendChild(favicon);
                link.appendChild(textSpan);
                dropdownContent.appendChild(link);
            });

            const separator = document.createElement('div');
            separator.style.cssText = `
                border-top: 2px solid #eee !important;
                margin-top: 5px !important;
            `;
            dropdownContent.appendChild(separator);

            const controlsDiv = document.createElement('div');
            controlsDiv.style.borderBottom = '1px solid #ddd';
            controlsDiv.style.marginBottom = '10px';
            controlsDiv.style.paddingBottom = '10px';

            const options = [
                { id: 'includePerformers', label: 'Performers', ref: () => includePerformers },
                { id: 'includeTitle', label: 'Title', ref: () => includeTitle },
                { id: 'includeSite', label: 'Site', ref: () => includeSite }
            ];

            options.forEach(option => {
                const div = document.createElement('div');
                div.style.marginBottom = '5px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = option.id;
                checkbox.checked = option.ref();
                checkbox.style.cssText = `
                    margin-right: 5px !important;
                    cursor: pointer !important;
                `;

                // Single consolidated event listener
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    console.log(`Checkbox ${option.id} changed to ${checkbox.checked}`); // Debug log
                    switch(option.id) {
                        case 'includePerformers':
                            includePerformers = checkbox.checked;
                            break;
                        case 'includeTitle':
                            includeTitle = checkbox.checked;
                            break;
                        case 'includeSite':
                            includeSite = checkbox.checked;
                            break;
                    }
                    getsearchterm();
                    updateSearchLinks();
                    console.log('Updated searchterm:', searchterm); // Debug log
                });

                const label = document.createElement('label');
                label.htmlFor = option.id;
                label.textContent = option.label;
                label.style.cssText = `
                    font-family: Arial, sans-serif !important;
                    font-size: 12px !important;
                    color: black !important;
                    cursor: pointer !important;
                `;

                div.appendChild(checkbox);
                div.appendChild(label);
                controlsDiv.appendChild(div);
            });

            dropdownContent.appendChild(controlsDiv);

            // Toggle dropdown on click
            dropdownButton.onclick = function(e) {
                e.stopPropagation();
                dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
            };

            dropdownContainer.appendChild(dropdownButton);
            dropdownContainer.appendChild(dropdownContent);

            if (document.body) {
                document.body.appendChild(dropdownContainer);
                console.log('Dropdown created with searchterm:', searchterm);
            }
        }
    }

    initialize();

    // Watch for URL changes
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Immediately remove the button
            document.querySelectorAll('.search-button-container').forEach(el => el.remove());
            // Reset attempts and try to initialize with new page
            initAttempts = 0;
            setTimeout(initialize, 1000);
        }
    });

    observer.observe(document.body || document, {
        subtree: true,
        childList: true
    });

    function detectSitePattern() {
        const hostname = window.location.hostname;

        // Define common selectors to test
        const commonPatterns = [
            {
                name: 'TEAMSKEET',
                selectors: {
                    title: '.sceneTitle',
                    performers: '.contentTitle .model-name-link',
                    site: '.siteName'
                }
            },
            {
                name: 'NAUGHTYAMERICA',
                selectors: {
                    title: 'h1.scene-title',
                    performers: '.performer-list',
                    site: '.site-title'
                }
            },
            {
                name: 'ADULTEMPIRECASH',
                selectors: {
                    title: '.video-title, .title-name',
                    performers: 'span.video-performer-name span.overlay-inner, [data-label="Performer"]',
                    site: 'div.studio span:not(.font-weight-bold), meta[property="og:site_name"]'
                },
                siteTransform: (el) => el.tagName.toLowerCase() === 'meta' ?
                    el.getAttribute('content') : el.textContent
            },
            {
                name: 'STASHBOX',
                selectors: {
                    title: '.card-header h3 span',
                    performers: '.scene-performer span',
                    site: 'a[href^="/studios/"]'
                }
            },
            {
                name: 'AYLO',
                selectors: {
                    title: 'h2.sc-wxt7nk-4, h2.sc-1b6bgon-3, h1.sc-1b6bgon-3',
                    performers: 'a[href^="/pornstar/"][class^="sc-"], a[href^="/model/"][class^="sc-"]',
                    site: '.sc-vdkjux-5'
                }
            },
            {
                name: 'PORNPROS',
                selectors: {
                    title: 'div[id="trailer_player"] .scene-info h1',
                    performers: '.scene-info .link-list-with-commas a'
                }
            },
            {
                name: 'BANG',
                selectors: {
                    title: '[data-controller="video-entry"] div.flex.mb-6',  // More specific selector targeting h1 within the flex container
                    performers: 'div.w-full .leading-6 a[href^="/pornstar/"]'
                }
            },
            {
                name: 'VIXEN',
                selectors: {
                    title: '[data-test-component="VideoTitle"]',  // More specific selector targeting h1 within the flex container
                    performers: '[data-test-component="VideoModels"] a[href^="/performers/"]'
                }
            },
            {
                name: 'NUBILES',
                selectors: {
                    title: 'div.row.content-pane-container .content-pane-title h2',  // More specific selector targeting h1 within the flex container
                    performers: '.content-pane-performer.model',
                    site: '.row.content-pane-container .site-link'
                }
            },
            {
                name: 'THEPORNDB',
                selectors: {
                    title: '.justify-between h2.text-3xl',  // More specific selector targeting h1 within the flex container
                    performers: 'div.px-3.py-1.text-center h2.text-xl a[title]',
                    site: 'a[href^="/sites/"]'
                }
            },
            {
                name: 'MANYVIDS',
                selectors: {
                    title: '.VideoMetaInfo_title__mWRak',  // More specific selector targeting h1 within the flex container
                    performers: '.VideoProfileCard_actions__x_NEr',
                    site: 'a[href^="/sites/"]'
                }
            },
            {
                name: 'ADULTDVDEMPIRE',
                selectors: {
                    title: '.movie-page__heading__title',  // More specific selector targeting h1 within the flex container
                    performers: '[label="Performer"]',
                    site: '[label="Studio"]'
                }
            },
            {
                name: 'GLORYHOLESWALLOW',
                selectors: {
                    title: 'div.memberVideoPics div.objectInfo h1',
                    performers: 'div.content p'
                }
            },
            {
                name: 'STICKYDOLLARS',
                selectors: {
                    title: 'h1.title',  // More specific selector targeting h1 within the flex container
                    performers: 'h2.models a[href^="/models/"]'
                }
            },
            {
                name: 'GLORYHOLESECRETS',
                selectors: {
                    title: 'h1.Title',  // More specific selector targeting h1 within the flex container
                    performers: '.ActorThumb-Name-Link'
                }
            }
        ];

        console.log(`[Pattern Detector] ⚡ Starting pattern detection for: ${hostname}`);

        // Find matching patterns
        const matchingPattern = commonPatterns.find(pattern => {
            const { selectors } = pattern;
            let matches = 0;

            for (const [key, selector] of Object.entries(selectors)) {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    matches++;
                    console.log(`[Pattern Detector] Found ${elements.length} matches for ${key} using selector: ${selector}`);

                    // Log the actual site name if we're checking the site selector
                    if (key === 'site') {
                        console.log(`[Pattern Detector] Site name found: "${elements[0].textContent.trim()}"`);
                    }
                }
            }
            return matches >= 2;
        });

        if (matchingPattern) {
            console.log(`[Pattern Detector] Found matching pattern: ${matchingPattern.name}`, matchingPattern);
            window._currentPattern = matchingPattern;

            // Immediately try to extract data using the pattern
            const titleElement = document.querySelector(matchingPattern.selectors.title);
            const performerElements = document.querySelectorAll(matchingPattern.selectors.performers);
            const siteElement = document.querySelector(matchingPattern.selectors.site);

            console.log('[Pattern Detector] Extracted data:', {
                title: titleElement?.textContent.trim(),
                performers: Array.from(performerElements).map(el => el.textContent.trim()),
                site: siteElement?.textContent.trim()
            });

            return matchingPattern;
        }

        console.log(`[Pattern Detector] No matching patterns found for ${hostname}`);
        return null;
    }
})();