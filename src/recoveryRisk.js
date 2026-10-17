export function recoveryRisk(incident) {
  const steps = incident.recovery || [];
  if (!steps.length) return { score: 100, band: "Critical", incomplete: 0, completion: 0 };
  const complete = steps.filter((step) => step.done).length;
  const incomplete = steps.length - complete;
  const completion = complete / steps.length * 100;
  const score = Math.round(Math.max(0, 100 - completion));
  return { score, band: score >= 70 ? "Critical" : score >= 40 ? "High" : score >= 15 ? "Watch" : "Low", incomplete, completion };
}
