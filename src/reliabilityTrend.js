export function reliabilityTrend(periods) {
  if (!periods.length) return { direction: "Stable", delta: 0, average: 0, volatility: 0 };
  const scores = periods.map((period) => Number(period.score) || 0);
  const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const delta = scores.at(-1) - scores[0];
  const variance = scores.reduce((sum, value) => sum + (value - average) ** 2, 0) / scores.length;
  const direction = delta > 3 ? "Improving" : delta < -3 ? "Declining" : "Stable";
  return { direction, delta, average, volatility: Math.sqrt(variance) };
}
