// ==UserScript==
// @name         porndb-stashdb-fav-import
// @namespace    https://github.com/GoAwayLoveStrike
// @version      0.1
// @description  Import favorites from ThePornDB to StashDB
// @author       GoAwayLoveStrike
// @match        https://theporndb.net/user/profile
// @match        https://stashdb.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    function extractFavoritesFromSource() {
        // Get the entire page source
        const pageSource = document.documentElement.outerHTML;
        
        // Find all JSON objects that match our performer pattern
        const regex = /{[^}]+"full_name":"[^"}]+"}[,\n]/g;
        const matches = pageSource.match(regex);

        if (!matches) {
            console.log('No favorites found in source');
            return [];
        }

        // Parse each match and extract performer data
        const performers = matches.map(jsonStr => {
            try {
                // Clean up the JSON string
                const cleanJson = jsonStr.replace(/,$/, '');
                const data = JSON.parse(cleanJson);
                
                return {
                    name: data.full_name,
                    stashId: data.links?.StashDB?.split('/').pop() || null
                };
            } catch (e) {
                console.error('Error parsing performer JSON:', e);
                return null;
            }
        }).filter(p => p !== null);

        console.log(`Found ${performers.length} favorites`);
        return performers;
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

