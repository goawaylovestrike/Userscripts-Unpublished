// ==UserScript==
// @name         porndb-stashdb-fav-import
// @namespace    https://github.com/GoAwayLoveStrike/Userscripts/Scripts/porndb-stashdb-fav-import/
// @version      0.2
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
        
        // Find the script tag containing the performer data
        const scriptContent = pageSource.match(/window\.__NUXT__=(.*?);<\/script>/)?.[1] || '';
        
        // Extract the performers array from the script content
        const performersMatch = scriptContent.match(/performers:\[(.*?)\],/)?.[1] || '';
        
        if (!performersMatch) {
            console.log('No favorites data found in source');
            return [];
        }

        try {
            // Convert the matched string into valid JSON array
            const performersJson = `[${performersMatch}]`;
            const performersData = JSON.parse(performersJson);
            
            const performers = performersData.map(data => {
                console.log('Found performer:', data.full_name);
                return {
                    name: data.full_name,
                    stashId: data.links?.StashDB?.split('/').pop() || null
                };
            });

            console.log(`Found ${performers.length} favorites`);
            return performers;
        } catch (e) {
            console.error('Error parsing performers data:', e);
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