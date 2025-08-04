// Global variables
let currentProperty = null;
let suggestionIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const flatInput = document.getElementById('flatNumber');
    flatInput.addEventListener('input', () => { 
        showSuggestions(flatInput.value); 
        lookupProperty(); 
    });
    flatInput.addEventListener('keydown', handleSuggestionKeys);
    document.addEventListener('click', e => { 
        if(!e.target.closest('.input-wrapper')) hideSuggestions(); 
    });
    
    // Window controls
    document.querySelector('.minimize-btn').onclick = () => document.body.style.display='none';
    document.querySelector('.close-btn').onclick = () => {
        if(confirm('Close application?')) window.close();
    };

    // Restore last search
    const lastUnit = localStorage.getItem('lastSearchedUnit');
    if (lastUnit && inventoryData[lastUnit]) { 
        flatInput.value = lastUnit; 
        lookupProperty(); 
    }
});

// PERFECT Indian Number Formatting Function
function formatIndianCurrency(amount) {
    if (!amount || amount === 0) return "₹ 0";
    
    const num = Math.round(amount);
    const numStr = num.toString();
    
    // Handle numbers less than 1000
    if (numStr.length <= 3) {
        return `₹ ${numStr}`;
    }
    
    // For Indian numbering system (last 3 digits, then groups of 2)
    const lastThree = numStr.substr(numStr.length - 3);
    const remaining = numStr.substr(0, numStr.length - 3);
    
    let formattedRemaining = '';
    for (let i = remaining.length; i > 0; i -= 2) {
        const start = Math.max(0, i - 2);
        const group = remaining.substr(start, i - start);
        formattedRemaining = group + (formattedRemaining ? ',' + formattedRemaining : '');
    }
    
    return `₹ ${formattedRemaining},${lastThree}`;
}

// Main lookup function
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
        localStorage.setItem('lastSearchedUnit', flatNumber);
        populateFields(property);
        showPaymentPlan(property);
        hideEmptyState();
        hideSuggestions();
        hideError();
    } else {
        clearAllFields();
        showError(flatNumber);
    }
}

// Populate all form fields with perfect formatting
function populateFields(property) {
    document.getElementById('band').value = property.band;
    document.getElementById('facing').value = property.facing;
    document.getElementById('carpet').value = property.carpetArea;
    document.getElementById('typology').value = property.typology;
    
    // Format all currency values with Indian numbering
    document.getElementById('agreementValue').value = formatIndianCurrency(property.price);
    document.getElementById('stampDuty').value = formatIndianCurrency(property.stampDuty);
    document.getElementById('gst').value = formatIndianCurrency(property.gst);
    document.getElementById('regAmt').value = formatIndianCurrency(property.registration);
    document.getElementById('otherCharges').value = formatIndianCurrency(property.otherCharges);
    document.getElementById('allInclusive').value = formatIndianCurrency(property.allInclusiveAmount);
    document.getElementById('possessionCharges').value = formatIndianCurrency(property.possessionCharges);
    document.getElementById('tower').value = property.tower;
    
    // Update tower color
    const towerColor = towerColors[property.tower] || '#4a90e2';
    document.getElementById('tower').style.background = towerColor;
}

// Show payment plan breakdown
function showPaymentPlan(property) {
    const paymentSection = document.getElementById('paymentSection');
    const paymentPlanTitle = document.getElementById('paymentPlanTitle');
    const towerName = document.getElementById('towerName');
    const paymentBreakdown = document.getElementById('paymentBreakdown');
    
    const plan = paymentPlans[property.paymentPlan];
    if (!plan) {
        paymentSection.style.display = 'none';
        return;
    }
    
    // Update title and tower
    paymentPlanTitle.textContent = `Payment Plan Breakup (${property.paymentPlan})`;
    towerName.textContent = property.tower;
    
    // Update tower color
    const towerColor = towerColors[property.tower] || '#4a90e2';
    towerName.style.background = towerColor;
    
    // Generate payment breakdown with perfect formatting
    paymentBreakdown.innerHTML = '';
    
    plan.forEach(stage => {
        const amount = Math.round(property.price * stage.percentage / 100);
        const row = document.createElement('div');
        row.className = 'payment-row';
        row.innerHTML = `
            <div class="percentage">${stage.percentage}%</div>
            <div class="amount">${formatIndianCurrency(amount)}</div>
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
    
    const matches = Object.keys(inventoryData)
        .filter(unit => unit.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);
    
    if (matches.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    
    matches.forEach(unitNumber => {
        const property = inventoryData[unitNumber];
        const div = document.createElement('div');
        div.className = 'suggestion-item';
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

// Hide suggestions
function hideSuggestions() {
    document.getElementById('suggestions').classList.remove('show');
    suggestionIndex = -1;
}

// Handle keyboard navigation in suggestions
function handleSuggestionKeys(e) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    if (!suggestions.length) return;
    
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
            const unitNumber = suggestions[suggestionIndex].querySelector('.unit-number').textContent;
            selectSuggestion(unitNumber);
        }
    } else if (e.key === 'Escape') {
        hideSuggestions();
    }
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
        if (fieldId === 'tower') {
            field.style.background = '';
        }
    });
    
    document.getElementById('paymentSection').style.display = 'none';
    currentProperty = null;
}

// Show empty state
function showEmptyState() {
    document.getElementById('emptyState').style.display = 'block';
}

// Hide empty state
function hideEmptyState() {
    document.getElementById('emptyState').style.display = 'none';
}

// Show error state
function showError(flatNumber) {
    hideEmptyState();
    hideError(); // Remove existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorState';
    errorDiv.className = 'error-state fade-in';
    errorDiv.innerHTML = `
        <h3>Property Not Found</h3>
        <p>No property found with number "${flatNumber}"</p>
        <p>Please check the spelling and try again</p>
    `;
    
    document.querySelector('.content').appendChild(errorDiv);
    
    // Auto remove error after 5 seconds
    setTimeout(() => {
        hideError();
        if (!currentProperty) {
            showEmptyState();
        }
    }, 5000);
}

// Hide error state
function hideError() {
    const errorState = document.getElementById('errorState');
    if (errorState) {
        errorState.remove();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
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
