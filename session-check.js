// session-check.js - Protects category links
(function() {
    'use strict';
    
    console.log('🔗 Session check for category links');
    
    // Check if session is valid
    function isValidSession() {
        try {
            const auth = sessionStorage.getItem('purge_auth');
            const level = sessionStorage.getItem('purge_auth_level');
            const timestamp = sessionStorage.getItem('purge_auth_timestamp');
            const key = sessionStorage.getItem('purge_auth_key');
            const hash = sessionStorage.getItem('purge_auth_hash');
            
            // All must exist
            if (!auth || auth !== "authenticated" || !level || !timestamp || !key || !hash) {
                return false;
            }
            
            // Check timestamp (30 minute session)
            const sessionTime = parseInt(timestamp);
            const now = Date.now();
            if (isNaN(sessionTime) || (now - sessionTime) > (30 * 60 * 1000)) {
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('Session check error:', e);
            return false;
        }
    }
    
    // Show auth overlay again
    function showAuthOverlay() {
        const overlay = document.getElementById('purge-auth-overlay');
        if (overlay) {
            console.log('🔐 Showing auth overlay (session lost)');
            overlay.style.display = 'block';
            overlay.classList.add('active');
            overlay.classList.remove('fade-out');
            
            // Scroll to key input
            const authContainer = overlay.querySelector('.auth-container');
            if (authContainer) {
                authContainer.classList.add('scrolled');
            }
            
            // Focus on input
            const keyInput = document.getElementById('auth-key-input');
            if (keyInput) {
                setTimeout(() => keyInput.focus(), 300);
            }
        }
    }
    
    // Protect category links
    function protectCategoryLinks() {
        const categoryLinks = document.querySelectorAll('.category-box');
        
        categoryLinks.forEach(link => {
            // Remove any existing click handlers
            link.onclick = null;
            
            // Add new click handler
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Don't block index.html or external links
                if (!href || href === 'index.html' || href.includes('http')) {
                    return true;
                }
                
                console.log('🔍 Checking session for:', href);
                
                // Check session
                if (!isValidSession()) {
                    console.log('❌ Invalid session, preventing navigation');
                    e.preventDefault();
                    
                    // Show auth overlay
                    showAuthOverlay();
                    
                    // Show error message
                    const authStatus = document.getElementById('auth-status');
                    if (authStatus) {
                        authStatus.className = 'auth-status error show';
                        authStatus.textContent = '❌ Session lost. Please re-enter key.';
                    }
                    
                    return false;
                }
                
                console.log('✅ Session valid, allowing navigation to', href);
                return true;
            });
        });
        
        console.log('✅ Category links protected');
    }
    
    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectCategoryLinks);
    } else {
        protectCategoryLinks();
    }
    
    // Make function globally available
    window.protectLinks = protectCategoryLinks;
    
})();