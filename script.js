// ============================================
// MICL Live Inventory Panel - FINAL OPTIMIZED VERSION
// ============================================

const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycby-gPsGojstSyFN0f5E30Ip7HOfQemIS5l4e2WtfpsdQlsVcBNbNcFIIy06-Tq62MVUJQ/exec',
    REFRESH_INTERVAL: 30000,
    STORAGE_KEY: 'miclUser',
    CACHE_KEY: 'miclInventoryCache',
    CACHE_EXPIRY: 5 * 60 * 1000
};

let inventoryData = [];
let filteredData = [];
let currentUser = null;
let refreshTimer = null;
let isLoading = false;
let activeDropdown = null;
let dropdownData = { tower: [], typology: [], facing: [] };

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MICL Live Inventory Panel - Ready');
    checkLoginStatus();
    setupEventListeners();
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
    
    // FORCE hide login screen
    loginScreen.style.display = 'none';
    loginScreen.classList.remove('active');
    
    // FORCE show dashboard screen
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
    
    // Searchable dropdowns
    setupSearchableDropdown('filterTower', 'towerDropdown', 'tower');
    setupSearchableDropdown('filterTypology', 'typologyDropdown', 'typology');
    setupSearchableDropdown('filterFacing', 'facingDropdown', 'facing');
    
    // Regular filters
    document.getElementById('filterAvailability')?.addEventListener('change', applyFilters);
    document.getElementById('searchUnit')?.addEventListener('input', debounce(applyFilters, 300));
    
    // Buttons
    document.getElementById('clearFiltersBtn')?.addEventListener('click', clearFilters);
    document.getElementById('resetFiltersBtn')?.addEventListener('click', clearFilters);
    document.getElementById('exportBtn')?.addEventListener('click', exportToCSV);
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    
    // Close modal on background click
    document.getElementById('propertyModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            closeAllDropdowns();
        }
    });
    
    console.log('✅ Event listeners attached');
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
    
    console.log('🔐 Login attempt:', username);
    
    if (!username || !password) {
        errorEl.textContent = 'Please enter both username and password';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    errorEl.textContent = '';
    
    const url = `${CONFIG.API_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    
    try {
        console.log('📡 Sending login request...');
        const response = await fetch(url);
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        console.log('📦 Login result:', result);
        
        if (result.success) {
            currentUser = {
                username: username,
                role: result.role,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(currentUser));
            console.log('✅ Login successful');
            showDashboard();
        } else {
            errorEl.textContent = result.message || 'Invalid credentials';
            console.log('❌ Login failed:', result.message);
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        errorEl.textContent = 'Login failed: ' + error.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        localStorage.removeItem(CONFIG.CACHE_KEY);
        currentUser = null;
        stopAutoRefresh();
        inventoryData = [];
        filteredData = [];
        
        document.getElementById('loginForm')?.reset();
        const errorEl = document.getElementById('loginError');
        if (errorEl) errorEl.textContent = '';
        
        console.log('👋 Logged out successfully');
        showLogin();
        showToast('Logged out successfully', 'success');
    }
}

// ============================================
// DATA LOADING
// ============================================

async function loadInventoryData(forceRefresh = false) {
    if (isLoading) {
        console.log('⏳ Already loading data...');
        return;
    }
    
    const loadingEl = document.getElementById('loadingIndicator');
    const propertyGrid = document.getElementById('propertyGrid');
    const emptyState = document.getElementById('emptyState');
    const resultsInfo = document.getElementById('resultsInfo');
    
    isLoading = true;
    
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (propertyGrid) propertyGrid.style.display = 'none';
    if (emptyState) emptyState.classList.add('hidden');
    if (resultsInfo) resultsInfo.style.display = 'none';
    
    console.log('📊 Loading inventory data...');
    
    try {
        if (!forceRefresh) {
            const cachedData = getCachedData();
            if (cachedData) {
                console.log('📦 Using cached data');
                inventoryData = cachedData;
                filteredData = [...inventoryData];
                processData();
                if (loadingEl) loadingEl.classList.add('hidden');
                if (propertyGrid) propertyGrid.style.display = 'grid';
                if (resultsInfo) resultsInfo.style.display = 'flex';
                isLoading = false;
                return;
            }
        }
        
        console.log('🌐 Fetching from server...');
        const response = await fetch(`${CONFIG.API_URL}?action=getData&t=${Date.now()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Received data:', data.length, 'properties');
        
        if (Array.isArray(data) && data.length > 0) {
            inventoryData = data;
            filteredData = [...inventoryData];
            cacheData(inventoryData);
            processData();
            console.log(`✅ Loaded ${inventoryData.length} properties`);
            showToast('Data loaded successfully', 'success');
        } else {
            console.warn('⚠️ No data received');
            inventoryData = [];
            filteredData = [];
            showEmptyState();
        }
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        showToast('Failed to load data. Please refresh.', 'error');
        
        const cachedData = getCachedData();
        if (cachedData) {
            console.log('📦 Using cached data as fallback');
            inventoryData = cachedData;
            filteredData = [...inventoryData];
            processData();
        } else {
            showEmptyState();
        }
    } finally {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (propertyGrid) propertyGrid.style.display = 'grid';
        if (resultsInfo) resultsInfo.style.display = 'flex';
        isLoading = false;
        updateLastUpdatedTime();
        startAutoRefresh();
    }
}

