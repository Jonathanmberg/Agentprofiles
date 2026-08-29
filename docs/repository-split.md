# Repository split for the WebMCP Challenge

## `agentprofiles` — public submission repository

This repository is the URL submitted to Devpost. It must remain public and contain the complete application source, WebMCP tool implementation, database schema migration, deployment configuration, `.env.example`, setup instructions, and an open-source license. It must never include environment files, service-role keys, actual users, or production exports.

The public release includes the complete schema and a generic seed example, but excludes the live demo dataset. Another developer can run it with their own fictional data.

## `agentprofiles-demo` — private operational repository

Create this only after connecting GitHub. Use it for private deployment notes, a sanitized exact demo-data snapshot if needed, recorded demo assets before publication, Vercel/Supabase setup notes, and any non-public credentials stored only as environment-variable references. Do not commit secrets here either; use GitHub/Vercel/Supabase secret storage.

## Rule of thumb

The public repository must independently explain and run the project. The private repository may make the live demo easier to operate, but judges must never need access to it to understand or evaluate the source code.
