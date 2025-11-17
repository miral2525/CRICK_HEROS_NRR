import React from "react";

export default function ResultCard({ data }) {
  return (
    <div style={styles.card}>
      <h2>Match NRR Result</h2>

      <p><strong>Scenario:</strong> {data.scenario}</p>
      <p><strong>Required Range:</strong> {data.range}</p>
      <p><strong>Revised NRR:</strong> {data.nrrRange}</p>

      <div style={styles.box}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    background: "#e3ffe7",
    borderRadius: "10px",
    border: "2px solid #00cc66",
  },
  box: {
    background: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "15px",
  },
};