function processData() {
    populateDropdownData();
    updateStatistics();
    renderPropertyCards();
    updateResultsCount();
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
    
    // Add "All" option
    const allOption = document.createElement('div');
    allOption.className = 'select-option';
    allOption.textContent = `All ${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}s`;
    allOption.addEventListener('click', function() {
        input.value = '';
        input.dataset.value = '';
        closeAllDropdowns();
        applyFilters();
    });
    dropdown.appendChild(allOption);
    
    // Add data options
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
    
    console.log('📋 Dropdown data populated:', {
        towers: dropdownData.tower.length,
        typologies: dropdownData.typology.length,
        facings: dropdownData.facing.length
    });
}

// ============================================
// FILTERS - OPTIMIZED VERSION
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
    
    // Show loading effect
    const propertyGrid = document.getElementById('propertyGrid');
    if (propertyGrid) propertyGrid.style.opacity = '0.5';
    
    // Use setTimeout for smoother UI update
    setTimeout(() => {
        filteredData = inventoryData.filter(item => {
            const matchTower = !tower || String(item.Tower).trim() === tower;
            const matchTypology = !typology || String(item.Typology).trim() === typology;
            const matchFacing = !facing || String(item.Facing).trim() === facing;
            const matchAvailability = !availability || String(item.Availability).trim() === availability;
            const matchSearch = !searchUnit || String(item['Unit Number']).toLowerCase().includes(searchUnit);
            
            return matchTower && matchTypology && matchFacing && matchAvailability && matchSearch;
        });
        
        console.log(`🔍 Filtered: ${filteredData.length} of ${inventoryData.length} properties`);
        
        updateStatistics();
        renderPropertyCards();
        updateResultsCount();
        
        // Restore opacity
        if (propertyGrid) propertyGrid.style.opacity = '1';
    }, 10);
}

function clearFilters() {
    const towerInput = document.getElementById('filterTower');
    const typologyInput = document.getElementById('filterTypology');
    const facingInput = document.getElementById('filterFacing');
    
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
    
    const availabilitySelect = document.getElementById('filterAvailability');
    const searchInput = document.getElementById('searchUnit');
    
    if (availabilitySelect) availabilitySelect.value = '';
    if (searchInput) searchInput.value = '';
    
    filteredData = [...inventoryData];
    updateStatistics();
    renderPropertyCards();
    updateResultsCount();
    showToast('Filters cleared', 'success');
}

// ============================================
// STATISTICS
// ============================================

function updateStatistics() {
    const total = filteredData.length;
    
    const available = filteredData.filter(item => {
        const status = String(item.Availability || '').trim().toLowerCase();
        return status === 'available' || status === '';
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
    
    console.log(`📊 Stats - Total: ${total}, Available: ${available}, Sold: ${sold}, Blocked: ${blocked}`);
}

function setStatValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============================================
// PROPERTY CARDS RENDERING - FIXED VERSION
// ============================================

function renderPropertyCards() {
    const grid = document.getElementById('propertyGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (filteredData.length === 0) {
        showEmptyState();
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    filteredData.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
    
    console.log(`🎴 Rendered ${filteredData.length} property cards`);
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    
    // Normalize and validate availability status
    let availability = String(property.Availability || '').trim();
    
    // Handle empty or null values - default to Available
    if (!availability || availability === '' || availability === 'null' || availability === 'undefined') {
        availability = 'Available';
    }
    
    const status = availability.toLowerCase();
    const statusClass = status === 'available' ? 'available' :
                       status === 'sold' ? 'sold' : 
                       status === 'blocked' || status === 'block' ? 'blocked' : 
                       'available'; // Default to available
    
    // Display text with proper capitalization
    const displayStatus = availability.charAt(0).toUpperCase() + availability.slice(1).toLowerCase();
    
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
                    <span class="info-label"><i class="fas fa-layer-group"></i> Floor</span>
                    <span class="info-value">${escapeHtml(property['Floor Number']) || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-building"></i> Tower</span>
                    <span class="info-value">${escapeHtml(property.Tower) || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-home"></i> Type</span>
                    <span class="info-value">${escapeHtml(property.Typology) || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-ruler-combined"></i> Area</span>
                    <span class="info-value">${escapeHtml(property['Carpet Area']) || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label"><i class="fas fa-compass"></i> Facing</span>
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
// MODAL
// ============================================

function openPropertyModal(property) {
    const modal = document.getElementById('propertyModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = `Unit ${property['Unit Number']} - Details`;
    
    // Normalize availability for modal display
    let availability = String(property.Availability || '').trim();
    if (!availability) availability = 'Available';
    const displayAvailability = availability.charAt(0).toUpperCase() + availability.slice(1).toLowerCase();
    
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
                <div class="detail-value">${escapeHtml(displayAvailability)}</div>
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
        
        console.log(`📥 Exported ${filteredData.length} records to ${filename}`);
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

function showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const propertyGrid = document.getElementById('propertyGrid');
    
    if (emptyState) emptyState.classList.remove('hidden');
    if (propertyGrid) propertyGrid.style.display = 'none';
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
    console.log(`⏰ Auto-refresh enabled (every ${CONFIG.REFRESH_INTERVAL / 1000}s)`);
    refreshTimer = setInterval(() => {
        console.log('⏰ Auto-refreshing data...');
        loadInventoryData(false);
    }, CONFIG.REFRESH_INTERVAL);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
        console.log('⏰ Auto-refresh disabled');
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

console.log('✅ MICL Live Inventory Panel - Optimized and Ready');
