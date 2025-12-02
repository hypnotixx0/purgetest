// force-loading-complete.js - Forces loading screen to finish
(function() {
    'use strict';
    
    console.log('⚡ Loading screen force-complete initialized');
    
    // Function to hide loading screen
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            console.log('✅ Hiding loading screen');
            
            // Add fade-out class
            loadingScreen.classList.add('fade-out');
            
            // Remove after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('🚀 Loading screen removed');
            }, 600);
        }
    }
    
    // Strategy 1: Hide when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 DOM ready, hiding loading screen');
            setTimeout(hideLoadingScreen, 300);
        });
    } else {
        // DOM already ready
        console.log('📄 DOM already ready');
        setTimeout(hideLoadingScreen, 300);
    }
    
    // Strategy 2: Hide when window loads
    window.addEventListener('load', function() {
        console.log('🌐 Window loaded, ensuring loading screen hidden');
        hideLoadingScreen();
    });
    
    // Strategy 3: Safety timeout - always hide after 3 seconds max
    setTimeout(function() {
        console.log('⏰ 3-second timeout, forcing loading screen hidden');
        hideLoadingScreen();
    }, 3000);
    
    // Make function globally available
    window.forceHideLoading = hideLoadingScreen;
    
})();