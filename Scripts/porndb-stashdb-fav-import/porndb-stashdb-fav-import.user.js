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

    function waitForPerformers(maxAttempts = 10) {
        return new Promise((resolve) => {
            let attempts = 0;
            
            const checkForPerformers = () => {
                const performers = document.querySelectorAll('.n-data-table-td[data-col-key="name"]');
                console.log(`Attempt ${attempts + 1}: Found ${performers.length} performers`);
                
                if (performers.length > 0) {
                    resolve(Array.from(performers));
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkForPerformers, 1000);
                } else {
                    resolve([]);
                }
            };
            
            checkForPerformers();
        });
    }

    async function extractFavoritesFromSource() {
        const performerCells = await waitForPerformers();
        
        if (performerCells.length === 0) {
            console.log('No performers found after waiting');
            return [];
        }

        const favorites = performerCells.map(cell => {
            const name = cell.textContent.trim();
            // Find the StashDB link in the same row
            const row = cell.closest('tr');
            const stashLink = row.querySelector('a[href*="stashdb.org/performers/"]');
            const stashId = stashLink ? stashLink.href.split('/').pop() : null;

            console.log(`Found performer: ${name} (StashID: ${stashId})`);
            return { name, stashId };
        }).filter(p => p.name && p.name !== '');

        console.log(`Found ${favorites.length} favorites`);
        return favorites;
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
        
        button.addEventListener('click', async () => {
            const favorites = await extractFavoritesFromSource();
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
