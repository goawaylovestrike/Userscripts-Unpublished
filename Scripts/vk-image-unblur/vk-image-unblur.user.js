// ==UserScript==
// @name         VK.com Image Unblur
// @namespace    https://github.com/goawaylovestrike
// @version      1.1
// @description  Remove blur effects from thumbnails on vk.com
// @author       GoAwayLoveStrike
// @downloadURL  https://github.com/goawaylovestrike/Userscripts/raw/refs/heads/main/Scripts/vk-image-unblur/vk-image-unblur.user.js
// @match        https://vk.com/*
// @match        https://vkvideo.ru/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove blur from images
    function removeBlur() {
        // Find all images with blur classes
        const blurredImages = document.querySelectorAll('img[class*="imgBlurred"], img[class*="blur"]');
        
        blurredImages.forEach(img => {
            // Remove blur-related classes
            img.className = img.className.replace(/imgBlurred[^\s]*/g, '');
            img.className = img.className.replace(/blur[^\s]*/g, '');
            
            // Apply unblur styles
            img.style.filter = 'none';
            img.style.webkitFilter = 'none';
            img.style.transform = 'none';
            img.style.transition = 'none';
        });
    }

    // Function to handle video player restrictions and controls
    function handleVideoPlayer() {
        // Remove blur class from video player
        const videoPlayer = document.querySelector('.videoplayer--blur');
        if (videoPlayer) {
            videoPlayer.classList.remove('videoplayer--blur');
        }
        
        // Remove restriction class from video player
        const restrictedPlayer = document.querySelector('.videoplayer--hasRestriction');
        if (restrictedPlayer) {
            restrictedPlayer.classList.remove('videoplayer--hasRestriction');
        }
        
        // Show video controls
        const videoControls = document.querySelector('.videoplayer_controls');
        if (videoControls) {
            videoControls.classList.remove('unshown');
            videoControls.style.opacity = '1';
            videoControls.style.visibility = 'visible';
        }
        
        // Show all control items
        const controlItems = document.querySelectorAll('.videoplayer_controls_item');
        controlItems.forEach(item => {
            item.style.opacity = '1';
            item.style.visibility = 'visible';
        });
        
        // Pause video if it's playing (to prevent auto-play after restriction bypass)
        const video = document.querySelector('video');
        if (video && !video.paused) {
            video.pause();
        }
        
        // Ensure video starts paused
        if (video) {
            video.pause();
            // Remove any autoplay attributes
            video.removeAttribute('autoplay');
            video.removeAttribute('muted');
        }
    }

    // Function to add CSS to prevent blur
    function addUnblurCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Remove blur from all images */
            img[class*="imgBlurred"],
            img[class*="blur"] {
                filter: none !important;
                webkit-filter: none !important;
                transform: none !important;
                transition: none !important;
            }
            
            /* Remove blur from video preview images specifically */
            .vkitVideoCardPreviewImage__imgBlurred--uTIvm,
            .vkitVideoCardPreviewImage__imgBlurredSizeS--0ck4C {
                filter: none !important;
                webkit-filter: none !important;
                transform: none !important;
                transition: none !important;
            }
            
            /* Override any blur effects */
            *[class*="blur"] {
                filter: none !important;
                webkit-filter: none !important;
            }
            
            /* Remove blur from video player */
            .videoplayer--blur {
                filter: none !important;
                webkit-filter: none !important;
            }
            
            /* Remove blur from video thumbnails */
            .videoplayer_thumb_blur {
                display: none !important;
            }
            
            /* Remove blur from video restriction overlay */
            .VideoRestriction--blur {
                filter: none !important;
                webkit-filter: none !important;
            }
            
            /* Remove blur from video preview images */
            .videoplayer_thumb {
                filter: none !important;
                webkit-filter: none !important;
            }
            
            /* Remove blur from video card preview images */
            .vkitVideoCardPreviewImage__img--Rk6St {
                filter: none !important;
                webkit-filter: none !important;
                transform: none !important;
                transition: none !important;
            }
            
            /* Hide age restriction overlay completely */
            .VideoRestriction {
                display: none !important;
            }
            
            /* Remove age restriction state from video player */
            .videoplayer--hasRestriction {
                /* Remove the restriction class behavior */
            }
            
            /* Show video player controls by default */
            .videoplayer_controls {
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            /* Remove the 'unshown' class that hides controls */
            .videoplayer_controls.unshown {
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            /* Ensure controls are always visible */
            .videoplayer_controls_item {
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            /* Hide the restriction/hide icons */
            .vkuiIcon--hide_outline_24,
            .vkuiIcon--hide_outline_28,
            svg[class*="hide_outline"] {
                display: none !important;
            }
            
            /* Hide restriction overlays on video cards */
            .vkitVideoCardRestrictionOverlay__restriction--fAC7b {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Run immediately
    removeBlur();
    addUnblurCSS();
    handleVideoPlayer();

    // Set up observer to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeBlur();
                handleVideoPlayer();
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run periodically to catch any missed elements
    setInterval(() => {
        removeBlur();
        handleVideoPlayer();
    }, 2000);

    console.log('VK.com Image Unblur script loaded successfully!');
})();
