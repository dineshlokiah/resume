/**
 * Progressive Enhancement Script for Resume Webpage
 * 
 * This script provides optional enhancements that improve user experience
 * without breaking core functionality. All features use feature detection
 * and degrade gracefully when JavaScript is disabled or features are unavailable.
 */

(function() {
    'use strict';

    /**
     * Feature 1: Smooth Scroll to Section Anchors
     * Enhances navigation links to smoothly scroll to sections
     */
    function initSmoothScroll() {
        // Feature detection: Check if smooth scroll is supported
        if (!('scrollBehavior' in document.documentElement.style)) {
            // Fallback: Use polyfill for smooth scrolling
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        } else {
            // Native smooth scroll support
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }

    /**
     * Feature 2: Print Button
     * Adds a print button that triggers window.print()
     */
    function initPrintButton() {
        // Feature detection: Check if print is available
        if (!window.print) {
            return; // Graceful degradation: no print button if not supported
        }

        // Create print button
        const printButton = document.createElement('button');
        printButton.textContent = 'Print Resume';
        printButton.className = 'print-button';
        printButton.setAttribute('aria-label', 'Print resume');
        printButton.setAttribute('type', 'button');
        
        // Add click handler
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        // Add keyboard handler for accessibility
        printButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.print();
            }
        });

        // Insert button at the top of the page (after header)
        const header = document.querySelector('header');
        if (header && header.nextElementSibling) {
            header.parentNode.insertBefore(printButton, header.nextElementSibling);
        }
    }

    /**
     * Feature 3: Copy Contact Information to Clipboard
     * Adds copy buttons next to email and phone with feature detection
     */
    function initClipboardFeature() {
        // Feature detection: Check if Clipboard API is available
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            return; // Graceful degradation: no copy buttons if not supported
        }

        // Find email and phone links
        const contactLinks = document.querySelectorAll('address a[href^="mailto:"], address a[href^="tel:"]');
        
        contactLinks.forEach(link => {
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.textContent = '📋';
            copyButton.className = 'copy-button';
            copyButton.setAttribute('type', 'button');
            
            // Determine what we're copying
            const href = link.getAttribute('href');
            let textToCopy = '';
            let label = '';
            
            if (href.startsWith('mailto:')) {
                textToCopy = href.replace('mailto:', '');
                label = 'Copy email address';
            } else if (href.startsWith('tel:')) {
                textToCopy = href.replace('tel:', '');
                label = 'Copy phone number';
            }
            
            copyButton.setAttribute('aria-label', label);
            copyButton.title = label;
            
            // Add click handler
            copyButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        // Visual feedback
                        const originalText = copyButton.textContent;
                        copyButton.textContent = '✓';
                        copyButton.classList.add('copied');
                        
                        // Reset after 2 seconds
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                            copyButton.classList.remove('copied');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        // Fallback: show error feedback
                        copyButton.textContent = '✗';
                        setTimeout(() => {
                            copyButton.textContent = '📋';
                        }, 2000);
                    });
            });
            
            // Add keyboard handler for accessibility
            copyButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    copyButton.click();
                }
            });
            
            // Insert button after the link
            link.parentNode.insertBefore(copyButton, link.nextSibling);
        });
    }

    /**
     * Initialize all enhancements when DOM is ready
     */
    function init() {
        // Check if DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initSmoothScroll();
                initPrintButton();
                initClipboardFeature();
            });
        } else {
            // DOM is already ready
            initSmoothScroll();
            initPrintButton();
            initClipboardFeature();
        }
    }

    // Start initialization
    init();
})();
