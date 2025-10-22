// ============================================
// MICL Live Inventory Panel v1.1.15 FIXED
// Floor-Wise Layout | 5 Cards Per Line | Filter Memory | PWA
// ============================================

const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycby-gPsGojstSyFN0f5E30Ip7HOfQemIS5l4e2WtfpsdQlsVcBNbNcFIIy06-Tq62MVUJQ/exec',
    REFRESH_INTERVAL: 30000,
    STORAGE_KEY: 'miclUser',
    CACHE_KEY: 'miclInventoryCache',
    CACHE_EXPIRY: 5 * 60 * 1000,
    PWA_DISMISSED_KEY: 'miclPwaDismissed',
    FILTER_STATE_KEY: 'miclFilterState',
    VERSION: '1.1.15'
};

let inventoryData = [];
let filteredData = [];
let currentUser = null;
let refreshTimer = null;
let isLoading = false;
let activeDropdown = null;
let dropdownData = { tower: [], typology: [], facing: [] };
let deferredPrompt = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log(`🚀 MICL Live Inventory Panel v${CONFIG.VERSION} - Ready`);
    checkLoginStatus();
    setupEventListeners();
    setupPWAPrompt();
});

function checkLoginStatus() {
    const savedUser = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showDashboard();
        } catch (error) {
            console.error('Error parsing saved user:', error);
            showLogin();
        }
    } else {
        showLogin();
    }
}

function showLogin() {
    console.log('Showing login screen');
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    
    if (loginScreen) {
        loginScreen.style.display = 'flex';
        loginScreen.classList.add('active');
    }
    if (dashboardScreen) {
        dashboardScreen.style.display = 'none';
        dashboardScreen.classList.remove('active');
    }
}

function showDashboard() {
    console.log('🎯 Showing dashboard for:', currentUser?.username);
    
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    const userDisplay = document.getElementById('userDisplay');
    
    if (!loginScreen || !dashboardScreen) {
        console.error('❌ Screen elements not found!');
        alert('ERROR: Dashboard elements not found. Check your HTML.');
        return;
    }
    
    loginScreen.style.display = 'none';
    loginScreen.classList.remove('active');
    dashboardScreen.style.display = 'block';
    dashboardScreen.classList.add('active');
    
    if (userDisplay && currentUser) {
        userDisplay.textContent = currentUser.username;
    }
    
    console.log('✅ Dashboard displayed successfully');
    loadInventoryData();
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        loadInventoryData(true);
        showToast('Refreshing data...', 'success');
    });
    
    setupSearchableDropdown('filterTower', 'towerDropdown', 'tower');
    setupSearchableDropdown('filterTypology', 'typologyDropdown', 'typology');
    setupSearchableDropdown('filterFacing', 'facingDropdown', 'facing');
    
    document.getElementById('filterAvailability')?.addEventListener('change', () => {
        applyFilters();
        saveFilterState();
    });
    
    document.getElementById('searchUnit')?.addEventListener('input', debounce(() => {
        applyFilters();
        saveFilterState();
    }, 300));
    
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
    document.getElementById('resetFiltersBtn')?.addEventListener('click', clearFilters);
    document.getElementById('exportBtn')?.addEventListener('click', exportToCSV);
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    
    document.getElementById('propertyModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            closeAllDropdowns();
        }
    });
    
    // PWA Install event listeners
    document.getElementById('installBtn')?.addEventListener('click', handlePWAInstall);
    document.getElementById('dismissInstall')?.addEventListener('click', dismissPWAPrompt);
    document.getElementById('closeIosModal')?.addEventListener('click', () => {
        document.getElementById('iosInstallModal')?.classList.remove('active');
    });
    document.getElementById('iosGotIt')?.addEventListener('click', () => {
        document.getElementById('iosInstallModal')?.classList.remove('active');
        localStorage.setItem(CONFIG.PWA_DISMISSED_KEY, 'true');
    });
    document.getElementById('closeDesktopModal')?.addEventListener('click', () => {
        document.getElementById('desktopInstallModal')?.classList.remove('active');
    });
    document.getElementById('desktopGotIt')?.addEventListener('click', () => {
        document.getElementById('desktopInstallModal')?.classList.remove('active');
        localStorage.setItem(CONFIG.PWA_DISMISSED_KEY, 'true');
    });
    
    console.log('✅ Event listeners attached');
}

