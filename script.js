// Global variables
let filteredProperties = [...propertyData];
let currentPage = 0;
const propertiesPerPage = 12;
let currentView = 'grid';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializePriceRange();
    loadProperties();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    
    priceRange.addEventListener('input', function() {
        const value = parseInt(this.value);
        priceDisplay.textContent = `Up to ₹${(value / 10000000).toFixed(1)} Cr`;
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize price range slider
function initializePriceRange() {
    const prices = propertyData.map(p => p.allInclusiveAmount);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const priceRange = document.getElementById('priceRange');
    priceRange.min = minPrice;
    priceRange.max = maxPrice;
    priceRange.value = maxPrice;
    
    document.getElementById('priceDisplay').textContent = `Up to ₹${(maxPrice / 10000000).toFixed(1)} Cr`;
}

// Apply filters
function applyFilters() {
    const tower = document.getElementById('towerFilter').value;
    const typology = document.getElementById('typologyFilter').value;
    const band = document.getElementById('bandFilter').value;
    const facing = document.getElementById('facingFilter').value;
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    filteredProperties = propertyData.filter(property => {
        return (!tower || property.tower === tower) &&
               (!typology || property.typology === typology) &&
               (!band || property.band === band) &&
               (!facing || property.facing === facing) &&
               (property.allInclusiveAmount <= maxPrice);
    });
    
    currentPage = 0;
    loadProperties(true);
}

// Reset filters
function resetFilters() {
    document.getElementById('towerFilter').value = '';
    document.getElementById('typologyFilter').value = '';
    document.getElementById('bandFilter').value = '';
    document.getElementById('facingFilter').value = '';
    
    const priceRange = document.getElementById('priceRange');
    priceRange.value = priceRange.max;
    document.getElementById('priceDisplay').textContent = `Up to ₹${(priceRange.max / 10000000).toFixed(1)} Cr`;
    
    filteredProperties = [...propertyData];
    currentPage = 0;
    loadProperties(true);
}

// Load properties
function loadProperties(reset = false) {
    const propertyGrid = document.getElementById('propertyGrid');
    
    if (reset) {
        propertyGrid.innerHTML = '';
        currentPage = 0;
    }
    
    const startIndex = currentPage * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);
    
    if (propertiesToShow.length === 0 && reset) {
        propertyGrid.innerHTML = '<div class="no-results"><h3>No properties found</h3><p>Try adjusting your filters</p></div>';
        document.getElementById('loadMoreBtn').style.display = 'none';
        return;
    }
    
    propertiesToShow.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertyGrid.appendChild(propertyCard);
    });
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (endIndex >= filteredProperties.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
    
    currentPage++;
}

// Create property card
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.onclick = () => openPropertyModal(property);
    
    card.innerHTML = `
        <div class="property-header">
            <h3>${property.unitNumber}</h3>
            <div class="tower-badge">${property.tower} Tower</div>
        </div>
        <div class="property-details">
            <div class="property-info">
                <div class="info-item">
                    <div class="label">Floor</div>
                    <div class="value">${property.floorNumber}</div>
                </div>
                <div class="info-item">
                    <div class="label">Area</div>
                    <div class="value">${property.carpetArea} sq ft</div>
                </div>
                <div class="info-item">
                    <div class="label">Type</div>
                    <div class="value">${property.typology}</div>
                </div>
                <div class="info-item">
                    <div class="label">Facing</div>
                    <div class="value">${property.facing}</div>
                </div>
            </div>
            <div class="pricing">
                <div class="main-price">
                    <div class="price-label">All Inclusive Price</div>
                    <div class="price-value">₹${formatPrice(property.allInclusiveAmount)}</div>
                </div>
                <div class="price-breakdown">
                    <span>Base Price: ₹${formatPrice(property.price)}</span>
                    <span>Price/sq ft: ₹${Math.round(property.price / property.carpetArea)}</span>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn-primary" onclick="event.stopPropagation(); contactForProperty('${property.unitNumber}')">
                    <i class="fas fa-phone"></i> Contact
                </button>
                <button class="btn-secondary" onclick="event.stopPropagation(); openPropertyModal(property)">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Format price for display
function formatPrice(price) {
    if (price >= 10000000) {
        return `${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
        return `${(price / 100000).toFixed(2)} L`;
    } else {
        return price.toLocaleString('en-IN');
    }
}

