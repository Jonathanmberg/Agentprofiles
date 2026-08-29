"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AgentActivity } from "@/lib/types";

const ActivityContext = createContext<{ activities: AgentActivity[] }>({ activities: [] });

export function emitAgentActivity(activity: Omit<AgentActivity, "id" | "at">) {
  window.dispatchEvent(new CustomEvent("dentalbookings:activity", { detail: activity }));
}

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<Omit<AgentActivity, "id" | "at">>).detail;
      setActivities((current) => [{ ...detail, id: crypto.randomUUID(), at: new Date().toISOString() }, ...current].slice(0, 6));
    };
    window.addEventListener("dentalbookings:activity", listener);
    return () => window.removeEventListener("dentalbookings:activity", listener);
  }, []);
  const value = useMemo(() => ({ activities }), [activities]);
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useAgentActivity() { return useContext(ActivityContext); }
