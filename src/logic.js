import { NOW, SLA } from "./data";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toDate = (value) => new Date(value);
const hoursBetween = (start, end) => Math.max(0, (toDate(end).getTime() - toDate(start).getTime()) / 3600000);
const addMinutes = (value, minutes) => new Date(toDate(value).getTime() + minutes * 60000).toISOString();
const priority = { Critical: 4, High: 3, Medium: 2, Low: 1 };

export const percent = (value) => `${Math.round(Number(value) || 0)}%`;
export const dateTime = (value) => value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "—";

export function slaFor(incident) {
  const policy = SLA[incident.tier] || SLA.Standard;
  return {
    ...policy,
    responseDue: addMinutes(incident.openedAt, policy.responseMinutes),
    resolutionDue: addMinutes(incident.openedAt, policy.resolutionHours * 60),
  };
}

export function incidentAnalysis(incident, now = NOW) {
  const sla = slaFor(incident);
  const reference = incident.resolvedAt || now;
  const ageHours = hoursBetween(incident.openedAt, reference);
  const responseHours = incident.firstResponseAt ? hoursBetween(incident.openedAt, incident.firstResponseAt) : hoursBetween(incident.openedAt, now);
  const responseRatio = responseHours / Math.max(.1, sla.responseMinutes / 60);
  const resolutionRatio = ageHours / Math.max(1, sla.resolutionHours);
  const severityWeight = (priority[incident.severity] || 1) * 7;
  const userWeight = Math.min(18, Math.log2((incident.affectedUsers || 0) + 1) * 3);
  const score = Math.round(clamp(resolutionRatio * 42 + responseRatio * 18 + severityWeight + userWeight + (incident.assigneeId ? 0 : 11) + (incident.status === "New" ? 8 : 0), 0, 100));
  const breach = incident.status === "Resolved" ? (ageHours > sla.resolutionHours ? "Breached" : "Met") : score >= 88 ? "Breached" : score >= 65 ? "At risk" : score >= 35 ? "Watch" : "Safe";
  const impact = Math.round(clamp((priority[incident.severity] || 1) * 18 + userWeight * 1.6 + 8, 0, 100));
  const completion = incident.recovery?.length ? incident.recovery.filter((step) => step.done).length / incident.recovery.length * 100 : 0;
  return { sla, ageHours, responseHours, score, breach, impact, completion, responseMet: responseHours <= sla.responseMinutes / 60 };
}