// ============================================
// FILTER STATE (localStorage)
// ============================================

function saveFilterState() {
    try {
        const towerInput = document.getElementById('filterTower');
        const typologyInput = document.getElementById('filterTypology');
        const facingInput = document.getElementById('filterFacing');
        const availabilitySelect = document.getElementById('filterAvailability');
        const searchInput = document.getElementById('searchUnit');
        
        const filterState = {
            tower: towerInput?.dataset.value || '',
            typology: typologyInput?.dataset.value || '',
            facing: facingInput?.dataset.value || '',
            availability: availabilitySelect?.value || '',
            searchUnit: searchInput?.value || ''
        };
        localStorage.setItem(CONFIG.FILTER_STATE_KEY, JSON.stringify(filterState));
    } catch (error) {
        console.error('Error saving filter state:', error);
    }
}

function restoreFilterState() {
    try {
        const savedState = localStorage.getItem(CONFIG.FILTER_STATE_KEY);
        if (!savedState) return;
        
        const filterState = JSON.parse(savedState);
        
        if (filterState.tower) {
            const towerInput = document.getElementById('filterTower');
            if (towerInput) {
                towerInput.value = filterState.tower;
                towerInput.dataset.value = filterState.tower;
            }
        }
        
        if (filterState.typology) {
            const typologyInput = document.getElementById('filterTypology');
            if (typologyInput) {
                typologyInput.value = filterState.typology;
                typologyInput.dataset.value = filterState.typology;
            }
        }
        
        if (filterState.facing) {
            const facingInput = document.getElementById('filterFacing');
            if (facingInput) {
                facingInput.value = filterState.facing;
                facingInput.dataset.value = filterState.facing;
            }
        }
        
        if (filterState.availability) {
            const availabilitySelect = document.getElementById('filterAvailability');
            if (availabilitySelect) availabilitySelect.value = filterState.availability;
        }
        
        if (filterState.searchUnit) {
            const searchInput = document.getElementById('searchUnit');
            if (searchInput) searchInput.value = filterState.searchUnit;
        }
        
    } catch (error) {
        console.error('Error restoring filter state:', error);
    }
}

// ============================================
// PWA INSTALL PROMPT
// ============================================

function setupPWAPrompt() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isDismissed = localStorage.getItem(CONFIG.PWA_DISMISSED_KEY) === 'true';
    
    if (isStandalone) {
        console.log('✅ App already installed');
        return;
    }
    
    if (isDismissed) {
        console.log('ℹ️ Install prompt previously dismissed');
        return;
    }
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        if (isAndroid()) {
            setTimeout(() => {
                document.getElementById('installBanner')?.classList.remove('hidden');
            }, 3000);
        }
    });
    
    if (isIOS() && !isStandalone && !isDismissed) {
        setTimeout(() => {
            document.getElementById('iosInstallModal')?.classList.add('active');
        }, 5000);
    }
    
    if (!isMobile() && !isStandalone && !isDismissed) {
        setTimeout(() => {
            if (deferredPrompt) {
                document.getElementById('desktopInstallModal')?.classList.add('active');
            }
        }, 8000);
    }
}

async function handlePWAInstall() {
    if (!deferredPrompt) {
        console.log('No install prompt available');
        return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
        showToast('App installed successfully!', 'success');
        document.getElementById('installBanner')?.classList.add('hidden');
        localStorage.setItem(CONFIG.PWA_DISMISSED_KEY, 'true');
    }
    
    deferredPrompt = null;
}

