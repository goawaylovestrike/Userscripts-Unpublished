// ==UserScript==
// @name         porndb-stashdb-fav-import
// @namespace    https://github.com/goawaylovestrike/Userscripts-Unpublished/Scripts/porndb-stashdb-fav-import/
// @version      0.3
// @description  Import favorites from ThePornDB to StashDB
// @author       GoAwayLoveStrike
// @match        https://theporndb.net/user/profile
// @match        https://stashdb.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL  https://github.com/goawaylovestrike/Userscripts-Unpublished/raw/refs/heads/main/Scripts/porndb-stashdb-fav-import/porndb-stashdb-fav-import.user.js
// @updateURL    https://github.com/goawaylovestrike/Userscripts-Unpublished/raw/refs/heads/main/Scripts/porndb-stashdb-fav-import/porndb-stashdb-fav-import.user.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    async function extractPerformersFromCurrentPage() {
        const performerCells = await waitForPerformers();
        
        return performerCells.map(cell => {
            const name = cell.textContent.trim();
            const row = cell.closest('tr');
            const stashLink = row.querySelector('a[href*="stashdb.org/performers/"]');
            const stashId = stashLink ? stashLink.href.split('/').pop() : null;

            console.log(`Found performer: ${name} (StashID: ${stashId})`);
            return { name, stashId };
        }).filter(p => p.name && p.name !== '');
    }

    async function getAllPerformers() {
        let allPerformers = [];
        let currentPage = 1;
        let hasNextPage = true;

        while (hasNextPage) {
            console.log(`Processing page ${currentPage}`);
            
            // Extract performers from current page
            const performers = await extractPerformersFromCurrentPage();
            allPerformers = allPerformers.concat(performers);
            
            // Check if there's a next page
            const nextButton = Array.from(document.querySelectorAll('.n-pagination-item')).find(
                item => item.textContent.trim() === (currentPage + 1).toString()
            );
            
            if (nextButton) {
                nextButton.click();
                currentPage++;
                // Wait for the new page to load
                await sleep(1000);
            } else {
                hasNextPage = false;
            }
        }

        return allPerformers;
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
            button.disabled = true;
            button.textContent = 'Collecting favorites...';
            
            try {
                const favorites = await getAllPerformers();
                GM_setValue('porndb_favorites', JSON.stringify(favorites));
                alert(`Found ${favorites.length} favorites across all pages. Now go to StashDB to import them.`);
            } catch (error) {
                console.error('Error collecting favorites:', error);
                alert('Error collecting favorites. Check console for details.');
            } finally {
                button.disabled = false;
                button.textContent = 'Import Favorites to StashDB';
            }
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
