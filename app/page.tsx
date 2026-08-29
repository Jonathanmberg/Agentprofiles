import { AgentLandingCard } from "@/components/agent-landing-card";

export default function Home() {
  return <main className="agent-landing">
    <div className="agent-wordmark">AGENTPROFILES <span>// <a href="https://x.com/jbtradin" target="_blank" rel="noreferrer">BY JONATHAN BERG</a></span></div>
    <a className="agent-enter" href="/demo">ENTER DEMO</a>
    <AgentLandingCard />
  </main>;
}
