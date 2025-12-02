// page-validator-final.js - SIMPLE & WORKING
(function() {
    'use strict';
    
    console.log('🔒 Page validator v2.0');
    
    // KEYS
    const FREE_KEYS = ['IMPOOR'];
    const PREMIUM_KEYS = ['CHARLESISPOOR', 'UNHIIN', 'SOSAPARTY'];
    
    // Current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log('📄 Page:', currentPage);
    
    // Skip validation on index/blocked pages
    if (currentPage === 'index.html' || currentPage === 'blocked.html' || currentPage === '') {
        console.log('✅ Public page - skipping');
        return;
    }
    
    // Validate on load
    window.addEventListener('load', validate);
    
    function validate() {
        console.log('🔍 Validating access...');
        
        try {
            // Get session
            const auth = sessionStorage.getItem('purge_auth');
            const level = sessionStorage.getItem('purge_auth_level');
            const timestamp = sessionStorage.getItem('purge_auth_timestamp');
            const key = sessionStorage.getItem('purge_auth_key');
            
            console.log('Session:', { auth, level, hasKey: !!key });
            
            // Check 1: Basic session
            if (!auth || auth !== 'authenticated' || !level || !timestamp || !key) {
                console.log('❌ No valid session');
                redirect();
                return;
            }
            
            // Check 2: Session age
            const sessionTime = parseInt(timestamp);
            const now = Date.now();
            if (isNaN(sessionTime) || (now - sessionTime) > (30 * 60 * 1000)) {
                console.log('❌ Session expired');
                redirect();
                return;
            }
            
            // Check 3: Valid key
            const keyUpper = key.toUpperCase();
            const isValidFree = FREE_KEYS.includes(keyUpper);
            const isValidPremium = PREMIUM_KEYS.includes(keyUpper);
            
            if (level === 'free' && !isValidFree) {
                console.log('❌ Invalid free key');
                redirect();
                return;
            }
            
            if (level === 'premium' && !isValidPremium) {
                console.log('❌ Invalid premium key');
                redirect();
                return;
            }
            
            // Check 4: Page permissions
            const premiumPages = [
                'games.html', 'apps.html', 'tools.html', 'roadmap.html',
                'themes.html', 'chat.html', 'credits.html', 'settings.html'
            ];
            
            const freePages = ['games.html'];
            
            if (level === 'free' && !freePages.includes(currentPage)) {
                console.log('❌ Free user cannot access:', currentPage);
                redirect();
                return;
            }
            
            if (level === 'premium' && !premiumPages.includes(currentPage)) {
                console.log('❌ Premium user cannot access:', currentPage);
                redirect();
                return;
            }
            
            // SUCCESS
            console.log('✅ Access granted!');
            console.log('👤 Level:', level);
            console.log('🔑 Key:', keyUpper);
            
        } catch (error) {
            console.error('Validation error:', error);
            redirect();
        }
    }
    
    function redirect() {
        console.log('🚫 Redirecting to blocked.html');
        sessionStorage.clear();
        window.location.replace('blocked.html');
    }
    
})();