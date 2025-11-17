import React, { useState } from "react";
import { calculateMatchNRR } from "./matchapi.js";

export default function MatchForm({ onResult }) {
  const [form, setForm] = useState({
    team: "",
    opponent: "",
    overs: "",
    desiredPosition: "",
    toss: "",
    runs: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await calculateMatchNRR(form);
    onResult(result);
  };

  return (
    <div style={styles.card}>
      <h3>Enter Match Details</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Your Team:
          <input name="team" onChange={handleChange} required />
        </label>

        <label>
          Opposition Team:
          <input name="opponent" onChange={handleChange} required />
        </label>

        <label>
          Match Overs:
          <input type="number" name="overs" onChange={handleChange} required />
        </label>

        <label>
          Desired Position:
          <input type="number" name="desiredPosition" onChange={handleChange} required />
        </label>

        <label>
          Toss Result:
          <select name="toss" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="bat">Batting First</option>
            <option value="bowl">Bowling First</option>
          </select>
        </label>

        <label>
          Runs Scored/Chasing:
          <input type="number" name="runs" onChange={handleChange} required />
        </label>

        <button style={styles.btn}>Calculate NRR</button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    background: "#f4f4f4",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  btn: {
    padding: "10px",
    fontSize: "16px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
