// page-validator.js - For protected pages
(function() {
    'use strict';
    
    console.log('🔒 Page validator checking...');
    
    // Configuration
    const SESSION_KEYS = {
        AUTH: 'purge_auth',
        LEVEL: 'purge_auth_level',
        TIMESTAMP: 'purge_auth_timestamp',
        KEY: 'purge_auth_key',
        HASH: 'purge_auth_hash'
    };
    
    // Valid keys
    const FREE_KEY = 'IMPOOR';
    const PREMIUM_KEYS = ['CHARLESISPOOR', 'UNHIIN', 'SOSAPARTY'];
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log('📄 Current page:', currentPage);
    
    // Don't validate on index.html
    if (currentPage === 'index.html' || currentPage === '') {
        console.log('✅ On index page - skipping validation');
        return;
    }
    
    // Validate session
    function validateSession() {
        try {
            console.log('🔍 Validating session...');
            
            // Get session data
            const auth = sessionStorage.getItem(SESSION_KEYS.AUTH);
            const level = sessionStorage.getItem(SESSION_KEYS.LEVEL);
            const timestamp = sessionStorage.getItem(SESSION_KEYS.TIMESTAMP);
            const key = sessionStorage.getItem(SESSION_KEYS.KEY);
            const hash = sessionStorage.getItem(SESSION_KEYS.HASH);
            
            // Check 1: All data exists
            if (!auth || auth !== 'authenticated' || !level || !timestamp || !key || !hash) {
                console.log('❌ Missing session data');
                return false;
            }
            
            // Check 2: Session not expired (30 minutes)
            const sessionTime = parseInt(timestamp);
            const now = Date.now();
            if (isNaN(sessionTime) || (now - sessionTime) > (30 * 60 * 1000)) {
                console.log('❌ Session expired');
                return false;
            }
            
            // Check 3: Valid key
            const keyUpper = key.toUpperCase();
            const isValidFree = keyUpper === FREE_KEY;
            const isValidPremium = PREMIUM_KEYS.includes(keyUpper);
            
            if (level === 'free' && !isValidFree) {
                console.log('❌ Invalid free key');
                return false;
            }
            
            if (level === 'premium' && !isValidPremium) {
                console.log('❌ Invalid premium key');
                return false;
            }
            
            // Check 4: Page permissions
            const premiumPages = [
                'games.html', 'apps.html', 'tools.html', 'roadmap.html',
                'themes.html', 'chat.html', 'credits.html', 'settings.html',
                'admin.html'
            ];
            
            const freePages = ['games.html'];
            
            if (level === 'free' && !freePages.includes(currentPage)) {
                console.log('❌ Free user cannot access:', currentPage);
                return false;
            }
            
            if (level === 'premium' && !premiumPages.includes(currentPage)) {
                console.log('❌ Premium user cannot access:', currentPage);
                return false;
            }
            
            // SUCCESS
            console.log('✅ Session valid! Level:', level);
            console.log('🔑 Key:', keyUpper);
            console.log('📄 Page:', currentPage);
            
            return true;
            
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }
    
    // Redirect to blocked page
    function redirectToBlocked() {
        console.log('🚫 Redirecting to blocked.html');
        
        // Clear session
        sessionStorage.clear();
        
        // Redirect
        window.location.replace('blocked.html');
    }
    
    // Check validation
    if (!validateSession()) {
        redirectToBlocked();
    } else {
        console.log('🎉 Access granted!');
    }
    
})();