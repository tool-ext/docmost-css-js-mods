// ==UserScript==
// @name         Auto-Click TOC Button for Docmost
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Auto-click TOC button on Docmost SPA navigation with optional header check
// @match        *://*.docmost.com/*  // Adjust to your Docmost instance URL
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
  
    // Toggle header check (true: require >=2 headers, false: click on every page load)
    const USE_HEADER_CHECK = true;
  
    // Debounce function to prevent multiple rapid clicks
    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }
  
    // Check for 2 or more headers in .mantine-Container-root
    function hasMultipleHeaders() {
      try {
        const container = document.querySelector('.mantine-Container-root');
        if (!container) {
          console.log('No .mantine-Container-root found');
          return false;
        }
        const headers = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        console.log(`Found ${headers.length} headers in .mantine-Container-root`);
        return headers.length >= 2;
      } catch (error) {
        console.error('Error in hasMultipleHeaders:', error);
        return false;
      }
    }
  
    function clickTocButton() {
      try {
        // Check headers if USE_HEADER_CHECK is true
        if (USE_HEADER_CHECK && !hasMultipleHeaders()) {
          console.log('Less than 2 headers found, skipping TOC click');
          return false;
        }
  
        const tocButton = Array.from(document.querySelectorAll('button.mantine-ActionIcon-root'))
          .find(btn => btn.querySelector('svg.tabler-icon-list'));
  
        if (!tocButton) {
          console.log('TOC button not found');
          return false;
        }
  
        // Check if sidebar is already open
        const aside = document.querySelector('aside.mantine-Aside-root');
        if (aside && (
          aside.style.display !== 'none' ||
          aside.classList.contains('mantine-Aside-visible') ||
          aside.getAttribute('data-visible') === 'true' ||
          aside.getAttribute('data-state') === 'open' ||
          aside.offsetWidth > 0
        )) {
          console.log('Sidebar already open, skipping click');
          return true;
        }
  
        console.log('TOC button found:', tocButton);
        tocButton.click();
        console.log('TOC button clicked');
        return true;
      } catch (error) {
        console.error('Error in clickTocButton:', error);
        return false;
      }
    }
  
    // Debounced click function
    const debouncedClickTocButton = debounce(clickTocButton, 1000);
  
    // Detect navigation via history changes
    function handleNavigation(eventType) {
      console.log(`Navigation detected via ${eventType}`);
      debouncedClickTocButton();
    }
  
    // Override pushState and replaceState
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      handleNavigation('pushState');
      return originalPushState.apply(this, args);
    };
  
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
      handleNavigation('replaceState');
      return originalReplaceState.apply(this, args);
    };
  
    // Listen for popstate (back/forward)
    window.addEventListener('popstate', () => handleNavigation('popstate'));
  
    // Run on initial load with a delay
    console.log('Running initial TOC button click, header check:', USE_HEADER_CHECK);
    setTimeout(debouncedClickTocButton, 500);
  })();