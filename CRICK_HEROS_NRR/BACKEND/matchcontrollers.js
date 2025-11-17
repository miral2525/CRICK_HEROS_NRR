import matches from "./match.js";

// Add match
export const addMatch = (req, res) => {
  const { teamA, teamB, runsA, runsB, oversA, oversB } = req.body;

  const newMatch = {
    id: Date.now(),
    teamA,
    teamB,
    runsA,
    runsB,
    oversA,
    oversB
  };

  matches.push(newMatch);
  res.status(201).json(newMatch);
};

// Get all matches
export const getMatches = (req, res) => {
  res.json(matches);
};
