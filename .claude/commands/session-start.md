# /session-start - Initialize Session Context

Read all documentation and establish session context.

## Instructions

1. Read these files in order:
   - `/docs/PROJECT_CONTEXT.md` - Project overview
   - `/docs/SESSION_LOG.md` - Recent sessions (last entry)
   - `/docs/SESSION_STATE.md` - Current state
   - `/docs/CREATIVE_BRIEF.md` - Design philosophy
   - `/docs/COLOR_SYSTEM.md` - Color rules
   - `CLAUDE.md` - Project rules

2. Check for any running processes:
   ```bash
   lsof -i:3000,3001,3002 | head -5
   ```

3. Check git status:
   ```bash
   git status --short
   ```

4. Summarize to user:
   ```
   Session Context Loaded
   ─────────────────────
   Last session: [date] - [brief description]
   Outstanding tasks: [any from SESSION_STATE]
   Dev server: [running on port X / not running]
   Git status: [clean / X uncommitted changes]

   Ready to continue. What would you like to work on?
   ```
