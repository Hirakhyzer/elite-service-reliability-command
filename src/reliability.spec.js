import { describe, expect, it } from "vitest";
import { cloneInitialState } from "./data";
import { assignmentOptions, serviceSummary } from "./analytics";
import { incidentAnalysis, slaFor } from "./logic";

describe("service reliability engine", () => {
  it("calculates SLA deadlines for tiered clients", () => {
    const incident = cloneInitialState().incidents[0];
    const sla = slaFor(incident);
    expect(sla.responseMinutes).toBe(30);
    expect(sla.resolutionHours).toBe(4);
  });
  it("raises risk for a critical active incident", () => {
    const incident = cloneInitialState().incidents[0];
    const analysis = incidentAnalysis(incident);
    expect(analysis.score).toBeGreaterThan(35);
    expect(["Watch", "At risk", "Breached"]).toContain(analysis.breach);
  });
  it("ranks service engineers using skills and capacity", () => {
    const state = cloneInitialState();
    const options = assignmentOptions(state.incidents[1], state.engineers);
    expect(options).toHaveLength(state.engineers.length);
    expect(options[0].score).toBeGreaterThanOrEqual(options[1].score);
  });
  it("summarizes active and resolved incidents", () => {
    const summary = serviceSummary(cloneInitialState().incidents);
    expect(summary.active.length).toBeGreaterThan(0);
    expect(summary.resolved.length).toBeGreaterThan(0);
    expect(summary.byClient.length).toBeGreaterThan(0);
  });
});
