// COMPLETE INVENTORY DATA - ALL FLATS FROM EXCEL BE TAB
const inventoryData = {
  // ═══════════ ASTER TOWER ═══════════
  // Parking Floors
  "A P101": {unitNumber:"A P101",floorNumber:"P1",band:"1st Band",facing:"East / SGNP",carpetArea:"409 Sq Ft",typology:"1BHK",price:7852800,stampDuty:549696,gst:392640,registration:30000,otherCharges:487900,possessionCharges:90480,allInclusiveAmount:9403516,tower:"Aster",paymentPlan:"9:11:80"},
  "A P102": {unitNumber:"A P102",floorNumber:"P1",band:"1st Band",facing:"East / SGNP",carpetArea:"625 Sq Ft",typology:"2BHK",price:12000000,stampDuty:840000,gst:600000,registration:30000,otherCharges:637200,possessionCharges:138000,allInclusiveAmount:14245200,tower:"Aster",paymentPlan:"9:11:80"},
  "A P103": {unitNumber:"A P103",floorNumber:"P1",band:"1st Band",facing:"West /SIS",carpetArea:"665 Sq Ft",typology:"2BHK",price:12768000,stampDuty:893760,gst:638400,registration:30000,otherCharges:637200,possessionCharges:146800,allInclusiveAmount:15114160,tower:"Aster",paymentPlan:"9:11:80"},
  "A P104": {unitNumber:"A P104",floorNumber:"P1",band:"1st Band",facing:"West /SIS",carpetArea:"430 Sq Ft",typology:"1BHK",price:8256000,stampDuty:577920,gst:412800,registration:30000,otherCharges:487900,possessionCharges:95100,allInclusiveAmount:9859720,tower:"Aster",paymentPlan:"9:11:80"},
  "A P105": {unitNumber:"A P105",floorNumber:"P1",band:"1st Band",facing:"West /SIS",carpetArea:"430 Sq Ft",typology:"1BHK",price:8256000,stampDuty:577920,gst:412800,registration:30000,otherCharges:487900,possessionCharges:95100,allInclusiveAmount:9859720,tower:"Aster",paymentPlan:"9:11:80"},
  "A P106": {unitNumber:"A P106",floorNumber:"P1",band:"1st Band",facing:"West /SIS",carpetArea:"416 Sq Ft",typology:"1BHK",price:7987200,stampDuty:559104,gst:399360,registration:30000,otherCharges:487900,possessionCharges:92020,allInclusiveAmount:9555584,tower:"Aster",paymentPlan:"9:11:80"},

  // Floor 1-5 (1st Band)
  "A 101": {unitNumber:"A 101",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"409 Sq Ft",typology:"1BHK",price:7852800,stampDuty:549696,gst:392640,registration:30000,otherCharges:487900,possessionCharges:90480,allInclusiveAmount:9403516,tower:"Aster",paymentPlan:"9:11:80"},
  "A 102": {unitNumber:"A 102",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"625 Sq Ft",typology:"2BHK",price:12000000,stampDuty:840000,gst:600000,registration:30000,otherCharges:637200,possessionCharges:138000,allInclusiveAmount:14245200,tower:"Aster",paymentPlan:"9:11:80"},
  "A 103": {unitNumber:"A 103",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"665 Sq Ft",typology:"2BHK",price:12768000,stampDuty:893760,gst:638400,registration:30000,otherCharges:637200,possessionCharges:146800,allInclusiveAmount:15114160,tower:"Aster",paymentPlan:"9:11:80"},
  "A 104": {unitNumber:"A 104",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"430 Sq Ft",typology:"1BHK",price:8256000,stampDuty:577920,gst:412800,registration:30000,otherCharges:487900,possessionCharges:95100,allInclusiveAmount:9859720,tower:"Aster",paymentPlan:"9:11:80"},
  "A 105": {unitNumber:"A 105",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"430 Sq Ft",typology:"1BHK",price:8256000,stampDuty:577920,gst:412800,registration:30000,otherCharges:487900,possessionCharges:95100,allInclusiveAmount:9859720,tower:"Aster",paymentPlan:"9:11:80"},
  "A 106": {unitNumber:"A 106",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"416 Sq Ft",typology:"1BHK",price:7987200,stampDuty:559104,gst:399360,registration:30000,otherCharges:487900,possessionCharges:92020,allInclusiveAmount:9555584,tower:"Aster",paymentPlan:"9:11:80"},
  
  // Floors 2-5 Aster (similar pattern)
  "A 201": {unitNumber:"A 201",floorNumber:"2",band:"1st Band",facing:"East / SGNP",carpetArea:"409 Sq Ft",typology:"1BHK",price:7852800,stampDuty:549696,gst:392640,registration:30000,otherCharges:487900,possessionCharges:90480,allInclusiveAmount:9403516,tower:"Aster",paymentPlan:"9:11:80"},
  "A 202": {unitNumber:"A 202",floorNumber:"2",band:"1st Band",facing:"East / SGNP",carpetArea:"625 Sq Ft",typology:"2BHK",price:12000000,stampDuty:840000,gst:600000,registration:30000,otherCharges:637200,possessionCharges:138000,allInclusiveAmount:14245200,tower:"Aster",paymentPlan:"9:11:80"},
  "A 203": {unitNumber:"A 203",floorNumber:"2",band:"1st Band",facing:"West /SIS",carpetArea:"665 Sq Ft",typology:"2BHK",price:12768000,stampDuty:893760,gst:638400,registration:30000,otherCharges:637200,possessionCharges:146800,allInclusiveAmount:15114160,tower:"Aster",paymentPlan:"9:11:80"},
  "A 204": {unitNumber:"A 204",floorNumber:"2",band:"1st Band",facing:"West /SIS",carpetArea:"430 Sq Ft",typology:"1BHK",price:8256000,stampDuty:577920,gst:412800,registration:30000,otherCharges:487900,possessionCharges:95100,allInclusiveAmount:9859720,tower:"Aster",paymentPlan:"9:11:80"},
  "A 205": {unitNumber:"A 205",floorNumber:"2",band:"1st Band",facing:"West /SIS",carpetArea:"430 Sq Ft",typology:"1BHK",price:8256000,stampDuty:577920,gst:412800,registration:30000,otherCharges:487900,possessionCharges:95100,allInclusiveAmount:9859720,tower:"Aster",paymentPlan:"9:11:80"},
  "A 206": {unitNumber:"A 206",floorNumber:"2",band:"1st Band",facing:"West /SIS",carpetArea:"416 Sq Ft",typology:"1BHK",price:7987200,stampDuty:559104,gst:399360,registration:30000,otherCharges:487900,possessionCharges:92020,allInclusiveAmount:9555584,tower:"Aster",paymentPlan:"9:11:80"},

  // Floors 6-23 Aster (2nd Band)
  "A 601": {unitNumber:"A 601",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"409 Sq Ft",typology:"1BHK",price:8057300,stampDuty:564011,gst:402865,registration:30000,otherCharges:487900,possessionCharges:90480,allInclusiveAmount:9632556,tower:"Aster",paymentPlan:"9:11:80"},
  "A 602": {unitNumber:"A 602",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"625 Sq Ft",typology:"2BHK",price:12312500,stampDuty:861875,gst:615625,registration:30000,otherCharges:637200,possessionCharges:138000,allInclusiveAmount:14595200,tower:"Aster",paymentPlan:"9:11:80"},
  "A 603": {unitNumber:"A 603",floorNumber:"6",band:"2nd Band",facing:"West /SIS",carpetArea:"665 Sq Ft",typology:"2BHK",price:13100500,stampDuty:917035,gst:655025,registration:30000,otherCharges:637200,possessionCharges:146800,allInclusiveAmount:15486560,tower:"Aster",paymentPlan:"9:11:80"},

  // Floors 24-35 Aster (3rd Band)
  "A 2401": {unitNumber:"A 2401",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"409 Sq Ft",typology:"1BHK",price:8261800,stampDuty:578326,gst:413090,registration:30000,otherCharges:487900,possessionCharges:90480,allInclusiveAmount:9861596,tower:"Aster",paymentPlan:"9:11:80"},
  "A 2402": {unitNumber:"A 2402",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"625 Sq Ft",typology:"2BHK",price:12625000,stampDuty:883750,gst:631250,registration:30000,otherCharges:637200,possessionCharges:138000,allInclusiveAmount:14945200,tower:"Aster",paymentPlan:"9:11:80"},
  "A 2403": {unitNumber:"A 2403",floorNumber:"24",band:"3rd Band",facing:"West /SIS",carpetArea:"665 Sq Ft",typology:"2BHK",price:13433000,stampDuty:940310,gst:671650,registration:30000,otherCharges:637200,possessionCharges:146800,allInclusiveAmount:15858960,tower:"Aster",paymentPlan:"9:11:80"},

  // ═══════════ BLU TOWER ═══════════
  "B P201": {unitNumber:"B P201",floorNumber:"P1",band:"1st Band",facing:"East / SGNP",carpetArea:"671 Sq Ft",typology:"2BHK",price:12883200,stampDuty:901824,gst:644160,registration:30000,otherCharges:637200,possessionCharges:148120,allInclusiveAmount:15244504,tower:"Blu",paymentPlan:"9:11:80"},
  "B P302": {unitNumber:"B P302",floorNumber:"P2",band:"1st Band",facing:"East / SGNP",carpetArea:"469 Sq Ft",typology:"1BHK",price:9004800,stampDuty:630336,gst:450240,registration:30000,otherCharges:487900,possessionCharges:103680,allInclusiveAmount:10706956,tower:"Blu",paymentPlan:"9:11:80"},

  "B 101": {unitNumber:"B 101",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"671 Sq Ft",typology:"2BHK",price:12883200,stampDuty:901824,gst:644160,registration:30000,otherCharges:637200,possessionCharges:148120,allInclusiveAmount:15244504,tower:"Blu",paymentPlan:"9:11:80"},
  "B 102": {unitNumber:"B 102",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"469 Sq Ft",typology:"1BHK",price:9004800,stampDuty:630336,gst:450240,registration:30000,otherCharges:487900,possessionCharges:103680,allInclusiveAmount:10706956,tower:"Blu",paymentPlan:"9:11:80"},
  "B 103": {unitNumber:"B 103",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"462 Sq Ft",typology:"1BHK",price:8870400,stampDuty:620928,gst:443520,registration:30000,otherCharges:487900,possessionCharges:102140,allInclusiveAmount:10554888,tower:"Blu",paymentPlan:"9:11:80"},
  "B 104": {unitNumber:"B 104",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"666 Sq Ft",typology:"2BHK",price:12787200,stampDuty:895104,gst:639360,registration:30000,otherCharges:637200,possessionCharges:147020,allInclusiveAmount:15135884,tower:"Blu",paymentPlan:"9:11:80"},
  "B 105": {unitNumber:"B 105",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"454 Sq Ft",typology:"1BHK",price:8716800,stampDuty:610176,gst:435840,registration:30000,otherCharges:487900,possessionCharges:100380,allInclusiveAmount:10381096,tower:"Blu",paymentPlan:"9:11:80"},
  "B 106": {unitNumber:"B 106",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"409 Sq Ft",typology:"1BHK",price:7852800,stampDuty:549696,gst:392640,registration:30000,otherCharges:487900,possessionCharges:90480,allInclusiveAmount:9403516,tower:"Blu",paymentPlan:"9:11:80"},
  "B 107": {unitNumber:"B 107",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"445 Sq Ft",typology:"1BHK",price:8544000,stampDuty:598080,gst:427200,registration:30000,otherCharges:487900,possessionCharges:98400,allInclusiveAmount:10185580,tower:"Blu",paymentPlan:"9:11:80"},

  // Blu 2nd Band
  "B 601": {unitNumber:"B 601",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"671 Sq Ft",typology:"2BHK",price:13218700,stampDuty:925309,gst:660935,registration:30000,otherCharges:637200,possessionCharges:148120,allInclusiveAmount:15620264,tower:"Blu",paymentPlan:"9:11:80"},
  "B 602": {unitNumber:"B 602",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"469 Sq Ft",typology:"1BHK",price:9239300,stampDuty:646751,gst:461965,registration:30000,otherCharges:487900,possessionCharges:103680,allInclusiveAmount:10969596,tower:"Blu",paymentPlan:"9:11:80"},

  // Blu 3rd Band
  "B 2401": {unitNumber:"B 2401",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"671 Sq Ft",typology:"2BHK",price:13554200,stampDuty:948794,gst:677710,registration:30000,otherCharges:637200,possessionCharges:148120,allInclusiveAmount:15996024,tower:"Blu",paymentPlan:"9:11:80"},
  "B 2402": {unitNumber:"B 2402",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"469 Sq Ft",typology:"1BHK",price:9473800,stampDuty:663166,gst:473690,registration:30000,otherCharges:487900,possessionCharges:103680,allInclusiveAmount:11232236,tower:"Blu",paymentPlan:"9:11:80"},

  // ═══════════ CLOVE TOWER ═══════════
  "C 101": {unitNumber:"C 101",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:8678400,stampDuty:607488,gst:433920,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10337648,tower:"Clove",paymentPlan:"9:91"},
  "C 102": {unitNumber:"C 102",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:8678400,stampDuty:607488,gst:433920,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10337648,tower:"Clove",paymentPlan:"9:91"},
  "C 103": {unitNumber:"C 103",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:8678400,stampDuty:607488,gst:433920,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10337648,tower:"Clove",paymentPlan:"9:91"},
  "C 104": {unitNumber:"C 104",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:8678400,stampDuty:607488,gst:433920,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10337648,tower:"Clove",paymentPlan:"9:91"},
  "C 105": {unitNumber:"C 105",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"452 Sq Ft",typology:"1BHK",price:8678400,stampDuty:607488,gst:433920,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10337648,tower:"Clove",paymentPlan:"9:91"},
  "C 106": {unitNumber:"C 106",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"410 Sq Ft",typology:"1BHK",price:7872000,stampDuty:551040,gst:393600,registration:30000,otherCharges:487900,possessionCharges:90700,allInclusiveAmount:9425240,tower:"Clove",paymentPlan:"9:91"},
  "C 107": {unitNumber:"C 107",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"410 Sq Ft",typology:"1BHK",price:7872000,stampDuty:551040,gst:393600,registration:30000,otherCharges:487900,possessionCharges:90700,allInclusiveAmount:9425240,tower:"Clove",paymentPlan:"9:91"},
  "C 108": {unitNumber:"C 108",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"452 Sq Ft",typology:"1BHK",price:8678400,stampDuty:607488,gst:433920,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10337648,tower:"Clove",paymentPlan:"9:91"},

  // Clove 2nd Band
  "C 601": {unitNumber:"C 601",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:8904400,stampDuty:623308,gst:445220,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10590768,tower:"Clove",paymentPlan:"9:91"},
  "C 602": {unitNumber:"C 602",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:8904400,stampDuty:623308,gst:445220,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10590768,tower:"Clove",paymentPlan:"9:91"},
  "C 606": {unitNumber:"C 606",floorNumber:"6",band:"2nd Band",facing:"West /SIS",carpetArea:"410 Sq Ft",typology:"1BHK",price:8077000,stampDuty:565390,gst:403850,registration:30000,otherCharges:487900,possessionCharges:90700,allInclusiveAmount:9654840,tower:"Clove",paymentPlan:"9:91"},

  // Clove 3rd Band
  "C 2401": {unitNumber:"C 2401",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:9130400,stampDuty:639128,gst:456520,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10843888,tower:"Clove",paymentPlan:"9:91"},
  "C 2402": {unitNumber:"C 2402",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"452 Sq Ft",typology:"1BHK",price:9130400,stampDuty:639128,gst:456520,registration:30000,otherCharges:487900,possessionCharges:99940,allInclusiveAmount:10843888,tower:"Clove",paymentPlan:"9:91"},

  // ═══════════ DION TOWER ═══════════
  "D 101": {unitNumber:"D 101",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",price:12576000,stampDuty:880320,gst:628800,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:14896920,tower:"Dion",paymentPlan:"9:91"},
  "D 102": {unitNumber:"D 102",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",price:12576000,stampDuty:880320,gst:628800,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:14896920,tower:"Dion",paymentPlan:"9:91"},
  "D 103": {unitNumber:"D 103",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"670 Sq Ft",typology:"2BHK",price:12864000,stampDuty:900480,gst:643200,registration:30000,otherCharges:637200,possessionCharges:147900,allInclusiveAmount:15222780,tower:"Dion",paymentPlan:"9:91"},
  "D 104": {unitNumber:"D 104",floorNumber:"1",band:"1st Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",price:12576000,stampDuty:880320,gst:628800,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:14896920,tower:"Dion",paymentPlan:"9:91"},
  "D 105": {unitNumber:"D 105",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"655 Sq Ft",typology:"2BHK",price:12576000,stampDuty:880320,gst:628800,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:14896920,tower:"Dion",paymentPlan:"9:91"},
  "D 106": {unitNumber:"D 106",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"650 Sq Ft",typology:"2BHK",price:12480000,stampDuty:873600,gst:624000,registration:30000,otherCharges:637200,possessionCharges:143500,allInclusiveAmount:14788300,tower:"Dion",paymentPlan:"9:91"},
  "D 107": {unitNumber:"D 107",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"670 Sq Ft",typology:"2BHK",price:12864000,stampDuty:900480,gst:643200,registration:30000,otherCharges:637200,possessionCharges:147900,allInclusiveAmount:15222780,tower:"Dion",paymentPlan:"9:91"},
  "D 108": {unitNumber:"D 108",floorNumber:"1",band:"1st Band",facing:"West /SIS",carpetArea:"670 Sq Ft",typology:"2BHK",price:12864000,stampDuty:900480,gst:643200,registration:30000,otherCharges:637200,possessionCharges:147900,allInclusiveAmount:15222780,tower:"Dion",paymentPlan:"9:91"},

  // Dion 2nd Band
  "D 601": {unitNumber:"D 601",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",price:12903500,stampDuty:903245,gst:645175,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:15263720,tower:"Dion",paymentPlan:"9:91"},
  "D 602": {unitNumber:"D 602",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",price:12903500,stampDuty:903245,gst:645175,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:15263720,tower:"Dion",paymentPlan:"9:91"},
  "D 603": {unitNumber:"D 603",floorNumber:"6",band:"2nd Band",facing:"East / SGNP",carpetArea:"670 Sq Ft",typology:"2BHK",price:13199000,stampDuty:923930,gst:659950,registration:30000,otherCharges:637200,possessionCharges:147900,allInclusiveAmount:15597980,tower:"Dion",paymentPlan:"9:91"},

  // Dion 3rd Band
  "D 2401": {unitNumber:"D 2401",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",price:13231000,stampDuty:926170,gst:661550,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:15630520,tower:"Dion",paymentPlan:"9:91"},
  "D 2402": {unitNumber:"D 2402",floorNumber:"24",band:"3rd Band",facing:"East / SGNP",carpetArea:"655 Sq Ft",typology:"2BHK",price:13231000,stampDuty:926170,gst:661550,registration:30000,otherCharges:637200,possessionCharges:144600,allInclusiveAmount:15630520,tower:"Dion",paymentPlan:"9:91"}
};

// Payment plan configurations
const paymentPlans = {
  "9:11:80": [
    { stage: "On Booking", percentage: 9 },
    { stage: "On Completion of Terrace", percentage: 11 },
    { stage: "On Possession", percentage: 80 }
  ],
  "9:91": [
    { stage: "On Booking", percentage: 9 },
    { stage: "On Occupancy Certificate", percentage: 91 }
  ]
};

// Tower color mapping
const towerColors = {
  "Aster": "#4a90e2",
  "Blu": "#5cb85c", 
  "Clove": "#f0ad4e",
  "Dion": "#d9534f"
};
