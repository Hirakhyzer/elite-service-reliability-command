import { incidentAnalysis } from "./logic";

export function communicationCadence(incident, now) {
  const analysis = incidentAnalysis(incident, now);
  if (incident.status === "Resolved") return { minutes: null, label: "Closure update", required: true };
  if (incident.severity === "Critical" || analysis.breach === "Breached") return { minutes: 30, label: "30-minute cadence", required: true };
  if (incident.severity === "High" || analysis.breach === "At risk") return { minutes: 60, label: "Hourly cadence", required: true };
  if (analysis.breach === "Watch") return { minutes: 120, label: "Two-hour cadence", required: true };
  return { minutes: 240, label: "Four-hour cadence", required: false };
}
