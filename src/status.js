export function clientUpdate(incident, analysis) {
  const stage = incident.status === "Resolved" ? "resolved" : incident.status === "Monitoring" ? "under monitoring" : "actively investigating";
  const next = incident.status === "Resolved" ? "We are preparing the post-incident review and prevention actions." : analysis.breach === "At risk" || analysis.breach === "Breached" ? "Our incident lead is prioritizing recovery and will provide the next update shortly." : "The team is continuing recovery work and will share the next confirmed milestone.";
  return { stage, next, summary: `Elite Era Development is ${stage} the reported ${incident.service.toLowerCase()} issue. ${incident.impact}` };
}
