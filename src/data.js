export const NOW = "2026-07-01T09:00:00";

export const SLA = {
  Platinum: { responseMinutes: 30, resolutionHours: 4 },
  Gold: { responseMinutes: 120, resolutionHours: 8 },
  Standard: { responseMinutes: 480, resolutionHours: 24 },
};

export const SKILLS = ["Frontend", "Backend", "API", "DevOps", "Data", "AI", "QA", "Security", "Support"];
export const INCIDENT_STATUSES = ["New", "Investigating", "Mitigating", "Monitoring", "Resolved"];
export const SEVERITIES = ["Critical", "High", "Medium", "Low"];

export const initialState = {
  engineers: [
    { id: "hira", name: "Hira Khyzer", initials: "HK", role: "AI Systems Lead", skills: ["AI", "API", "Data", "Security"], capacity: 28, committed: 14, availability: "Available" },
    { id: "musa", name: "Musa Khan", initials: "MK", role: "Full-Stack Engineer", skills: ["Frontend", "Backend", "API", "DevOps"], capacity: 32, committed: 23, availability: "Limited" },
    { id: "nora", name: "Nora Lee", initials: "NL", role: "QA & Reliability Engineer", skills: ["QA", "Frontend", "Support", "DevOps"], capacity: 26, committed: 15, availability: "Available" },
    { id: "amina", name: "Amina Noor", initials: "AN", role: "Service Delivery Lead", skills: ["Support", "QA", "API"], capacity: 24, committed: 13, availability: "Available" },
  ],
  incidents: [
    { id: "inc-204", title: "Client portal login loop after SSO update", client: "Atlas Holdings", tier: "Platinum", service: "Operations Automation Portal", severity: "Critical", status: "Investigating", openedAt: "2026-07-01T06:40:00", firstResponseAt: "2026-07-01T06:58:00", resolvedAt: "", affectedUsers: 42, impact: "Client operations team cannot access approval workspace.", skills: ["Frontend", "API", "Security"], assigneeId: "", category: "Authentication", updates: [
      { time: "2026-07-01T06:58:00", message: "Elite Era acknowledged the incident and began investigation.", visibility: "Client" },
      { time: "2026-07-01T07:20:00", message: "SSO callback change isolated as likely trigger.", visibility: "Internal" },
    ], recovery: [
      { id: "r1", title: "Confirm affected login paths", owner: "Nora Lee", done: true },
      { id: "r2", title: "Roll back SSO callback configuration", owner: "Musa Khan", done: false },
      { id: "r3", title: "Validate client administrator login", owner: "Amina Noor", done: false },
    ], rootCause: "", prevention: "" },
    { id: "inc-203", title: "Delayed exception summaries in operations dashboard", client: "Lumen Logistics", tier: "Gold", service: "AI Exception Intelligence", severity: "High", status: "Mitigating", openedAt: "2026-07-01T03:10:00", firstResponseAt: "2026-07-01T03:46:00", resolvedAt: "", affectedUsers: 18, impact: "Morning operations summaries are delayed by approximately two hours.", skills: ["AI", "Data", "API"], assigneeId: "hira", category: "Data processing", updates: [
      { time: "2026-07-01T03:46:00", message: "Incident acknowledged; data queue review in progress.", visibility: "Client" },
      { time: "2026-07-01T06:20:00", message: "Backlog reduced and monitoring window started.", visibility: "Internal" },
    ], recovery: [
      { id: "r4", title: "Increase queue-worker capacity", owner: "Hira Khyzer", done: true },
      { id: "r5", title: "Reprocess delayed client summaries", owner: "Hira Khyzer", done: true },
      { id: "r6", title: "Confirm dashboard freshness with client", owner: "Amina Noor", done: false },
    ], rootCause: "Queue worker saturation after a higher-than-normal data import.", prevention: "Add saturation alert at 70% queue threshold and capacity test before scheduled import windows." },
    { id: "inc-202", title: "Invoice export timeout for finance administrators", client: "Forge Manufacturing", tier: "Standard", service: "Maintenance", severity: "Medium", status: "New", openedAt: "2026-06-30T18:00:00", firstResponseAt: "", resolvedAt: "", affectedUsers: 4, impact: "Finance team cannot export monthly invoice report.", skills: ["Backend", "API", "QA"], assigneeId: "", category: "Reporting", updates: [], recovery: [
      { id: "r7", title: "Reproduce timeout with latest report", owner: "Nora Lee", done: false },
      { id: "r8", title: "Inspect export query duration", owner: "Musa Khan", done: false },
    ], rootCause: "", prevention: "" },
    { id: "inc-201", title: "Campaign image upload validation error", client: "Verdant & Co.", tier: "Gold", service: "Growth Brand Program", severity: "Low", status: "Resolved", openedAt: "2026-06-28T10:20:00", firstResponseAt: "2026-06-28T11:05:00", resolvedAt: "2026-06-28T13:25:00", affectedUsers: 3, impact: "Marketing team could not upload a subset of large image files.", skills: ["Frontend", "QA"], assigneeId: "nora", category: "Upload validation", updates: [], recovery: [], rootCause: "Image validation limit did not match the documented upload policy.", prevention: "Centralize upload-policy limits and add boundary tests." },
  ],
  savedReports: [],
};

export function cloneInitialState() { return JSON.parse(JSON.stringify(initialState)); }
