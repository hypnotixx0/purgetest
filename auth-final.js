// auth-final.js - WORKING AUTH WITH MODAL FIX
(function() {
    'use strict';
    
    console.log('🎬 Auth system v3.0 - FINAL');
    
    // KEYS - WORKING
    const FREE_KEYS = ['IMPOOR'];
    const PREMIUM_KEYS = ['CHARLESISPOOR', 'UNHIIN', 'SOSAPARTY'];
    
    // Session storage
    const SESSION = {
        AUTH: 'purge_auth',
        LEVEL: 'purge_auth_level',
        TIMESTAMP: 'purge_auth_timestamp',
        KEY: 'purge_auth_key',
        HASH: 'purge_auth_hash'
    };
    
    // Initialize
    document.addEventListener('DOMContentLoaded', init);
    
    function init() {
        console.log('🔐 Initializing auth...');
        
        const overlay = document.getElementById('purge-auth-overlay');
        if (!overlay) {
            console.error('❌ Auth overlay missing');
            return;
        }
        
        // Check existing session
        if (checkSession()) {
            console.log('✅ Already authenticated');
            overlay.style.display = 'none';
            unlockSite();
            return;
        }
        
        // Show auth overlay
        console.log('🔒 Showing auth overlay');
        overlay.style.display = 'block';
        setTimeout(() => overlay.classList.add('active'), 100);
        
        // Setup auth UI
        setupAuthUI();
    }
    
    function checkSession() {
        try {
            const auth = sessionStorage.getItem(SESSION.AUTH);
            const level = sessionStorage.getItem(SESSION.LEVEL);
            const timestamp = sessionStorage.getItem(SESSION.TIMESTAMP);
            
            if (!auth || auth !== 'authenticated' || !level || !timestamp) {
                return false;
            }
            
            // Check expiration (30 minutes)
            const sessionTime = parseInt(timestamp);
            const now = Date.now();
            if (isNaN(sessionTime) || (now - sessionTime) > (30 * 60 * 1000)) {
                sessionStorage.clear();
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('Session check error:', e);
            return false;
        }
    }
    
    function setupAuthUI() {
        const overlay = document.getElementById('purge-auth-overlay');
        const container = overlay.querySelector('.auth-container');
        const keyInput = document.getElementById('auth-key-input');
        const showKeyBtn = document.getElementById('auth-show-key');
        const submitBtn = document.getElementById('auth-submit');
        
        // Auto-scroll
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
            
            console.log('🔑 Validating:', key);
            
            // Show loading
            submitBtn.classList.add('loading');
            const authStatus = document.getElementById('auth-status');
            if (authStatus) {
                authStatus.className = 'auth-status';
                authStatus.textContent = '';
            }
            
            // Validate
            setTimeout(() => {
                let level = null;
                
                if (PREMIUM_KEYS.includes(key)) {
                    level = 'premium';
                } else if (FREE_KEYS.includes(key)) {
                    level = 'free';
                }
                
                if (level) {
                    saveSession(key, level);
                } else {
                    showError('Invalid key. Free: IMPOOR (Games only)');
                    submitBtn.classList.remove('loading');
                }
            }, 300);
        }
        
        // Event listeners
        if (submitBtn) {
            submitBtn.addEventListener('click', validateKey);
        }
        
        if (keyInput) {
            keyInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') validateKey();
            });
        }
    }
    
    function saveSession(key, level) {
        console.log(`✅ Saving ${level} session for: ${key}`);
        
        // Create session data
        const timestamp = Date.now().toString();
        const hash = createHash(key, level, timestamp);
        
        // Save to storage
        sessionStorage.setItem(SESSION.AUTH, 'authenticated');
        sessionStorage.setItem(SESSION.LEVEL, level);
        sessionStorage.setItem(SESSION.TIMESTAMP, timestamp);
        sessionStorage.setItem(SESSION.KEY, key);
        sessionStorage.setItem(SESSION.HASH, hash);
        
        // Update UI
        const authStatus = document.getElementById('auth-status');
        const submitBtn = document.getElementById('auth-submit');
        const overlay = document.getElementById('purge-auth-overlay');
        
        if (authStatus) {
            authStatus.className = 'auth-status success show';
            authStatus.textContent = `✅ ${level === 'premium' ? 'Premium' : 'Free'} access granted!`;
        }
        
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('auth-success');
        }
        
        // Hide overlay and unlock site
        setTimeout(() => {
            if (overlay) {
                overlay.classList.add('fade-out');
                
                setTimeout(() => {
                    overlay.style.display = 'none';
                    console.log('🎉 Auth complete, unlocking site...');
                    
                    // Unlock everything
                    unlockSite();
                    
                    // Show announcement modal - FIXED
                    setTimeout(showAnnouncementModal, 800);
                    
                }, 800);
            }
        }, 1200);
    }
    
    function createHash(key, level, timestamp) {
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
    
    function unlockSite() {
        console.log('🔓 Unlocking site...');
        
        const level = sessionStorage.getItem(SESSION.LEVEL);
        const key = sessionStorage.getItem(SESSION.KEY);
        
        if (!level || !key) {
            console.log('❌ No session to unlock');
            return;
        }
        
        console.log(`👤 User: ${level}, Key: ${key}`);
        
        // Unlock category boxes with animation
        const boxes = document.querySelectorAll('.category-box');
        boxes.forEach((box, index) => {
            setTimeout(() => {
                box.classList.add('unlocked');
                console.log(`✨ Unlocked: ${box.querySelector('h3').textContent}`);
            }, index * 100);
        });
        
        // Free user restrictions
        if (level === 'free') {
            const nonGameBoxes = document.querySelectorAll('.category-box:not([href*="games"])');
            nonGameBoxes.forEach(box => {
                box.style.opacity = '0.5';
                box.style.pointerEvents = 'none';
                box.title = 'Free users can only access Games';
                console.log(`🔒 Restricted: ${box.querySelector('h3').textContent}`);
            });
        }
    }
    
    function showAnnouncementModal() {
        console.log('📢 Showing announcement modal...');
        const modal = document.getElementById('announcement-modal');
        
        if (modal) {
            modal.classList.add('active');
            console.log('✅ Announcement modal shown');
            
            // Add close handler
            const closeBtn = document.getElementById('announcement-ok-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.classList.remove('active');
                    console.log('✅ Announcement modal closed');
                });
            }
        } else {
            console.log('❌ Announcement modal not found');
        }
    }
    
    function showError(message) {
        console.log('❌ Error:', message);
        
        const authStatus = document.getElementById('auth-status');
        if (authStatus) {
            authStatus.className = 'auth-status error show';
            authStatus.textContent = `❌ ${message}`;
        }
        
        const submitBtn = document.getElementById('auth-submit');
        if (submitBtn) submitBtn.classList.remove('loading');
        
        // Shake animation
        const keyInput = document.getElementById('auth-key-input');
        if (keyInput) {
            keyInput.style.animation = 'none';
            setTimeout(() => {
                keyInput.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
        }
    }
    
    // Debug functions
    window.checkAuth = function() {
        console.log('🔍 Session:');
        console.log('- Auth:', sessionStorage.getItem(SESSION.AUTH));
        console.log('- Level:', sessionStorage.getItem(SESSION.LEVEL));
        console.log('- Key:', sessionStorage.getItem(SESSION.KEY));
        console.log('- Time:', sessionStorage.getItem(SESSION.TIMESTAMP));
        
        const level = sessionStorage.getItem(SESSION.LEVEL);
        const key = sessionStorage.getItem(SESSION.KEY);
        if (level && key) {
            console.log(`👤 ${level.toUpperCase()} user (${key})`);
        }
    };
    
    window.clearAuth = function() {
        sessionStorage.clear();
        console.log('🗑️ Session cleared');
        
        // Reset UI
        document.querySelectorAll('.category-box').forEach(box => {
            box.classList.remove('unlocked');
            box.style.opacity = '';
            box.style.pointerEvents = '';
            box.title = '';
        });
        
        // Show auth overlay again
        const overlay = document.getElementById('purge-auth-overlay');
        if (overlay) {
            overlay.style.display = 'block';
            overlay.classList.add('active');
            overlay.classList.remove('fade-out');
        }
    };
    
    // Test functions
    window.testKey = function(key) {
        const input = document.getElementById('auth-key-input');
        if (input) {
            input.value = key;
            console.log(`🔑 Testing: ${key}`);
        }
    };
    
})();