// Global variables
let currentProperty = null;
let suggestionIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showEmptyState();
});

// Setup event listeners
function setupEventListeners() {
    const flatNumberInput = document.getElementById('flatNumber');
    const suggestionsDiv = document.getElementById('suggestions');
    
    // Input event for real-time lookup
    flatNumberInput.addEventListener('input', function() {
        lookupProperty();
        showSuggestions(this.value);
    });
    
    // Keyboard navigation for suggestions
    flatNumberInput.addEventListener('keydown', function(e) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            suggestionIndex = Math.min(suggestionIndex + 1, suggestions.length - 1);
            highlightSuggestion();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            suggestionIndex = Math.max(suggestionIndex - 1, -1);
            highlightSuggestion();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (suggestionIndex >= 0 && suggestions[suggestionIndex]) {
                selectSuggestion(suggestions[suggestionIndex].dataset.unit);
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.input-wrapper')) {
            hideSuggestions();
        }
    });
    
    // Window controls
    document.querySelector('.minimize-btn').addEventListener('click', function() {
        document.body.style.display = 'none';
        setTimeout(() => document.body.style.display = 'block', 1000);
    });
    
    document.querySelector('.close-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to close the application?')) {
            window.close();
        }
    });
}

// Main property lookup function
function lookupProperty() {
    const flatNumber = document.getElementById('flatNumber').value.trim().toUpperCase();
    
    if (!flatNumber) {
        clearAllFields();
        showEmptyState();
        return;
    }
    
    const property = inventoryData[flatNumber];
    
    if (property) {
        currentProperty = property;
        populateFields(property);
        showPaymentPlan(property);
        hideEmptyState();
        hideSuggestions();
    } else {
        clearAllFields();
        showErrorState(flatNumber);
    }
}

// Populate all form fields
function populateFields(property) {
    document.getElementById('band').value = property.band;
    document.getElementById('facing').value = property.facing;
    document.getElementById('carpet').value = property.carpetArea;
    document.getElementById('typology').value = property.typology;
    
    // Format currency values
    document.getElementById('agreementValue').value = formatCurrency(property.price);
    document.getElementById('stampDuty').value = formatCurrency(property.stampDuty);
    document.getElementById('gst').value = formatCurrency(property.gst);
    document.getElementById('regAmt').value = formatCurrency(property.registration);
    document.getElementById('otherCharges').value = formatCurrency(property.otherCharges);
    document.getElementById('allInclusive').value = formatCurrency(property.allInclusiveAmount);
    document.getElementById('possessionCharges').value = formatCurrency(property.possessionCharges);
    document.getElementById('tower').value = property.tower;
    
    // Update tower input color
    const towerInput = document.getElementById('tower');
    const towerColor = towerColors[property.tower] || '#4a90e2';
    towerInput.style.background = towerColor;
    
    // Add fade-in animation to fields
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.add('fade-in');
    });
}

// Show payment plan breakdown
function showPaymentPlan(property) {
    const paymentSection = document.getElementById('paymentSection');
    const paymentPlanTitle = document.getElementById('paymentPlanTitle');
    const towerName = document.getElementById('towerName');
    const paymentBreakdown = document.getElementById('paymentBreakdown');
    
    const plan = paymentPlans[property.paymentPlan];
    if (!plan) return;
    
    // Update title and tower
    paymentPlanTitle.textContent = `Payment Plan Breakup ${plan.name}`;
    towerName.textContent = property.tower;
    
    // Update tower name color
    const towerColor = towerColors[property.tower] || '#4a90e2';
    towerName.style.background = towerColor;
    
    // Generate payment breakdown
    paymentBreakdown.innerHTML = '';
    
    plan.stages.forEach(stage => {
        const amount = Math.round(property.price * stage.percentage / 100);
        const row = document.createElement('div');
        row.className = 'payment-row';
        row.innerHTML = `
            <div class="percentage">${stage.percentage}%</div>
            <div class="amount">₹ ${formatNumber(amount)}</div>
            <div class="milestone">${stage.stage}</div>
        `;
        paymentBreakdown.appendChild(row);
    });
    
    paymentSection.style.display = 'block';
    paymentSection.classList.add('fade-in');
}

