// Property data converted from your Excel file
const propertyData = [
    // Aster Tower Properties
    {
        unitNumber: "A P101",
        floorNumber: "P1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: 409,
        typology: "1BHK",
        price: 7852800,
        stampDuty: 549696,
        gst: 392640,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 90480,
        allInclusiveAmount: 9403516,
        tower: "Aster",
        paymentPlan: "(9:11:80)",
        series: 1
    },
    {
        unitNumber: "A P102",
        floorNumber: "P1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: 625,
        typology: "2BHK",
        price: 12000000,
        stampDuty: 840000,
        gst: 600000,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 138000,
        allInclusiveAmount: 14245200,
        tower: "Aster",
        paymentPlan: "(9:11:80)",
        series: 2
    },
    // Add more properties here - truncated for space
    // You would continue adding all the properties from your Excel data
    
    // Blu Tower Properties
    {
        unitNumber: "B 101",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: 671,
        typology: "2BHK",
        price: 12883200,
        stampDuty: 901824,
        gst: 644160,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 148120,
        allInclusiveAmount: 15244504,
        tower: "Blu",
        paymentPlan: "(9:11:80)",
        series: 1
    },
    
    // Clove Tower Properties
    {
        unitNumber: "C 101",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: 452,
        typology: "1BHK",
        price: 8678400,
        stampDuty: 607488,
        gst: 433920,
        registration: 30000,
        otherCharges: 487900,
        possessionCharges: 99940,
        allInclusiveAmount: 10337648,
        tower: "Clove",
        paymentPlan: "(9:91)",
        series: 1
    },
    
    // Dion Tower Properties
    {
        unitNumber: "D 101",
        floorNumber: "1",
        band: "1st Band",
        facing: "East / SGNP",
        carpetArea: 655,
        typology: "2BHK",
        price: 12576000,
        stampDuty: 880320,
        gst: 628800,
        registration: 30000,
        otherCharges: 637200,
        possessionCharges: 144600,
        allInclusiveAmount: 14896920,
        tower: "Dion",
        paymentPlan: "(9:91)",
        series: 1
    }
    // Continue adding all your properties...
];

// Payment plan details
const paymentPlans = {
    "(9:11:80)": {
        name: "9:11:80 Plan",
        stages: [
            { stage: "On Booking", percentage: 9 },
            { stage: "On Completion of Terrace", percentage: 11 },
            { stage: "On Possession", percentage: 80 }
        ]
    },
    "(9:91)": {
        name: "9:91 Plan", 
        stages: [
            { stage: "On Booking", percentage: 9 },
            { stage: "On Occupancy Certificate", percentage: 91 }
        ]
    }
};

// Tower information
const towerInfo = {
    "Aster": {
        name: "Aster Tower",
        description: "Premium residential tower with garden and park views",
        floors: 35,
        unitsPerFloor: 6,
        amenities: ["Swimming Pool", "Gym", "Garden View", "24x7 Security"]
    },
    "Blu": {
        name: "Blu Tower", 
        description: "Modern living spaces with panoramic city views",
        floors: 35,
        unitsPerFloor: 7,
        amenities: ["Sky Lounge", "Gym", "City View", "Parking"]
    },
    "Clove": {
        name: "Clove Tower",
        description: "Elegant apartments with premium finishes",
        floors: 35,
        unitsPerFloor: 8,
        amenities: ["Club House", "Swimming Pool", "Garden", "Security"]
    },
    "Dion": {
        name: "Dion Tower",
        description: "Spacious 2BHK residences with luxury amenities", 
        floors: 35,
        unitsPerFloor: 8,
        amenities: ["Spa", "Gym", "Pool", "Concierge"]
    }
};
