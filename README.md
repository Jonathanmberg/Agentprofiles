# AgentProfiles

AgentProfiles is a prototype for the profile-aware web: trusted services can use the context a person chooses to share with their agent, then carry out a confirmed action through WebMCP. The live demonstration uses decision-ready business profiles to compare location, pricing, availability, and documented specialties before booking.

> Business profiles made the web legible to people. AgentProfiles explores what happens when a user-controlled profile makes it legible to agents.

## Why WebMCP

WebMCP lets a website provide structured, well-described tools to an AI agent running in the browser. Instead of guessing at UI controls, an agent can use three business-profile tools directly. The agent combines these trusted actions with context the user has already provided and confirms before it books:

| Tool | Purpose |
| --- | --- |
| `find_businesses` | Search by city, category, and optional specialty, returning location and pricing evidence. |
| `check_availability` | Compare open appointment slots for one business and an ISO date range. |
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

This public release intentionally excludes the live demo dataset. Apply the migrations, then use `supabase/seed.example.sql` as the starting point for your own fictional businesses, providers, and slots.

## Test the agent flow

1. Serve the app over `https` (or `localhost` during development).
2. Open it in the ChatGPT Desktop built-in browser.
3. Open the site-tools menu in the browser address bar to inspect the three registered tools.
4. Ask for an appointment in your seeded city and category. The agent can use the returned neighbourhood, pricing guidance, availability, and specialties to explain trade-offs.
5. Search a specialty such as `perm` to test business-fit reasoning.
6. Confirm a selected slot and verify it disappears from availability.

Chrome testing requires WebMCP enabled through the experimental flag/origin trial. The MCP-B fallback is also available in browsers without native support.

## Deploy

### Vercel

Import the repository, set the three Supabase variables from `.env.example`, and deploy. Next.js config needs no extra changes.

### Render

Create a Blueprint deployment from `render.yaml`, add the three Supabase variables, and deploy.

## Submission copy

**AgentProfiles** is a first look at the profile-aware web. It gives AI agents trusted, structured business profiles—not scraped pages—with precise locations, prices, appointment availability, and documented specialties. The agent can weigh proximity, cost, and service fit while the person remains in control: booking only happens after explicit confirmation through a transparent WebMCP action.
