const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3333' : window.location.origin;
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    if (authToken && currentUser) {
        showDashboard();
    }
    loadLeaderboard();
});

// Auth Functions
function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
}

function hideAuthForms() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showDashboard() {
    hideAuthForms();
    document.getElementById('nav-buttons').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('username-display').textContent = currentUser?.username || '';
}

async function register(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Registration successful! Please login.', 'success');
            showLogin();
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = { email }; // We'll get username from API later
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showToast('Login successful!', 'success');
            showDashboard();
            loadLeaderboard();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    document.getElementById('nav-buttons').classList.remove('hidden');
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    
    showToast('Logged out successfully', 'success');
    loadLeaderboard();
}

async function recordActivity() {
    if (!authToken) {
        showToast('Please login first', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/streaks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        const messageDiv = document.getElementById('checkin-message');
        const button = document.getElementById('checkin-btn');

        if (response.ok) {
            messageDiv.innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <span class="text-2xl mr-2">🎉</span>
                    Great job! Activity recorded for today!
                </div>
            `;
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.textContent = '✅ Already recorded today!';
            
            showToast('Activity recorded! Keep it up! 🔥', 'success');
            loadLeaderboard();
        } else if (response.status === 409) {
            messageDiv.innerHTML = `
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                    <span class="text-2xl mr-2">⚠️</span>
                    You already recorded your activity today!
                </div>
            `;
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.textContent = '✅ Already recorded today!';
        } else {
            showToast(data.message || 'Failed to record activity', 'error');
        }
        
        messageDiv.classList.remove('hidden');
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_BASE}/streaks/public`);
        const data = await response.json();

        const leaderboard = document.getElementById('leaderboard');
        
        if (data.length === 0) {
            leaderboard.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <span class="text-4xl mb-4 block">📊</span>
                    No data yet. Be the first to start your streak!
                </div>
            `;
            return;
        }

        leaderboard.innerHTML = data.map((user, index) => {
            const isTop3 = index < 3;
            const medals = ['🥇', '🥈', '🥉'];
            const gradients = [
                'from-yellow-400 via-yellow-500 to-amber-500',
                'from-gray-300 via-gray-400 to-gray-500', 
                'from-orange-400 via-orange-500 to-amber-600'
            ];
            const shadows = ['shadow-yellow-200', 'shadow-gray-200', 'shadow-orange-200'];
            
            return `
                <div class="flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    isTop3 
                        ? `bg-gradient-to-r ${gradients[index]} text-white shadow-lg ${shadows[index]}/50 border border-white/20` 
                        : 'bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white shadow-md border border-gray-100'
                }">
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <div class="w-14 h-14 ${isTop3 ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-r from-primary to-secondary'} rounded-2xl flex items-center justify-center font-bold text-lg ${isTop3 ? 'text-white' : 'text-white'} shadow-lg">
                                ${isTop3 ? medals[index] : index + 1}
                            </div>
                            ${isTop3 ? '<div class="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center"><span class="text-xs">✨</span></div>' : ''}
                        </div>
                        <div>
                            <h4 class="font-bold text-lg ${isTop3 ? 'text-white' : 'text-gray-800'}">${user.username}</h4>
                            <p class="text-sm ${isTop3 ? 'text-white/80' : 'text-gray-500'}">Streak Champion</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="text-center">
                            <div class="flex items-center space-x-2">
                                <span class="text-3xl">🔥</span>
                                <span class="font-bold text-2xl ${isTop3 ? 'text-white' : 'text-orange-500'}">${user.current_streak}</span>
                            </div>
                            <p class="text-xs ${isTop3 ? 'text-white/70' : 'text-gray-400'} mt-1">days</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        document.getElementById('leaderboard').innerHTML = `
            <div class="text-center py-8 text-red-500">
                <span class="text-4xl mb-4 block">❌</span>
                Failed to load leaderboard
            </div>
        `;
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const styles = {
        success: 'bg-gradient-to-r from-success to-emerald border-success/20',
        error: 'bg-gradient-to-r from-danger to-rose border-danger/20',
        info: 'bg-gradient-to-r from-primary to-secondary border-primary/20'
    };
    
    const icons = {
        success: '✅',
        error: '❌',
        info: '💬'
    };
    
    toast.innerHTML = `
        <div class="${styles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md transform transition-all duration-500 hover:scale-105">
            <div class="flex items-center space-x-3">
                <span class="text-xl">${icons[type]}</span>
                <span class="font-medium">${message}</span>
            </div>
        </div>
    `;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}