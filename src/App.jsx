import { useEffect, useMemo, useState } from "react";
import { cloneInitialState } from "./data";
import { assignmentOptions, serviceSummary } from "./analytics";
import { incidentAnalysis, dateTime } from "./logic";
import { Dashboard } from "./Dashboard";
import { Workbench } from "./Workbench";
import { ClientStatus } from "./ClientStatus";
import { Reports } from "./Reports";
import { Button } from "./ui";

const KEY = "elite-service-reliability-command-v1";
const clone = (value) => JSON.parse(JSON.stringify(value));

function loadWorkspace() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    const fresh = cloneInitialState();
    return saved ? { ...fresh, ...saved, incidents: Array.isArray(saved.incidents) ? saved.incidents : fresh.incidents, engineers: Array.isArray(saved.engineers) ? saved.engineers : fresh.engineers, savedReports: Array.isArray(saved.savedReports) ? saved.savedReports : [] } : fresh;
  } catch { return cloneInitialState(); }
}

export default function App() {
  const [state, setState] = useState(loadWorkspace);
  const [tab, setTab] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(() => loadWorkspace().incidents[0]?.id || "");
  const [toast, setToast] = useState("");
  const selected = state.incidents.find((item) => item.id === selectedId) || state.incidents[0];
  const selectedAnalysis = useMemo(() => incidentAnalysis(selected), [selected]);
  const summary = useMemo(() => serviceSummary(state.incidents), [state.incidents]);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(""), 2600); return () => window.clearTimeout(timer); }, [toast]);
  const notify = (message) => setToast(message);
  const selectIncident = (id) => setSelectedId(id);

  function patchIncident(id, changes) {
    if (id === "new") {
      setState((current) => ({ ...current, incidents: [changes, ...current.incidents] }));
      setSelectedId(changes.id);
      notify("New incident created and SLA tracking started");
      return;
    }
    setState((current) => ({ ...current, incidents: current.incidents.map((incident) => incident.id === id ? { ...incident, ...changes } : incident) }));
    notify("Incident record updated");
  }

  function applyBestAssignment() {
    const options = assignmentOptions(selected, state.engineers);
    if (!options[0]) return;
    patchIncident(selected.id, { assigneeId: options[0].id });
    notify(`${options[0].name} assigned as recommended owner`);
  }

  function toggleRecovery(incidentId, stepId) {
    const incident = state.incidents.find((item) => item.id === incidentId);
    if (!incident) return;
    patchIncident(incidentId, { recovery: incident.recovery.map((step) => step.id === stepId ? { ...step, done: !step.done } : step) });
  }

  function addClientUpdate(incidentId, message) {
    const incident = state.incidents.find((item) => item.id === incidentId);
    if (!incident) return;
    patchIncident(incidentId, { updates: [...incident.updates, { time: new Date().toISOString(), message, visibility: "Client" }] });
  }

  function reportText() {
    return [
      "ELITE ERA DEVELOPMENT L.L.C — SERVICE RELIABILITY REPORT",
      "Made by Hira Khyzer",
      "",
      `Incident: ${selected.title}`,
      `Client: ${selected.client}`,
      `Tier: ${selected.tier}`,
      `Severity: ${selected.severity}`,
      `Status: ${selected.status}`,
      "",
      "--- SLA POSITION ---",
      `Response deadline: ${dateTime(selectedAnalysis.sla.responseDue)}`,
      `Resolution deadline: ${dateTime(selectedAnalysis.sla.resolutionDue)}`,
      `Breach signal: ${selectedAnalysis.breach}`,
      `Breach risk: ${selectedAnalysis.score}/100`,
      `Client impact: ${selectedAnalysis.impact}/100`,
      "",
      "--- RECOVERY CHECKLIST ---",
      ...selected.recovery.map((step) => `- ${step.done ? "Done" : "Open"}: ${step.title} (${step.owner})`),
      "",
      "--- ROOT CAUSE ---",
      selected.rootCause || "Pending review.",
      "",
      "--- PREVENTION ---",
      selected.prevention || "Pending prevention action.",
      "",
    ].join("\n");
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportText() { download("elite-service-reliability-report.txt", reportText(), "text/plain"); notify("TXT reliability report downloaded"); }
  function exportJson() { download("elite-service-reliability-analysis.json", JSON.stringify({ generatedAt: new Date().toLocaleString(), company: "Elite Era Development L.L.C", incident: selected, analysis: selectedAnalysis }, null, 2), "application/json"); notify("JSON incident analysis downloaded"); }
  function saveReport() { const report = { id: `report-${Date.now()}`, title: selected.title, client: selected.client, status: selected.status, breach: selectedAnalysis.breach, score: selectedAnalysis.score, createdAt: new Date().toLocaleString() }; setState((current) => ({ ...current, savedReports: [report, ...current.savedReports].slice(0, 20) })); notify("Incident snapshot saved"); }
  function removeReport(id) { setState((current) => ({ ...current, savedReports: current.savedReports.filter((item) => item.id !== id) })); notify("Saved snapshot removed"); }
  function resetWorkspace() { if (!window.confirm("Reset all service reliability demo data in this browser?")) return; const reset = cloneInitialState(); setState(reset); setSelectedId(reset.incidents[0].id); setTab("dashboard"); notify("Demo workspace reset"); }

  const tabs = [["dashboard", "Command center", "◆"], ["incidents", "Incident workbench", "◫"], ["client", "Client status", "▣"], ["reports", "Reports", "▤"]];
  const shared = { state, summary, selected, selectedAnalysis, setTab, selectIncident, patchIncident, applyBestAssignment, toggleRecovery, addClientUpdate, saveReport, removeReport, exportText, exportJson, resetWorkspace };
  const pages = { dashboard: <Dashboard {...shared}/>, incidents: <Workbench {...shared}/>, client: <ClientStatus {...shared}/>, reports: <Reports {...shared}/> };

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">E</div><div><span>Elite Era Development L.L.C</span><strong>Service Reliability</strong></div></div><nav>{tabs.map(([id, label, icon]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><i>{icon}</i>{label}</button>)}</nav><div className="side-card"><span>Selected incident</span><strong>{selected.client}</strong><small>{selectedAnalysis.score}/100 risk · {selectedAnalysis.breach}</small><div><i className={selectedAnalysis.breach === "Safe" ? "good" : selectedAnalysis.breach === "Watch" ? "watch" : "risk"}/><b>{selected.status}</b><em>{selected.tier}</em></div></div><div className="profile"><span>HK</span><div><strong>Hira Khyzer</strong><small>Founder · Elite Era</small></div></div></aside><main className="workspace"><header className="topbar"><div><p>Service operations and reliability system</p><h2>{selected.title}</h2></div><div><span className="saved">● Saved locally</span><Button variant="outline" onClick={exportText}>Export report</Button><Button onClick={applyBestAssignment}>Smart assign</Button></div></header><div className="mobile-tabs">{tabs.map(([id,label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}</div><section className="content">{pages[tab]}</section><footer className="footer"><strong>Made by Hira Khyzer</strong><span>Elite Era Development L.L.C</span><b>#f4af00</b></footer></main>{toast && <div className="toast">{toast}</div>}</div>;
}
