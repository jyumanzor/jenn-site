# /capture - Quick Question Capture

Capture the current question/context to the workflow insights log.

## Instructions

1. Read the user's most recent question or request from this conversation
2. Determine the question type:
   - `technical` = code decisions, architecture, implementation
   - `design` = colors, layout, aesthetics, UI
   - `process` = workflow, how-to, methodology
3. Identify the build context based on current working directory:
   - `/Jenn's Site/` → `jenns-site`
   - `/FTI/` → `fti-portal`
   - Otherwise → `general`
4. Extract relevant tags from the question (e.g., "react", "styling", "api")
5. Append to the capture log file

## Output Format

Append this JSON to `/Users/jennumanzor/Desktop/~Working/~BUILDS/Personal/Jenn's Site/website/data/captured-questions.json`:

```json
{
  "id": "[timestamp]",
  "question": "[the user's question]",
  "questionType": "[technical|design|process]",
  "buildContext": "[jenns-site|fti-portal|general]",
  "category": "[inferred category]",
  "timestamp": "[ISO timestamp]",
  "tags": ["tag1", "tag2"],
  "sessionContext": "[brief note about what we were working on]"
}
```

## After Capturing

Confirm to the user:
```
✓ Captured: "[first 50 chars of question]..."
  Type: [type] | Build: [build] | Tags: [tags]
```

Then continue with the conversation normally.