// Show suggestions dropdown
function showSuggestions(query) {
    const suggestionsDiv = document.getElementById('suggestions');
    
    if (!query || query.length < 1) {
        hideSuggestions();
        return;
    }
    
    const matches = searchUnits(query);
    
    if (matches.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    
    matches.forEach((unitNumber, index) => {
        const property = inventoryData[unitNumber];
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.dataset.unit = unitNumber;
        div.innerHTML = `
            <div class="unit-number">${unitNumber}</div>
            <div class="unit-details">${property.tower} Tower • ${property.typology} • ${property.carpetArea}</div>
        `;
        
        div.addEventListener('click', () => selectSuggestion(unitNumber));
        suggestionsDiv.appendChild(div);
    });
    
    suggestionsDiv.classList.add('show');
    suggestionIndex = -1;
}

// Hide suggestions dropdown
function hideSuggestions() {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.classList.remove('show');
    suggestionIndex = -1;
}

// Highlight suggestion based on keyboard navigation
function highlightSuggestion() {
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    suggestions.forEach((item, index) => {
        if (index === suggestionIndex) {
            item.style.background = '#e3f2fd';
        } else {
            item.style.background = '';
        }
    });
}

// Select suggestion
function selectSuggestion(unitNumber) {
    document.getElementById('flatNumber').value = unitNumber;
    hideSuggestions();
    lookupProperty();
}

// Clear all form fields
function clearAllFields() {
    const fields = [
        'band', 'facing', 'carpet', 'typology',
        'agreementValue', 'stampDuty', 'gst', 'regAmt',
        'otherCharges', 'allInclusive', 'possessionCharges', 'tower'
    ];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.value = '';
        field.style.background = '';
    });
    
    // Hide payment section
    document.getElementById('paymentSection').style.display = 'none';
    currentProperty = null;
}

// Show empty state
function showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = 'block';
    }
}

// Hide empty state
function hideEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// Show error state
function showErrorState(flatNumber) {
    hideEmptyState();
    
    // Remove existing error state
    const existingError = document.querySelector('.error-state');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error state
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-state fade-in';
    errorDiv.innerHTML = `
        <h3>Property Not Found</h3>
        <p>No property found with number "${flatNumber}"</p>
        <p>Please check the spelling and try again</p>
    `;
    
    document.querySelector('.content').appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
            if (!currentProperty) {
                showEmptyState();
            }
        }
    }, 5000);
}

// Format currency values
function formatCurrency(value) {
    if (!value) return '';
    return `₹ ${formatNumber(value)}`;
}

// Format numbers with Indian numbering system
function formatNumber(num) {
    if (!num) return '0';
    
    // Convert to string and handle decimals
    const numStr = num.toString();
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] ? '.' + parts[1] : '';
    
    // Add commas in Indian style (last 3, then every 2)
    if (integerPart.length > 3) {
        const lastThree = integerPart.substr(integerPart.length - 3);
        const remaining = integerPart.substr(0, integerPart.length - 3);
        const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        integerPart = formattedRemaining + ',' + lastThree;
    }
    
    return integerPart + decimalPart;
}

// Print function (optional)
function printDetails() {
    if (!currentProperty) {
        alert('Please select a property first');
        return;
    }
    
    window.print();
}

// Export to CSV function (optional)
function exportToCSV() {
    if (!currentProperty) {
        alert('Please select a property first');
        return;
    }
    
    const property = currentProperty;
    const csvContent = `
Property Details
Unit Number,${property.unitNumber}
Floor Number,${property.floorNumber}
Band,${property.band}
Facing,${property.facing}
Carpet Area,${property.carpetArea}
Typology,${property.typology}
Tower,${property.tower}

Pricing Details
Agreement Value,${property.price}
Stamp Duty,${property.stampDuty}
GST,${property.gst}
Registration Amount,${property.registration}
Other Charges,${property.otherCharges}
Possession Charges,${property.possessionCharges}
All Inclusive Amount,${property.allInclusiveAmount}
    `.trim();
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${property.unitNumber}_details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+P for print
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printDetails();
    }
    
    // Ctrl+E for export
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportToCSV();
    }
    
    // Ctrl+F to focus on input
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('flatNumber').focus();
    }
    
    // Escape to clear
    if (e.key === 'Escape' && !document.querySelector('.suggestions.show')) {
        document.getElementById('flatNumber').value = '';
        clearAllFields();
        showEmptyState();
    }
});

// Auto-save last searched property
function saveLastSearch(unitNumber) {
    localStorage.setItem('lastSearchedUnit', unitNumber);
}

function loadLastSearch() {
    const lastUnit = localStorage.getItem('lastSearchedUnit');
    if (lastUnit && inventoryData[lastUnit]) {
        document.getElementById('flatNumber').value = lastUnit;
        lookupProperty();
    }
}

// Load last search on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadLastSearch, 500);
});

// Save search when property is found
const originalLookupProperty = lookupProperty;
lookupProperty = function() {
    originalLookupProperty();
    
    const flatNumber = document.getElementById('flatNumber').value.trim().toUpperCase();
    if (currentProperty) {
        saveLastSearch(flatNumber);
    }
};
