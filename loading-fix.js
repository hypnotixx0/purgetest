// loading-fix.js - Guarantees loading screen finishes
(function() {
    'use strict';
    
    console.log('⚡ Loading fix initialized');
    
    function hideLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            console.log('✅ Hiding loading screen');
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 600);
        }
    }
    
    // Hide after 1 second max
    setTimeout(hideLoadingScreen, 1000);
    
    // Also hide when page loads
    window.addEventListener('load', hideLoadingScreen);
    
    // And hide when DOM ready
    document.addEventListener('DOMContentLoaded', hideLoadingScreen);
    
})();