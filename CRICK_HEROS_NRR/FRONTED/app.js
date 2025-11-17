import React, { useState } from "react";
import MatchForm from "./matchform.js";
import ResultCard from "./resultcard.js";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>CricHeroes NRR Calculator</h1>
      <MatchForm onResult={(res) => setResult(res)} />
      {result && <ResultCard data={result} />}
    </div>
  );
}

const styles = {
  container: {
    width: "70%",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
};
