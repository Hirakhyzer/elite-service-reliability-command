export function postmortemReadiness(incident) {
  const checks = [
    ["resolved", incident.status === "Resolved"],
    ["rootCause", Boolean(incident.rootCause?.trim?.())],
    ["owner", Boolean(incident.assigneeId)],
    ["responseTimestamp", Boolean(incident.firstResponseAt)],
    ["recoveryPlan", Boolean(incident.recovery?.length)],
    ["recoveryComplete", Boolean(incident.recovery?.length) && incident.recovery.every((step) => step.done)],
  ];
  const completed = checks.filter(([, value]) => value).length;
  const missing = checks.filter(([, value]) => !value).map(([name]) => name);
  const score = Math.round(completed / checks.length * 100);
  return { score, ready: score === 100, missing };
}
