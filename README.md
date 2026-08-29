# AgentProfiles

AgentProfiles is a prototype for the profile-aware web: trusted services can use the context a person chooses to share with their agent, then carry out a confirmed action through WebMCP. **DentalBookings** is the first live vertical—a person and their AI agent use the same website to find Norwegian clinics, compare real appointment availability, and book a confirmed slot.

> Business profiles made the web legible to people. AgentProfiles explores what happens when a user-controlled profile makes it legible to agents.

## Why WebMCP

WebMCP lets a website provide structured, well-described tools to an AI agent running in the browser. Instead of guessing at UI controls, an agent can use the three DentalBookings tools directly. The agent combines these trusted actions with context the user has already provided and confirms before it books:

| Tool | Purpose |
| --- | --- |
| `find_clinics` | Search trusted clinics by Norwegian city. |
| `check_availability` | Compare open dentist slots for one clinic and an ISO date range. |
| `book_appointment` | Create an appointment after the patient confirms the specific slot and provides contact details. |

Tools are registered by `components/webmcp-tools.tsx` at component mount, use native `navigator.modelContext` on supported secure browsers, and dynamically load `@mcp-b/global` as a fallback. Booking mutations go through the same Next.js API and atomic Supabase RPC as the regular UI. This prototype does **not** claim access to a private OpenAI profile API; it demonstrates the product experience of user-controlled context plus trusted site tools.

## Local setup

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Add the Project URL, anon key, and service-role key. Never expose the service-role key to the browser.
3. Run `supabase db push` (or execute `supabase/migrations/20260829000000_dentalbookings.sql` in the SQL editor).
4. Install and run:

```bash
npm install
npm run dev
```

The migration creates three fake Norwegian clinics, five dentists, and twelve weekday appointments per dentist during the next two weeks.

## Test the agent flow

1. Serve the app over `https` (or `localhost` during development).
2. Open it in the ChatGPT Desktop built-in browser and verify the **WebMCP active** indicator.
3. Open the site-tools menu in the browser address bar to inspect the three registered tools.
4. Ask: “Book my usual dentist next week, preferably after 14:00. Compare alternatives before I confirm.” Then use the three listed tools to complete the flow.
5. Watch **Agent activity** update, then verify the booked slot disappears from the clinic page.

Chrome testing requires WebMCP enabled through the experimental flag/origin trial. The MCP-B fallback is also available in browsers without native support.

## Deploy

### Vercel

Import the repository, set the three Supabase variables from `.env.example`, and deploy. Next.js config needs no extra changes.

### Render

Create a Blueprint deployment from `render.yaml`, add the three Supabase variables, and deploy.

## Submission copy

**AgentProfiles** is a first look at the profile-aware web. It combines user-controlled context with trusted WebMCP actions, beginning with DentalBookings. An agent can use the patient’s stated preferences—such as a usual clinic, preferred appointment window, and dentist preference—to search trusted clinics, compare availability, and reserve the selected appointment through three structured WebMCP tools. The same page visualizes every agent step, so people understand which context was used and approve the final booking rather than handing control to an opaque automation.
