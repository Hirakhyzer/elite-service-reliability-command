import { incidentAnalysis } from "./logic";

const severityMinutes = { Critical: 60, High: 30, Medium: 15, Low: 5 };

export function incidentBudgetCost(incident) {
  const analysis = incidentAnalysis(incident);
  const base = severityMinutes[incident.severity] || 5;
  const breachMultiplier = analysis.breach === "Breached" ? 2 : analysis.breach === "At risk" ? 1.35 : 1;
  const userMultiplier = 1 + Math.min(2, Math.log10((incident.affectedUsers || 0) + 1) / 2);
  return Math.round(base * breachMultiplier * userMultiplier);
}

export function errorBudgetReport(incidents, allowanceMinutes = 240) {
  if (allowanceMinutes <= 0) throw new Error("allowanceMinutes must be positive");
  const consumedMinutes = incidents.reduce((sum, incident) => sum + incidentBudgetCost(incident), 0);
  const remainingMinutes = Math.max(0, allowanceMinutes - consumedMinutes);
  const consumedPercent = consumedMinutes / allowanceMinutes * 100;
  const status = consumedPercent >= 100 ? "Exhausted" : consumedPercent >= 75 ? "Critical" : consumedPercent >= 50 ? "Watch" : "Healthy";
  return { allowanceMinutes, consumedMinutes, remainingMinutes, consumedPercent, status };
}