function dismissPWAPrompt() {
    document.getElementById('installBanner')?.classList.add('hidden');
    localStorage.setItem(CONFIG.PWA_DISMISSED_KEY, 'true');
    showToast('You can install later from browser menu', 'success');
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ============================================
// AUTHENTICATION
// ============================================

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!username || !password) {
        errorEl.textContent = 'Please enter both username and password';
        errorEl.style.display = 'block';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    
    const url = `${CONFIG.API_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = {
                username: username,
                role: result.role,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(currentUser));
            showDashboard();
        } else {
            // CUSTOM ERROR MESSAGE - Hide backend details
            errorEl.textContent = '❌ Invalid username or password. Please try again.';
            errorEl.style.display = 'block';
            console.log('❌ Login failed'); // Don't log the message from backend
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        // GENERIC ERROR - Don't expose backend details
        errorEl.textContent = '⚠️ Unable to connect. Please check your connection and try again.';
        errorEl.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        localStorage.removeItem(CONFIG.CACHE_KEY);
        localStorage.removeItem(CONFIG.FILTER_STATE_KEY);
        currentUser = null;
        stopAutoRefresh();
        inventoryData = [];
        filteredData = [];
        
        document.getElementById('loginForm')?.reset();
        const errorEl = document.getElementById('loginError');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
        
        showLogin();
        showToast('Logged out successfully', 'success');
    }
}

// ============================================
// DATA LOADING
// ============================================

async function loadInventoryData(forceRefresh = false) {
    if (isLoading) return;
    
    const loadingEl = document.getElementById('loadingIndicator');
    const propertyGrid = document.getElementById('propertyGrid');
    const emptyState = document.getElementById('emptyState');
    const resultsInfo = document.getElementById('resultsInfo');
    
    isLoading = true;
    
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (propertyGrid) propertyGrid.style.display = 'none';
    if (emptyState) {
        emptyState.classList.add('hidden');
        emptyState.style.display = 'none';
    }
    if (resultsInfo) resultsInfo.style.display = 'none';
    
    try {
        if (!forceRefresh) {
            const cachedData = getCachedData();
            if (cachedData) {
                inventoryData = cachedData;
                filteredData = [...inventoryData];
                processData();
                if (loadingEl) loadingEl.classList.add('hidden');
                if (propertyGrid) propertyGrid.style.display = 'flex';
                if (resultsInfo) resultsInfo.style.display = 'flex';
                isLoading = false;
                return;
            }
        }
        
        const response = await fetch(`${CONFIG.API_URL}?action=getData&t=${Date.now()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            inventoryData = data;
            filteredData = [...inventoryData];
            cacheData(inventoryData);
            processData();
            if (forceRefresh) showToast('Data refreshed successfully', 'success');
        } else {
            inventoryData = [];
            filteredData = [];
            showEmptyState();
        }
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        if (forceRefresh) showToast('Failed to load data', 'error');
        
        const cachedData = getCachedData();
        if (cachedData) {
            inventoryData = cachedData;
            filteredData = [...inventoryData];
            processData();
        } else {
            showEmptyState();
        }
    } finally {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (propertyGrid) propertyGrid.style.display = 'flex';
        if (resultsInfo) resultsInfo.style.display = 'flex';
        isLoading = false;
        updateLastUpdatedTime();
        startAutoRefresh();
    }
}

function processData() {
    populateDropdownData();
    restoreFilterState();
    applyFilters();
}

function cacheData(data) {
    try {
        const cacheObject = { data: data, timestamp: Date.now() };
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
        console.error('Error caching data:', error);
    }
}

function getCachedData() {
    try {
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        if (!cached) return null;
        
        const cacheObject = JSON.parse(cached);
        const now = Date.now();
        
        if (now - cacheObject.timestamp < CONFIG.CACHE_EXPIRY) {
            return cacheObject.data;
        } else {
            localStorage.removeItem(CONFIG.CACHE_KEY);
            return null;
        }
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

// ============================================
// SEARCHABLE DROPDOWNS
// ============================================

function setupSearchableDropdown(inputId, dropdownId, dataKey) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!input || !dropdown) return;
    
    input.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllDropdowns();
        renderDropdownOptions(dataKey, dropdown, input);
        dropdown.classList.add('active');
        activeDropdown = dropdown;
    });
    
    input.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = dropdownData[dataKey].filter(item => 
            item.toLowerCase().includes(searchTerm)
        );
        renderDropdownOptions(dataKey, dropdown, input, filtered);
        dropdown.classList.add('active');
    });
}

