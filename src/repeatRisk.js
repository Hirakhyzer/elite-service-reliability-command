export function recurringIncidentRisk(incidents) {
  const groups = incidents.reduce((acc, incident) => {
    const key = `${incident.client}::${incident.category}`;
    acc[key] = acc[key] || { client: incident.client, category: incident.category, count: 0, critical: 0 };
    acc[key].count += 1;
    acc[key].critical += incident.severity === "Critical" ? 1 : 0;
    return acc;
  }, {});
  return Object.values(groups).filter((group) => group.count > 1).map((group) => ({ ...group, score: Math.min(100, group.count * 22 + group.critical * 20) })).sort((a, b) => b.score - a.score);
}
