import type { Metadata } from "next";
import "./globals.css";
import { ActivityProvider } from "@/components/activity-provider";
import { WebMCPTools } from "@/components/webmcp-tools";

export const metadata: Metadata = {
  title: "AgentProfiles | The profile-aware web",
  description: "A user-controlled profile layer for trusted AI-agent actions, beginning with DentalBookings.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ActivityProvider>
          <WebMCPTools />
          {children}
        </ActivityProvider>
      </body>
    </html>
  );
}
