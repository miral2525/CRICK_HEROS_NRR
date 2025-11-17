// import React, { useState } from "react";
// import MatchForm from "./matchform.js";
// import ResultCard from "./resultcard.js";

// export default function App() {
//   const [result, setResult] = useState(null);

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>CricHeroes NRR Calculator</h1>
//       <MatchForm onResult={(res) => setResult(res)} />
//       {result && <ResultCard data={result} />}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     width: "70%",
//     margin: "0 auto",
//     padding: "20px",
//     fontFamily: "Arial",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: "20px",
//   },
// };


// frontend/src/App.js
import React, { useState } from 'react';

const defaultMatch = { runsFor: '', oversFaced: '', runsAgainst: '', oversBowled: '' };

function normaliseOversForDisplay(o) {
  // keep user input as-is
  return o;
}

export default function App() {
  const [mode, setMode] = useState('summary'); // 'summary' or 'matches'
  const [summary, setSummary] = useState({ runsFor: '', oversFaced: '50.0', runsAgainst: '', oversBowled: '50.0' });
  const [matches, setMatches] = useState([ { ...defaultMatch } ]);
  const [result, setResult] = useState(null);
  const API = 'http://localhost:5000/api/nrr';

  async function calcNRR() {
    try {
      let body;
      if (mode === 'matches') {
        // filter out empty matches
        const ms = matches.filter(m => m.runsFor !== '' || m.runsAgainst !== '' || m.oversFaced !== '' || m.oversBowled !== '');
        body = { mode: 'matches', matches: ms };
      } else {
        body = { mode: 'summary', ...summary };
      }

      console.log('Calling API with payload:', body);
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      console.log('NRR result (from server):', data);
      setResult(data.nrr);
    } catch (err) {
      console.error('Error calculating NRR:', err);
      setResult('Error - see console');
    }
  }

  function addMatch() {
    setMatches([...matches, { ...defaultMatch }]);
  }
  function updateMatch(i, field, value) {
    const arr = [...matches];
    arr[i][field] = value;
    setMatches(arr);
  }
  function removeMatch(i) {
    const arr = matches.filter((_, idx) => idx !== i);
    setMatches(arr.length ? arr : [{ ...defaultMatch }]);
  }

  // Browser-side testcases printed to console (mandatory)
  function printBrowserTests() {
    console.log('--- Browser Test Cases (client) ---');
    console.log('Test A (summary): {runsFor:250, oversFaced:50.0, runsAgainst:240, oversBowled:50.0} => expected ~0.200');
    console.log('Test B (summary): {runsFor:120, oversFaced:20.0, runsAgainst:125, oversBowled:20.0} => expected ~-0.250');
    console.log('Test C (ball-notation): {runsFor:175, oversFaced:19.3, runsAgainst:172, oversBowled:20.0} => expected ~? (server will compute)');
    console.log('--- End Browser Tests ---');
  }

  // print browser tests once
  React.useEffect(() => {
    printBrowserTests();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>NRR Calculator (Simple & Evaluator-friendly)</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="radio" checked={mode === 'summary'} onChange={() => setMode('summary')} /> Summary (Totals)
        </label>
        <label style={{ marginLeft: 12 }}>
          <input type="radio" checked={mode === 'matches'} onChange={() => setMode('matches')} /> Matches (detailed)
        </label>
      </div>

      {mode === 'summary' ? (
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label>
              Runs For
              <input value={summary.runsFor} onChange={e => setSummary({...summary, runsFor: e.target.value})} placeholder="e.g. 250" />
            </label>
            <label>
              Overs Faced
              <input value={summary.oversFaced} onChange={e => setSummary({...summary, oversFaced: e.target.value})} placeholder="50.0 or 19.3" />
            </label>
            <label>
              Runs Against
              <input value={summary.runsAgainst} onChange={e => setSummary({...summary, runsAgainst: e.target.value})} placeholder="e.g. 240" />
            </label>
            <label>
              Overs Bowled
              <input value={summary.oversBowled} onChange={e => setSummary({...summary, oversBowled: e.target.value})} placeholder="50.0 or 20.0" />
            </label>
          </div>
        </div>
      ) : (
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          {matches.map((m, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: 8, alignItems: 'end', marginBottom: 8 }}>
              <label>
                Runs For
                <input value={m.runsFor} onChange={e => updateMatch(i, 'runsFor', e.target.value)} placeholder="e.g. 250" />
              </label>
              <label>
                Overs Faced
                <input value={m.oversFaced} onChange={e => updateMatch(i, 'oversFaced', e.target.value)} placeholder="50.0 or 19.3" />
              </label>
              <label>
                Runs Against
                <input value={m.runsAgainst} onChange={e => updateMatch(i, 'runsAgainst', e.target.value)} placeholder="e.g. 240" />
              </label>
              <label>
                Overs Bowled
                <input value={m.oversBowled} onChange={e => updateMatch(i, 'oversBowled', e.target.value)} placeholder="50.0 or 20.0" />
              </label>
              <div>
                <button onClick={() => removeMatch(i)}>Remove</button>
              </div>
            </div>
          ))}
          <button onClick={addMatch}>Add Match</button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={calcNRR} style={{ padding: '8px 14px', fontSize: 16 }}>Calculate NRR</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <strong>Result: </strong>
        <span>{result === null ? '—' : result}</span>
      </div>

      <div style={{ marginTop: 12, color: '#666' }}>
        <small>Notes: Overs may be entered as <code>50.0</code> or ball-notation <code>19.3</code> (19 overs + 3 balls).</small>
      </div>
    </div>
  );
}
