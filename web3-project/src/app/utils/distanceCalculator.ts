export const calculateDistance = (entryStation: string, exitStation: string): number => {
  const distances: { [key: string]: number } = {
    "Station A-Station B": 2,
    "Station A-Station C": 4,
    "Station B-Station C": 3,
  };

  const key = `${entryStation}-${exitStation}`;
  return distances[key] || 0;
};
