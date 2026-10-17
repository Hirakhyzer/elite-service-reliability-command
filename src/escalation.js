import { incidentAnalysis } from "./logic";

export function escalationPolicy(incident, now) {
  const analysis = incidentAnalysis(incident, now);
  const levels = [];
  if (!incident.assigneeId) levels.push("Technical owner");
  if (incident.severity === "Critical" || analysis.impact >= 70) levels.push("Service lead");
  if (["At risk", "Breached"].includes(analysis.breach)) levels.push("Operations manager");
  if (analysis.breach === "Breached" && incident.tier === "Platinum") levels.push("Executive sponsor");
  return {
    required: levels.length > 0,
    levels: [...new Set(levels)],
    clientUpdateRequired: incident.severity === "Critical" || analysis.breach === "Breached",
    reason: levels.length ? `${analysis.breach} SLA posture with ${incident.severity.toLowerCase()} severity.` : "Incident remains inside normal operating controls.",
  };
}
