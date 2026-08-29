"use client";

import { useAgentActivity } from "@/components/activity-provider";

export function AgentActivityPanel() {
  const { activities } = useAgentActivity();
  return (
    <aside className="activity-panel" aria-live="polite">
      <div className="eyebrow">SHARED WITH YOUR AGENT</div>
      <h2>Agent activity</h2>
      <p className="muted">Your chosen profile context and your agent’s actions appear here in real time.</p>
      {activities.length === 0 ? (
        <div className="activity-empty"><span>✦</span> Waiting for your agent’s first request.</div>
      ) : <ol className="activity-list">{activities.map((item) => (
        <li key={item.id}><span className={`activity-dot ${item.kind}`} />
          <div><strong>{item.title}</strong><p>{item.detail}</p></div>
        </li>
      ))}</ol>}
    </aside>
  );
}
