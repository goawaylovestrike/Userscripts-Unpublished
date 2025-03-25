// ==UserScript==
// @name         porndb-stashdb-fav-import
// @namespace    https://github.com/GoAwayLoveStrike/Userscripts/Scripts/porndb-stashdb-fav-import/
// @version      0.4
// @description  Import favorites from ThePornDB to StashDB
// @author       GoAwayLoveStrike
// @match        https://theporndb.net/user/profile
// @match        https://stashdb.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL  https://github.com/goawaylovestrike/Userscripts/raw/refs/heads/main/Scripts/porndb-stashdb-fav-import/porndb-stashdb-fav-import.user.js
// @updateURL    https://github.com/goawaylovestrike/Userscripts/raw/refs/heads/main/Scripts/porndb-stashdb-fav-import/porndb-stashdb-fav-import.user.js
// ==/UserScript==

(function() {
    'use strict';

    function extractFavoritesFromSource() {
        // Get the entire page source
        const pageSource = document.documentElement.outerHTML;
        
        // Debug: Log a portion of the page source
        console.log('Page source excerpt:', pageSource.substring(0, 1000));
        
        // Find the script tag containing the performer data - more lenient pattern
        const scriptPattern = /<script[^>]*>[\s\S]*?window\.__NUXT__\s*=\s*({[\s\S]*?})\s*;<\/script>/i;
        const scriptMatch = pageSource.match(scriptPattern);
        
        if (!scriptMatch) {
            console.log('No Nuxt data found in source');
            return [];
        }

        const nuxtData = scriptMatch[1];
        console.log('Found Nuxt data:', nuxtData.substring(0, 500));

        // Try to find performers array using a more flexible pattern
        const performersPattern = /"performers":\s*\[([\s\S]*?)\]/i;
        const performersMatch = nuxtData.match(performersPattern);

        if (!performersMatch) {
            console.log('No performers array found in Nuxt data');
            return [];
        }

        try {
            // Clean up the JSON string and parse it
            const performersJson = `[${performersMatch[1]}]`;
            console.log('Attempting to parse:', performersJson.substring(0, 500));
            
            const performersData = JSON.parse(performersJson);
            
            const performers = performersData.map(data => {
                console.log('Processing performer data:', data);
                return {
                    name: data.full_name,
                    stashId: data.links?.StashDB?.split('/').pop() || null
                };
            });

            console.log(`Found ${performers.length} favorites`);
            return performers;
        } catch (e) {
            console.error('Error parsing performers data:', e);
            console.error('Error details:', e.message);
            return [];
        }
    }

    function createImportButton() {
        const button = document.createElement('button');
        button.textContent = 'Import Favorites to StashDB';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        
        button.addEventListener('click', () => {
            const favorites = extractFavoritesFromSource();
            GM_setValue('porndb_favorites', JSON.stringify(favorites));
            alert(`Found ${favorites.length} favorites. Now go to StashDB to import them.`);
        });

        document.body.appendChild(button);
    }

    // Initialize based on current site
    if (window.location.hostname === 'theporndb.net') {
        createImportButton();
    } else if (window.location.hostname === 'stashdb.org') {
        // StashDB import logic will go here
        // We'll implement this after you confirm the favorites extraction works
    }
})();
