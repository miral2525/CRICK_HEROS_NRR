// import express from "express";
// import cors from "cors";
// import matchRoutes from "./matchrouters.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/match", matchRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend Running...");
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Utility: convert overs like 49.2 -> 49 + 2/6 = 49.333...
function normaliseOvers(overs) {
  // overs may already be a number like 49.333 or a "49.2" style
  if (typeof overs === 'number') return overs;
  if (typeof overs === 'string' && overs.includes('.')) {
    const [whole, balls] = overs.split('.');
    const w = Number(whole) || 0;
    const b = Number(balls) || 0;
    return w + b / 6;
  }
  return Number(overs) || 0;
}

function computeNRRFromTotals(runsFor, oversFaced, runsAgainst, oversBowled) {
  const ofs = normaliseOvers(oversFaced);
  const obs = normaliseOvers(oversBowled);
  // Avoid division by zero
  const rpoFor = ofs > 0 ? runsFor / ofs : 0;
  const rpoAgainst = obs > 0 ? runsAgainst / obs : 0;
  const nrr = rpoFor - rpoAgainst;
  return Number(nrr.toFixed(3));
}

app.post('/api/nrr', (req, res) => {
  const body = req.body || {};
  let nrr = 0;

  if (body.mode === 'matches' && Array.isArray(body.matches)) {
    // Sum totals across matches
    let runsFor = 0, runsAgainst = 0, oversFaced = 0, oversBowled = 0;
    for (const m of body.matches) {
      runsFor += Number(m.runsFor || 0);
      runsAgainst += Number(m.runsAgainst || 0);
      oversFaced += normaliseOvers(m.oversFaced || 0);
      oversBowled += normaliseOvers(m.oversBowled || 0);
    }
    nrr = computeNRRFromTotals(runsFor, oversFaced, runsAgainst, oversBowled);
  } else {
    // summary mode
    const runsFor = Number(body.runsFor || 0);
    const runsAgainst = Number(body.runsAgainst || 0);
    const oversFaced = body.oversFaced || 0;
    const oversBowled = body.oversBowled || 0;
    nrr = computeNRRFromTotals(runsFor, oversFaced, runsAgainst, oversBowled);
  }

  return res.json({ nrr });
});

const PORT = process.env.PORT || 5000;

/* mandatory: server-side visible testcases printed at startup */
function runServerTests() {
  console.log('--- NRR Server Test Cases (console) ---');

  // Test case 1: single summary
  const t1 = computeNRRFromTotals(250, '50.0', 240, '50.0'); // (5.0 - 4.8) = 0.2
  console.log('Test 1 (summary): runsFor=250 oversFaced=50.0 runsAgainst=240 oversBowled=50.0 => NRR =', t1, '(expected 0.200)');

  // Test case 2: overs with balls notation
  const t2 = computeNRRFromTotals(120, '20.0', 125, '20.0'); // 6 - 6.25 = -0.25
  console.log('Test 2 (summary): runsFor=120 oversFaced=20.0 runsAgainst=125 oversBowled=20.0 => NRR =', t2, '(expected -0.250)');

  // Test case 3: T20 where overs like 19.3 mean 19 overs + 3 balls
  const t3 = computeNRRFromTotals(175, '19.3', 172, '20.0'); // convert 19.3 -> 19+3/6=19.5
  console.log('Test 3 (ball-notation): runsFor=175 oversFaced=19.3 runsAgainst=172 oversBowled=20.0 => NRR =', t3);

  // Test case 4: matches list
  const matches = [
    { runsFor: 250, oversFaced: '50.0', runsAgainst: 220, oversBowled: '50.0' },
    { runsFor: 180, oversFaced: '45.0', runsAgainst: 185, oversBowled: '45.0' }
  ];
  let rf = 0, ra = 0, of = 0, ob = 0;
  matches.forEach(m => {
    rf += m.runsFor; ra += m.runsAgainst; of += normaliseOvers(m.oversFaced); ob += normaliseOvers(m.oversBowled);
  });
  const t4 = computeNRRFromTotals(rf, of, ra, ob);
  console.log('Test 4 (matches sum): aggregated NRR =', t4);

  console.log('--- End Server Tests ---\n');
}

app.listen(PORT, () => {
  console.log(`NRR server listening on port ${PORT}`);
  runServerTests();
});