function renderDropdownOptions(dataKey, dropdown, input, customData = null) {
    const data = customData || dropdownData[dataKey];
    
    dropdown.innerHTML = '';
    
    const allOption = document.createElement('div');
    allOption.className = 'select-option';
    allOption.textContent = `All ${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}s`;
    allOption.addEventListener('click', function() {
        input.value = '';
        input.dataset.value = '';
        closeAllDropdowns();
        applyFilters();
        saveFilterState();
    });
    dropdown.appendChild(allOption);
    
    data.forEach(item => {
        const option = document.createElement('div');
        option.className = 'select-option';
        option.textContent = item;
        
        if (input.dataset.value === item) {
            option.classList.add('selected');
        }
        
        option.addEventListener('click', function() {
            input.value = item;
            input.dataset.value = item;
            closeAllDropdowns();
            applyFilters();
            saveFilterState();
        });
        
        dropdown.appendChild(option);
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.select-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    activeDropdown = null;
}

function populateDropdownData() {
    dropdownData.tower = [...new Set(inventoryData.map(item => item.Tower).filter(Boolean))].sort();
    dropdownData.typology = [...new Set(inventoryData.map(item => item.Typology).filter(Boolean))].sort();
    dropdownData.facing = [...new Set(inventoryData.map(item => item.Facing).filter(Boolean))].sort();
}

// ============================================
// FILTERS - FIXED BUG
// ============================================

function applyFilters() {
    const towerInput = document.getElementById('filterTower');
    const typologyInput = document.getElementById('filterTypology');
    const facingInput = document.getElementById('filterFacing');
    const availabilitySelect = document.getElementById('filterAvailability');
    const searchInput = document.getElementById('searchUnit');
    
    const tower = towerInput?.dataset.value || '';
    const typology = typologyInput?.dataset.value || '';
    const facing = facingInput?.dataset.value || '';
    const availability = availabilitySelect?.value || '';
    const searchUnit = searchInput?.value.toLowerCase() || '';
    
    console.log('🔍 Applying filters:', { tower, typology, facing, availability, searchUnit });
    
    filteredData = inventoryData.filter(item => {
        const matchTower = !tower || String(item.Tower).trim() === tower;
        const matchTypology = !typology || String(item.Typology).trim() === typology;
        const matchFacing = !facing || String(item.Facing).trim() === facing;
        const matchAvailability = !availability || String(item.Availability).trim() === availability;
        const matchSearch = !searchUnit || String(item['Unit Number']).toLowerCase().includes(searchUnit);
        
        return matchTower && matchTypology && matchFacing && matchAvailability && matchSearch;
    });
    
    console.log(`✅ Filtered: ${filteredData.length} of ${inventoryData.length} properties`);
    
    updateStatistics();
    renderPropertyCards();
    updateResultsCount();
}

function clearFilters() {
    const towerInput = document.getElementById('filterTower');
    const typologyInput = document.getElementById('filterTypology');
    const facingInput = document.getElementById('filterFacing');
    const availabilitySelect = document.getElementById('filterAvailability');
    const searchInput = document.getElementById('searchUnit');
    
    if (towerInput) {
        towerInput.value = '';
        towerInput.dataset.value = '';
    }
    if (typologyInput) {
        typologyInput.value = '';
        typologyInput.dataset.value = '';
    }
    if (facingInput) {
        facingInput.value = '';
        facingInput.dataset.value = '';
    }
    if (availabilitySelect) availabilitySelect.value = '';
    if (searchInput) searchInput.value = '';
    
    // IMPORTANT: Reset filtered data to ALL inventory
    filteredData = [...inventoryData];
    
    // Hide empty state, show grid
    const emptyState = document.getElementById('emptyState');
    const propertyGrid = document.getElementById('propertyGrid');
    
    if (emptyState) {
        emptyState.classList.add('hidden');
        emptyState.style.display = 'none';
    }
    if (propertyGrid) {
        propertyGrid.style.display = 'flex';
    }
    
    updateStatistics();
    renderPropertyCards();
    updateResultsCount();
    saveFilterState();
    showToast('Filters cleared', 'success');
    
    console.log(`✅ Filters cleared, showing all ${inventoryData.length} properties`);
}

// ============================================
// STATISTICS
// ============================================

function updateStatistics() {
    const total = filteredData.length;
    
    const available = filteredData.filter(item => {
        const status = String(item.Availability || '').trim().toLowerCase();
        return status === 'available';
    }).length;
    
    const sold = filteredData.filter(item => {
        const status = String(item.Availability || '').trim().toLowerCase();
        return status === 'sold';
    }).length;
    
    const blocked = filteredData.filter(item => {
        const status = String(item.Availability || '').trim().toLowerCase();
        return status === 'blocked' || status === 'block';
    }).length;
    
    setStatValue('totalUnits', total);
    setStatValue('availableUnits', available);
    setStatValue('soldUnits', sold);
    setStatValue('blockedUnits', blocked);
}

function setStatValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============================================
// PROPERTY CARDS - FLOOR-WISE (FIXED)
// ============================================

function renderPropertyCards() {
    const grid = document.getElementById('propertyGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Hide empty state FIRST
    if (emptyState) {
        emptyState.classList.add('hidden');
        emptyState.style.display = 'none';
    }
    
    // Show grid
    grid.style.display = 'flex';
    
    if (filteredData.length === 0) {
        showEmptyState();
        return;
    }
    
    // Group by TOWER first, then by FLOOR
    const towerGroups = {};
    
    filteredData.forEach(property => {
        const tower = property.Tower || 'Unknown';
        const floor = property['Floor Number'] || 'Unknown';
        
        if (!towerGroups[tower]) {
            towerGroups[tower] = {};
        }
        if (!towerGroups[tower][floor]) {
            towerGroups[tower][floor] = [];
        }
        towerGroups[tower][floor].push(property);
    });
    
    // Sort towers: Tower A, Tower B, Tower C, Tower D
    const sortedTowers = Object.keys(towerGroups).sort((a, b) => {
        const order = ['Tower A', 'Tower B', 'Tower C', 'Tower D'];
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
    
    // Render each tower
    sortedTowers.forEach(tower => {
        const floorGroups = towerGroups[tower];
        
        // Sort floors within tower (ascending)
        const sortedFloors = Object.keys(floorGroups).sort((a, b) => {
            const floorA = parseInt(a) || 0;
            const floorB = parseInt(b) || 0;
            return floorA - floorB;
        });
        
        // Render each floor within this tower
        sortedFloors.forEach(floor => {
            const properties = floorGroups[floor];
            
            const floorSection = document.createElement('div');
            floorSection.className = 'floor-section';
            
            const floorHeader = document.createElement('div');
            floorHeader.className = 'floor-header';
            floorHeader.innerHTML = `
                <div class="floor-label">
                    <i class="fas fa-building"></i>
                    <span>${tower} - Floor ${floor}</span>
                </div>
                <div class="floor-stats">
                    <span class="floor-count">${properties.length} ${properties.length === 1 ? 'Unit' : 'Units'}</span>
                </div>
            `;
            floorSection.appendChild(floorHeader);
            
            const floorCards = document.createElement('div');
            floorCards.className = 'floor-cards';
            
            properties.sort((a, b) => {
                const unitA = String(a['Unit Number'] || '');
                const unitB = String(b['Unit Number'] || '');
                return unitA.localeCompare(unitB, undefined, { numeric: true });
            });
            
            properties.forEach(property => {
                const card = createPropertyCard(property);
                floorCards.appendChild(card);
            });
            
            floorSection.appendChild(floorCards);
            grid.appendChild(floorSection);
        });
    });
    
    console.log(`✅ Rendered ${filteredData.length} cards organized by tower then floor`);
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    
    let availability = String(property.Availability || '').trim();
    
    if (!availability || availability === '' || availability === 'null' || availability === 'undefined') {
        availability = 'Unknown';
    }
    
    const status = availability.toLowerCase();
    
    const statusClass = status === 'available' ? 'available' :
                       status === 'sold' ? 'sold' : 
                       status === 'blocked' || status === 'block' ? 'blocked' : 
                       'blocked';
    
    const displayStatus = availability;
    
    card.className = `property-card ${statusClass}`;
    card.onclick = () => openPropertyModal(property);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-unit">${escapeHtml(property['Unit Number']) || 'N/A'}</div>
            <span class="card-status">${escapeHtml(displayStatus)}</span>
        </div>
        <div class="card-body">
            <div class="card-info">
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-building"></i>Tower</span>
                    <span class="info-value">${escapeHtml(property.Tower) || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-home"></i>Type</span>
                    <span class="info-value">${escapeHtml(property.Typology) || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-ruler-combined"></i>Area</span>
                    <span class="info-value">${escapeHtml(property['Carpet Area']) || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-compass"></i>Facing</span>
                    <span class="info-value">${escapeHtml(property.Facing) || 'N/A'}</span>
                </div>
            </div>
            <div class="card-price">
                <div class="price-label">All Inclusive Price</div>
                <div class="price-value">${formatCurrency(property['All Inclusive Amount'])}</div>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// EMPTY STATE - FIXED
// ============================================

function showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const propertyGrid = document.getElementById('propertyGrid');
    
    if (emptyState) {
        emptyState.classList.remove('hidden');
        emptyState.style.display = 'block';
    }
    if (propertyGrid) {
        propertyGrid.style.display = 'none';
        propertyGrid.innerHTML = '';
    }
    
    console.log('📭 Showing empty state');
}

// ============================================
// MODAL
// ============================================

function openPropertyModal(property) {
    const modal = document.getElementById('propertyModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = `Unit ${property['Unit Number']} - Details`;
    
    let availability = String(property.Availability || '').trim();
    if (!availability) availability = 'Unknown';
    
    modalBody.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">Unit Number</div>
                <div class="detail-value">${escapeHtml(property['Unit Number']) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Floor</div>
                <div class="detail-value">${escapeHtml(property['Floor Number']) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Tower</div>
                <div class="detail-value">${escapeHtml(property.Tower) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Band</div>
                <div class="detail-value">${escapeHtml(property.Band) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Facing</div>
                <div class="detail-value">${escapeHtml(property.Facing) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Carpet Area</div>
                <div class="detail-value">${escapeHtml(property['Carpet Area']) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Typology</div>
                <div class="detail-value">${escapeHtml(property.Typology) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Series</div>
                <div class="detail-value">${escapeHtml(property.Series) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Base Price</div>
                <div class="detail-value">${formatCurrency(property.Price)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Stamp Duty</div>
                <div class="detail-value">${formatCurrency(property['Stamp Duty'])}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">GST</div>
                <div class="detail-value">${formatCurrency(property.GST)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Registration</div>
                <div class="detail-value">${formatCurrency(property.Registration)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Other Charges</div>
                <div class="detail-value">${formatCurrency(property['Other Charges'])}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Possession</div>
                <div class="detail-value">${formatCurrency(property['Possession Charges'])}</div>
            </div>
            <div class="detail-item" style="grid-column: 1 / -1;">
                <div class="detail-label">All Inclusive Amount</div>
                <div class="detail-value" style="font-size: 24px; color: var(--primary-color);">${formatCurrency(property['All Inclusive Amount'])}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Payment Plan</div>
                <div class="detail-value">${escapeHtml(property['Payment Plan']) || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Availability</div>
                <div class="detail-value">${escapeHtml(availability)}</div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('propertyModal')?.classList.remove('active');
}

// ============================================
// EXPORT CSV
// ============================================

function exportToCSV() {
    if (filteredData.length === 0) {
        showToast('No data to export', 'error');
        return;
    }
    
    try {
        const headers = [
            'Unit Number', 'Floor Number', 'Band', 'Facing', 'Carpet Area', 
            'Typology', 'Price', 'Stamp Duty', 'GST', 'Registration', 
            'Other Charges', 'Possession Charges', 'All Inclusive Amount', 
            'Tower', 'Payment Plan', 'Series', 'Availability'
        ];
        
        let csvContent = '\uFEFF';
        csvContent += headers.join(',') + '\n';
        
        filteredData.forEach(item => {
            const row = headers.map(header => {
                let value = item[header] || '';
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""');
                    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                        value = `"${value}"`;
                    }
                }
                return value;
            });
            csvContent += row.join(',') + '\n';
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `MICL_Inventory_${timestamp}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Data exported successfully', 'success');
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showToast('Failed to export data', 'error');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(value) {
    if (!value || value === 0 || value === '0') return '-';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
    if (isNaN(numValue)) return '-';
    return '₹ ' + numValue.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const el = document.getElementById('lastUpdated');
    if (el) el.textContent = `Last Updated: ${timeString}`;
}

function updateResultsCount() {
    const el = document.getElementById('resultsCount');
    if (el && inventoryData.length > 0) {
        el.textContent = `Showing ${filteredData.length} of ${inventoryData.length} properties`;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(() => {
        loadInventoryData(false);
    }, CONFIG.REFRESH_INTERVAL);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

console.log(`✅ MICL Live Inventory Panel v${CONFIG.VERSION} - Loaded & Fixed`);
