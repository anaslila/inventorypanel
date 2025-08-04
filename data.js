// Complete property inventory data from Excel file
const inventoryData = {
    // Aster Tower Properties
    "A P101": {
        unitNumber: "A P101",
        floorNumber: "P1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "409 Sq Ft",
        typology: "1BHK",
        price: 7852800,
        stampDuty: 549696,
        gst: 392640,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 90480,
        allInclusiveAmount: 9403516,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },
    "A P102": {
        unitNumber: "A P102",
        floorNumber: "P1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "625 Sq Ft",
        typology: "2BHK",
        price: 12000000,
        stampDuty: 840000,
        gst: 600000,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 138000,
        allInclusiveAmount: 14245200,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },
    "A P103": {
        unitNumber: "A P103",
        floorNumber: "P1",
        band: "1st Band",
        facing: "West /SIS",
        carpetArea: "665 Sq Ft",
        typology: "2BHK",
        price: 12768000,
        stampDuty: 893760,
        gst: 638400,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 146800,
        allInclusiveAmount: 15114160,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },
    "A P104": {
        unitNumber: "A P104",
        floorNumber: "P1",
        band: "1st Band",
        facing: "West /SIS",
        carpetArea: "430 Sq Ft",
        typology: "1BHK",
        price: 8256000,
        stampDuty: 577920,
        gst: 412800,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 95100,
        allInclusiveAmount: 9859720,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },
    "A 101": {
        unitNumber: "A 101",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "409 Sq Ft",
        typology: "1BHK",
        price: 7852800,
        stampDuty: 549696,
        gst: 392640,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 90480,
        allInclusiveAmount: 9403516,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },
    "A 102": {
        unitNumber: "A 102",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "625 Sq Ft",
        typology: "2BHK",
        price: 12000000,
        stampDuty: 840000,
        gst: 600000,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 138000,
        allInclusiveAmount: 14245200,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },
    "A 601": {
        unitNumber: "A 601",
        floorNumber: "6",
        band: "2nd Band",
        facing: "East / SGNP",
        carpetArea: "409 Sq Ft",
        typology: "1BHK",
        price: 8057300,
        stampDuty: 564011,
        gst: 402865,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 90480,
        allInclusiveAmount: 9632556,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },
    "A 2401": {
        unitNumber: "A 2401",
        floorNumber: "24",
        band: "3rd Band",
        facing: "East / SGNP",
        carpetArea: "409 Sq Ft",
        typology: "1BHK",
        price: 8261800,
        stampDuty: 578326,
        gst: 413090,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 90480,
        allInclusiveAmount: 9861596,
        tower: "Aster",
        paymentPlan: "(9:11:80)"
    },

    // Blu Tower Properties
    "B P201": {
        unitNumber: "B P201",
        floorNumber: "P1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "671 Sq Ft",
        typology: "2BHK",
        price: 12883200,
        stampDuty: 901824,
        gst: 644160,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 148120,
        allInclusiveAmount: 15244504,
        tower: "Blu",
        paymentPlan: "(9:11:80)"
    },
    "B 101": {
        unitNumber: "B 101",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "671 Sq Ft",
        typology: "2BHK",
        price: 12883200,
        stampDuty: 901824,
        gst: 644160,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 148120,
        allInclusiveAmount: 15244504,
        tower: "Blu",
        paymentPlan: "(9:11:80)"
    },
    "B 102": {
        unitNumber: "B 102",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "469 Sq Ft",
        typology: "1BHK",
        price: 9004800,
        stampDuty: 630336,
        gst: 450240,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 103680,
        allInclusiveAmount: 10706956,
        tower: "Blu",
        paymentPlan: "(9:11:80)"
    },
    "B 601": {
        unitNumber: "B 601",
        floorNumber: "6",
        band: "2nd Band",
        facing: "East / SGNP",
        carpetArea: "671 Sq Ft",
        typology: "2BHK",
        price: 13218700,
        stampDuty: 925309,
        gst: 660935,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 148120,
        allInclusiveAmount: 15620264,
        tower: "Blu",
        paymentPlan: "(9:11:80)"
    },
    "B 2401": {
        unitNumber: "B 2401",
        floorNumber: "24",
        band: "3rd Band",
        facing: "East / SGNP",
        carpetArea: "671 Sq Ft",
        typology: "2BHK",
        price: 13554200,
        stampDuty: 948794,
        gst: 677710,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 148120,
        allInclusiveAmount: 15996024,
        tower: "Blu",
        paymentPlan: "(9:11:80)"
    },

    // Clove Tower Properties
    "C 101": {
        unitNumber: "C 101",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "452 Sq Ft",
        typology: "1BHK",
        price: 8678400,
        stampDuty: 607488,
        gst: 433920,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 99940,
        allInclusiveAmount: 10337648,
        tower: "Clove",
        paymentPlan: "(9:91)"
    },
    "C 102": {
        unitNumber: "C 102",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "452 Sq Ft",
        typology: "1BHK",
        price: 8678400,
        stampDuty: 607488,
        gst: 433920,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 99940,
        allInclusiveAmount: 10337648,
        tower: "Clove",
        paymentPlan: "(9:91)"
    },
    "C 601": {
        unitNumber: "C 601",
        floorNumber: "6",
        band: "2nd Band",
        facing: "East / SGNP",
        carpetArea: "452 Sq Ft",
        typology: "1BHK",
        price: 8904400,
        stampDuty: 623308,
        gst: 445220,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 99940,
        allInclusiveAmount: 10590768,
        tower: "Clove",
        paymentPlan: "(9:91)"
    },
    "C 2401": {
        unitNumber: "C 2401",
        floorNumber: "24",
        band: "3rd Band",
        facing: "East / SGNP",
        carpetArea: "452 Sq Ft",
        typology: "1BHK",
        price: 9130400,
        stampDuty: 639128,
        gst: 456520,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 99940,
        allInclusiveAmount: 10843888,
        tower: "Clove",
        paymentPlan: "(9:91)"
    },

    // Dion Tower Properties
    "D 101": {
        unitNumber: "D 101",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "655 Sq Ft",
        typology: "2BHK",
        price: 12576000,
        stampDuty: 880320,
        gst: 628800,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 144600,
        allInclusiveAmount: 14896920,
        tower: "Dion",
        paymentPlan: "(9:91)"
    },
    "D 102": {
        unitNumber: "D 102",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: "655 Sq Ft",
        typology: "2BHK",
        price: 12576000,
        stampDuty: 880320,
        gst: 628800,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 144600,
        allInclusiveAmount: 14896920,
        tower: "Dion",
        paymentPlan: "(9:91)"
    },
    "D 601": {
        unitNumber: "D 601",
        floorNumber: "6",
        band: "2nd Band",
        facing: "East / SGNP",
        carpetArea: "655 Sq Ft",
        typology: "2BHK",
        price: 12903500,
        stampDuty: 903245,
        gst: 645175,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 144600,
        allInclusiveAmount: 15263720,
        tower: "Dion",
        paymentPlan: "(9:91)"
    },
    "D 2401": {
        unitNumber: "D 2401",
        floorNumber: "24",
        band: "3rd Band",
        facing: "East / SGNP",
        carpetArea: "655 Sq Ft",
        typology: "2BHK",
        price: 13231000,
        stampDuty: 926170,
        gst: 661550,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 144600,
        allInclusiveAmount: 15630520,
        tower: "Dion",
        paymentPlan: "(9:91)"
    }
};

// Payment plan configurations
const paymentPlans = {
    "(9:11:80)": {
        name: "(9:11:80)",
        stages: [
            { stage: "On Booking", percentage: 9 },
            { stage: "On Completion of Terrace", percentage: 11 },
            { stage: "On Possession", percentage: 80 }
        ]
    },
    "(9:91)": {
        name: "(9:91)", 
        stages: [
            { stage: "On Booking", percentage: 9 },
            { stage: "On Occupancy Certificate", percentage: 91 }
        ]
    }
};

// Tower color mapping
const towerColors = {
    "Aster": "#4a90e2",
    "Blu": "#5cb85c",
    "Clove": "#f0ad4e",
    "Dion": "#d9534f"
};

// Get all unit numbers for autocomplete
const getAllUnitNumbers = () => {
    return Object.keys(inventoryData);
};

// Search function for autocomplete
const searchUnits = (query) => {
    if (!query) return [];
    
    const units = Object.keys(inventoryData);
    return units.filter(unit => 
        unit.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 suggestions
};
