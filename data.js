/*  data.js
    ─────────────────────────────
    Drop your full Excel “BE” tab here.
    Each object key MUST match the flat number exactly.
    Only a short sample is included below – extend it
    until every flat is listed.
*/

const inventoryData = {
  /* ––– ASTER ––– */
  "A P101": {unitNumber:"A P101",floorNumber:"P1",band:"1st Band",facing:"East / SGNP",carpetArea:"409 Sq Ft",typology:"1BHK",
             price:7852800,stampDuty:549696,gst:392640,registration:30000,otherCharges:487900,possessionCharges:90480,
             allInclusiveAmount:9403516,tower:"Aster",paymentPlan:"9:11:80"},
  "A P102": {unitNumber:"A P102",floorNumber:"P1",band:"1st Band",facing:"East / SGNP",carpetArea:"625 Sq Ft",typology:"2BHK",
             price:12000000,stampDuty:840000,gst:600000,registration:30000,otherCharges:637200,possessionCharges:138000,
             allInclusiveAmount:14245200,tower:"Aster",paymentPlan:"9:11:80"},
  "A P103": {unitNumber:"A P103",floorNumber:"P1",band:"1st Band",facing:"West / SIS",carpetArea:"665 Sq Ft",typology:"2BHK",
             price:12768000,stampDuty:893760,gst:638400,registration:30000,otherCharges:637200,possessionCharges:146800,
             allInclusiveAmount:15114160,tower:"Aster",paymentPlan:"9:11:80"},
  "A P104": {unitNumber:"A P104",floorNumber:"P1",band:"1st Band",facing:"West / SIS",carpetArea:"430 Sq Ft",typology:"1BHK",
             price:8256000,stampDuty:577920,gst:412800,registration:30000,otherCharges:487900,possessionCharges:95100,
             allInclusiveAmount:9859720,tower:"Aster",paymentPlan:"9:11:80"},

  /* ––– BLU ––– */
  "B 101":   {unitNumber:"B 101",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"671 Sq Ft",typology:"2BHK",
              price:12883200,stampDuty:901824,gst:644160,registration:30000,otherCharges:637200,possessionCharges:148120,
              allInclusiveAmount:15244504,tower:"Blu",paymentPlan:"9:11:80"},
  "B 102":   {unitNumber:"B 102",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"469 Sq Ft",typology:"1BHK",
              price:9004800,stampDuty:630336,gst:450240,registration:30000,otherCharges:487900,possessionCharges:103680,
              allInclusiveAmount:10706956,tower:"Blu",paymentPlan:"9:11:80"},

  /* ––– CLOVE ––– */
  "C 101":   {unitNumber:"C 101",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",
              price:8678400,stampDuty:607488,gst:433920,registration:30000,otherCharges:487900,possessionCharges:99940,
              allInclusiveAmount:10337648,tower:"Clove",paymentPlan:"9:91"},

  /* ––– DION ––– */
  "D 101":   {unitNumber:"D 101",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",
              price:12576000,stampDuty:880320,gst:628800,registration:30000,otherCharges:637200,possessionCharges:144600,
              allInclusiveAmount:14896920,tower:"Dion",paymentPlan:"9:91"},

  /* Continue until every row from Excel is here */
};

/* Payment-plan templates */
const paymentPlans = {
  "9:11:80":[{stage:"On Booking",percentage:9},
             {stage:"On Completion of Terrace",percentage:11},
             {stage:"On Possession",percentage:80}],
  "9:91":[{stage:"On Booking",percentage:9},
          {stage:"On Occupancy Certificate",percentage:91}]
};

/* Tower-colour mapping */
const towerColors = {Aster:"#4a90e2",Blu:"#5cb85c",Clove:"#f0ad4e",Dion:"#d9534f"};
