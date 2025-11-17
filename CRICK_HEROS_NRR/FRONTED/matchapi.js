import axios from "axios";

const API_BASE = "http://localhost:5000/api/nrr";

export async function calculateMatchNRR(payload) {
  try {
    const response = await axios.post(`${API_BASE}/calculate`, payload);
    return response.data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
