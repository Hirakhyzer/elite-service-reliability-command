import { incidentAnalysis } from "./logic";

export function priorityQueue(incidents, now) {
  return incidents.filter((incident) => incident.status !== "Resolved").map((incident) => {
    const analysis = incidentAnalysis(incident, now);
    const priorityScore = analysis.score + analysis.impact * .45 + (!incident.assigneeId ? 15 : 0);
    return { incident, analysis, priorityScore: Math.round(priorityScore) };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}
