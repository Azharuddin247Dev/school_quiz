// Diagnostic script for online users feature
console.log('=== Online Users Feature Diagnostic ===');

// Check if required functions exist
const requiredFunctions = [
    'updateUserOnlineStatus',
    'showOnlineUsers'
];

requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName} function exists`);
    } else {
        console.log(`❌ ${funcName} function missing`);
    }
});

// Check if Firebase is loaded
if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase loaded');
    if (typeof database !== 'undefined') {
        console.log('✅ Firebase database loaded');
    } else {
        console.log('❌ Firebase database not loaded');
    }
} else {
    console.log('❌ Firebase not loaded');
}

// Check if user is authenticated
if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
    console.log('✅ User is authenticated');
    if (typeof currentUser !== 'undefined' && currentUser) {
        console.log(`✅ Current user: ${currentUser.email}`);
    } else {
        console.log('❌ Current user object missing');
    }
} else {
    console.log('❌ User not authenticated');
}

// Check if online users button exists
const onlineButton = document.querySelector('.online-users-btn');
if (onlineButton) {
    console.log('✅ Online users button found in DOM');
    console.log('Button onclick:', onlineButton.getAttribute('onclick'));
} else {
    console.log('❌ Online users button not found in DOM');
}

// Test online users functionality if authenticated
if (typeof isAuthenticated !== 'undefined' && isAuthenticated && typeof updateUserOnlineStatus === 'function') {
    console.log('🔄 Testing online status update...');
    updateUserOnlineStatus(true).then(() => {
        console.log('✅ Online status update successful');
    }).catch(error => {
        console.log('❌ Online status update failed:', error);
    });
}

console.log('=== Diagnostic Complete ===');