// Switch view between grid and list
function switchView(view) {
    currentView = view;
    const propertyGrid = document.getElementById('propertyGrid');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Update active button
    viewButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update grid class
    if (view === 'list') {
        propertyGrid.classList.add('list-view');
    } else {
        propertyGrid.classList.remove('list-view');
    }
}

// Load more properties
function loadMoreProperties() {
    loadProperties();
}

// Open property detail modal
function openPropertyModal(property) {
    const modal = document.getElementById('propertyModal');
    const modalContent = document.getElementById('modalContent');
    
    const paymentPlan = paymentPlans[property.paymentPlan];
    const tower = towerInfo[property.tower];
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px 12px 0 0;">
                <h2>${property.unitNumber} - ${property.tower} Tower</h2>
                <p>${property.typology} • ${property.carpetArea} sq ft • Floor ${property.floorNumber}</p>
            </div>
        </div>
        <div class="modal-body" style="padding: 2rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <h3 style="margin-bottom: 1rem; color: #1e293b;">Property Details</h3>
                    <div style="display: grid; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Unit Number:</span>
                            <span>${property.unitNumber}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Floor:</span>
                            <span>${property.floorNumber}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Carpet Area:</span>
                            <span>${property.carpetArea} sq ft</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Type:</span>
                            <span>${property.typology}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Facing:</span>
                            <span>${property.facing}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Price Band:</span>
                            <span>${property.band}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 style="margin-bottom: 1rem; color: #1e293b;">Price Breakdown</h3>
                    <div style="display: grid; gap: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Base Price:</span>
                            <span>₹${formatPrice(property.price)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Stamp Duty:</span>
                            <span>₹${formatPrice(property.stampDuty)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">GST:</span>
                            <span>₹${formatPrice(property.gst)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Registration:</span>
                            <span>₹${formatPrice(property.registration)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">Other Charges:</span>
                            <span>₹${formatPrice(property.otherCharges)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #059669; color: white; border-radius: 6px; font-weight: 600;">
                            <span>Total Amount:</span>
                            <span>₹${formatPrice(property.allInclusiveAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; color: #1e293b;">Payment Plan ${paymentPlan.name}</h3>
                <div style="display: grid; gap: 0.5rem;">
                    ${paymentPlan.stages.map(stage => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8fafc; border-radius: 6px;">
                            <span style="font-weight: 500;">${stage.stage}</span>
                            <div style="text-align: right;">
                                <div style="font-weight: 600; color: #2563eb;">${stage.percentage}%</div>
                                <div style="font-size: 0.9rem; color: #64748b;">₹${formatPrice(property.price * stage.percentage / 100)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; color: #1e293b;">Tower Information</h3>
                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px;">
                    <h4 style="color: #2563eb; margin-bottom: 0.5rem;">${tower.name}</h4>
                    <p style="color: #64748b; margin-bottom: 1rem;">${tower.description}</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <strong>Total Floors:</strong> ${tower.floors}
                        </div>
                        <div>
                            <strong>Units per Floor:</strong> ${tower.unitsPerFloor}
                        </div>
                    </div>
                    <div>
                        <strong>Amenities:</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                            ${tower.amenities.map(amenity => `
                                <span style="background: #2563eb; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">${amenity}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem;">
                <button style="flex: 1; padding: 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;" onclick="contactForProperty('${property.unitNumber}')">
                    <i class="fas fa-phone"></i> Contact for This Property
                </button>
                <button style="flex: 1; padding: 1rem; background: #059669; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;" onclick="scheduleVisit('${property.unitNumber}')">
                    <i class="fas fa-calendar"></i> Schedule Site Visit
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('propertyModal').style.display = 'none';
}

// Contact for specific property
function contactForProperty(unitNumber) {
    alert(`Thank you for your interest in ${unitNumber}. Our sales team will contact you shortly!`);
    // Here you would typically integrate with your CRM or send an email
}

// Schedule site visit
function scheduleVisit(unitNumber) {
    alert(`Site visit request for ${unitNumber} has been submitted. We'll contact you to confirm the appointment.`);
    // Here you would typically integrate with your booking system
}

// Submit inquiry form
function submitInquiry(event) {
    event.preventDefault();
    alert('Thank you for your inquiry! We will get back to you within 24 hours.');
    event.target.reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('propertyModal');
    if (event.target === modal) {
        closeModal();
    }
}
