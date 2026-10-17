const weight = { Critical: 4, High: 3, Medium: 2, Low: 1 };

export function clientImpact(incidents) {
  const rows = Object.values(incidents.reduce((acc, incident) => {
    const row = acc[incident.client] || { client: incident.client, incidents: 0, affectedUsers: 0, severityPoints: 0 };
    row.incidents += 1;
    row.affectedUsers += Number(incident.affectedUsers) || 0;
    row.severityPoints += weight[incident.severity] || 1;
    acc[incident.client] = row;
    return acc;
  }, {}));
  return rows.map((row) => ({ ...row, impactScore: Math.round(row.severityPoints * 12 + Math.min(50, Math.log2(row.affectedUsers + 1) * 5)) })).sort((a, b) => b.impactScore - a.impactScore);
}
