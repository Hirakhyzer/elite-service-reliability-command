export function ownershipCoverage(incidents) {
  const active = incidents.filter((incident) => incident.status !== "Resolved");
  const assigned = active.filter((incident) => incident.assigneeId).length;
  const coverage = active.length ? assigned / active.length * 100 : 100;
  const unassigned = active.filter((incident) => !incident.assigneeId).map((incident) => incident.id);
  return { active: active.length, assigned, unassigned, coverage, healthy: coverage === 100 };
}
