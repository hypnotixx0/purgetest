// auth-system.js - Simple all-in-one authentication
(function() {
    'use strict';
    
    console.log('🔐 Auth system v2.0');
    
    // Your keys (keep private)
    const FREE_KEY = 'IMPOOR';
    const PREMIUM_KEYS = ['CHARLESISPOOR', 'UNHIIN', 'SOSAPARTY'];
    
    // Session storage keys
    const SESSION_KEYS = {
        AUTH: 'purge_auth',
        LEVEL: 'purge_auth_level',
        TIMESTAMP: 'purge_auth_timestamp',
        KEY: 'purge_auth_key',
        HASH: 'purge_auth_hash'
    };
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initAuthSystem, 100);
    });
    
    function initAuthSystem() {
        console.log('🎬 Initializing auth system');
        
        const overlay = document.getElementById('purge-auth-overlay');
        if (!overlay) {
            console.error('❌ Auth overlay not found');
            return;
        }
        
        // Check if already authenticated
        if (checkExistingSession()) {
            console.log('✅ Already authenticated');
            overlay.style.display = 'none';
            return;
        }
        
        // Show auth overlay
        console.log('🔐 Showing auth overlay');
        overlay.style.display = 'block';
        setTimeout(() => overlay.classList.add('active'), 50);
        
        // Setup auth experience
        setupAuthExperience();
    }
    
    function checkExistingSession() {
        try {
            const auth = sessionStorage.getItem(SESSION_KEYS.AUTH);
            const level = sessionStorage.getItem(SESSION_KEYS.LEVEL);
            const timestamp = sessionStorage.getItem(SESSION_KEYS.TIMESTAMP);
            
            if (auth !== 'authenticated' || !level || !timestamp) {
                return false;
            }
            
            // Check if session is less than 30 minutes old
            const sessionTime = parseInt(timestamp);
            const now = Date.now();
            const sessionAge = now - sessionTime;
            
            if (sessionAge > (30 * 60 * 1000)) {
                console.log('❌ Session expired');
                sessionStorage.clear();
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('Session check error:', e);
            return false;
        }
    }
    
    function setupAuthExperience() {
        const overlay = document.getElementById('purge-auth-overlay');
        const container = overlay.querySelector('.auth-container');
        const keyInput = document.getElementById('auth-key-input');
        const showKeyBtn = document.getElementById('auth-show-key');
        const submitBtn = document.getElementById('auth-submit');
        const authStatus = document.getElementById('auth-status');
        
        // Auto-scroll after 2 seconds
        setTimeout(() => {
            if (container) container.classList.add('scrolled');
        }, 2000);
        
        // Show/hide password
        if (showKeyBtn && keyInput) {
            showKeyBtn.addEventListener('click', function() {
                keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
                showKeyBtn.innerHTML = keyInput.type === 'password' 
                    ? '<i class="fas fa-eye"></i>' 
                    : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Validate key
        function validateKey() {
            const key = keyInput.value.trim().toUpperCase();
            
            if (!key) {
                showError('Please enter a key');
                return;
            }
            
            // Show loading
            submitBtn.classList.add('loading');
            authStatus.className = 'auth-status';
            authStatus.textContent = '';
            
            // Check key
            setTimeout(() => {
                let userLevel = null;
                
                if (PREMIUM_KEYS.includes(key)) {
                    userLevel = 'premium';
                } else if (key === FREE_KEY) {
                    userLevel = 'free';
                }
                
                if (userLevel) {
                    createSession(key, userLevel);
                } else {
                    showError('Invalid key. Free key: IMPOOR (Games only)');
                    submitBtn.classList.remove('loading');
                }
            }, 300);
        }
        
        // Submit handlers
        if (submitBtn) {
            submitBtn.addEventListener('click', validateKey);
        }
        
        if (keyInput) {
            keyInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') validateKey();
            });
        }
    }
    
    function createSession(key, level) {
        console.log(`✅ Creating session: ${level} (${key})`);
        
        // Generate session data
        const timestamp = Date.now().toString();
        const hash = generateHash(key, level, timestamp);
        
        // Save to sessionStorage
        sessionStorage.setItem(SESSION_KEYS.AUTH, 'authenticated');
        sessionStorage.setItem(SESSION_KEYS.LEVEL, level);
        sessionStorage.setItem(SESSION_KEYS.TIMESTAMP, timestamp);
        sessionStorage.setItem(SESSION_KEYS.KEY, key);
        sessionStorage.setItem(SESSION_KEYS.HASH, hash);
        
        console.log('💾 Session saved');
        
        // Show success and hide overlay
        const authStatus = document.getElementById('auth-status');
        const submitBtn = document.getElementById('auth-submit');
        const overlay = document.getElementById('purge-auth-overlay');
        
        if (authStatus) {
            authStatus.className = 'auth-status success show';
            authStatus.textContent = `✅ ${level === 'premium' ? 'Premium' : 'Free'} access granted!`;
        }
        
        if (submitBtn) {
            submitBtn.classList.remove('loading');
        }
        
        // Hide overlay after delay
        setTimeout(() => {
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    console.log('🎉 Auth complete!');
                    
                    // Show announcement
                    const announcement = document.getElementById('announcement-modal');
                    if (announcement) {
                        setTimeout(() => announcement.classList.add('active'), 500);
                    }
                }, 800);
            }
        }, 1000);
    }
    
    function generateHash(key, level, timestamp) {
        const salt = 'purge_secret_2025';
        const data = `${key}_${level}_${timestamp}_${salt}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    
    function showError(message) {
        const authStatus = document.getElementById('auth-status');
        if (authStatus) {
            authStatus.className = 'auth-status error show';
            authStatus.textContent = `❌ ${message}`;
        }
        
        const submitBtn = document.getElementById('auth-submit');
        if (submitBtn) submitBtn.classList.remove('loading');
    }
    
    // Global functions for debugging
    window.checkAuth = function() {
        console.log('🔍 Current session:', {
            auth: sessionStorage.getItem(SESSION_KEYS.AUTH),
            level: sessionStorage.getItem(SESSION_KEYS.LEVEL),
            key: sessionStorage.getItem(SESSION_KEYS.KEY),
            timestamp: sessionStorage.getItem(SESSION_KEYS.TIMESTAMP),
            hash: sessionStorage.getItem(SESSION_KEYS.HASH)
        });
    };
    
    window.clearAuth = function() {
        sessionStorage.clear();
        console.log('🗑️ Session cleared');
        location.reload();
    };
    
})();