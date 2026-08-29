"use client";

import { useEffect, useRef, useState } from "react";

export function AgentLandingCard() {
  const card = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function followCursor(event: PointerEvent) {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      setTilt({ x: y * -8, y: x * 8 });
    }

    window.addEventListener("pointermove", followCursor);
    return () => window.removeEventListener("pointermove", followCursor);
  }, []);

  return <section ref={card} className="agent-card" aria-label="AgentProfiles WebMCP tools" style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
    <div className="agent-mark">✦</div>
    <h1>Agentprofiles</h1>
    <p className="agent-domain">agentprofiles.vercel.app</p>
    <div className="agent-rule" />
    <div className="agent-eyebrow">AGENT ACTIONS</div>
    <div className="agent-tools">
      <div><i>⌕</i><span>Find businesses</span><b>›</b></div>
      <div><i>◫</i><span>Check availability</span><b>›</b></div>
      <div><i>◷</i><span>Book appointment</span><b>›</b></div>
    </div>
    <div className="agent-online"><span /> WebMCP enabled</div>
  </section>;
}
