import { incidentAnalysis } from "./logic";

export function assignmentOptions(incident, engineers) {
  return engineers.map((engineer) => {
    const match = incident.skills.length ? incident.skills.filter((skill) => engineer.skills.includes(skill)).length / incident.skills.length : 1;
    const free = Math.max(0, engineer.capacity - engineer.committed) / Math.max(1, engineer.capacity);
    const availability = engineer.availability === "Available" ? 1 : engineer.availability === "Limited" ? .55 : 0;
    return { ...engineer, match, free, score: Math.round(match * 68 + free * 22 + availability * 10) };
  }).sort((a, b) => b.score - a.score);
}

export function serviceSummary(incidents) {
  const analyses = incidents.map((incident) => ({ incident, analysis: incidentAnalysis(incident) }));
  const active = analyses.filter((item) => item.incident.status !== "Resolved");
  const atRisk = analyses.filter((item) => ["At risk", "Breached"].includes(item.analysis.breach));
  const breached = analyses.filter((item) => item.analysis.breach === "Breached");
  const resolved = analyses.filter((item) => item.incident.status === "Resolved");
  const mtta = resolved.length ? resolved.reduce((sum, item) => sum + item.analysis.responseHours, 0) / resolved.length : 0;
  const mttr = resolved.length ? resolved.reduce((sum, item) => sum + item.analysis.ageHours, 0) / resolved.length : 0;
  const repeat = Object.entries(incidents.reduce((all, incident) => ({ ...all, [incident.category]: (all[incident.category] || 0) + 1 }), {})).filter(([, count]) => count > 1).map(([category, count]) => ({ category, count }));
  const byClient = Object.values(incidents.reduce((all, incident) => {
    const current = all[incident.client] || { client: incident.client, total: 0, active: 0, critical: 0, breached: 0 };
    current.total += 1;
    current.active += incident.status !== "Resolved" ? 1 : 0;
    current.critical += incident.severity === "Critical" ? 1 : 0;
    current.breached += incidentAnalysis(incident).breach === "Breached" ? 1 : 0;
    all[incident.client] = current;
    return all;
  }, {}));
  return { analyses, active, atRisk, breached, resolved, mtta, mttr, repeat, byClient };
}

export function recoveryGuidance(incident, analysis) {
  const actions = [];
  if (!incident.assigneeId) actions.push({ title: "Assign a technical owner", detail: "Unassigned work increases breach risk and slows recovery." });
  if (incident.severity === "Critical" || analysis.impact >= 70) actions.push({ title: "Send a client-safe update", detail: "Confirm impact, current action, and next communication time." });
  if (["At risk", "Breached"].includes(analysis.breach)) actions.push({ title: "Run a recovery cadence", detail: "Name an incident lead and publish short owner-based recovery actions." });
  if (incident.status === "Resolved" && !incident.rootCause) actions.push({ title: "Complete root-cause review", detail: "Document the technical cause and prevention action before final closure." });
  return actions.length ? actions : [{ title: "Continue active monitoring", detail: "Operational indicators are currently within the planned service window." }];
}
