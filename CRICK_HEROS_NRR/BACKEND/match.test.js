import assert from "assert";
import { calculateNRR } from "../models/Match.js";


assert.strictEqual(calculateNRR(150, 20, 140, 20), "0.500");
assert.strictEqual(calculateNRR(200, 20, 180, 20), "1.000");
assert.strictEqual(calculateNRR(100, 20, 120, 20), "-1.000");


console.log("All backend tests passed ✔");