---
name: "review-pull-request"
description: "Reviews a pull request for bugs, regressions, risks, and missing tests. Invoke when user asks to review a PR, branch, or merge readiness."
---

# Review Pull Request

Use this skill when the user wants a pull request reviewed, wants merge-readiness feedback, or asks for a branch review before opening or merging a PR.

## Goal

Review the current branch or PR changes and provide actionable feedback by:

- Identifying bugs, regressions, and risky behavior changes
- Checking whether the implementation matches the likely intent
- Spotting missing validation, edge cases, or error handling
- Highlighting missing or weak test coverage where it matters
- Calling out unclear assumptions or follow-up questions
- Summarizing merge readiness without diluting the findings

## Review Mindset

Prioritize review findings over summaries.

- Focus first on correctness, regressions, and production risk
- Prefer concrete, file-based findings over general style commentary
- Keep findings specific, reproducible, and tied to the changed code
- Mention missing tests when the gap increases regression risk
- Avoid inventing issues when the diff looks sound
- If there are no findings, say so explicitly and note any residual risk or testing gaps

## Important Rules

- Review the actual diff before forming conclusions
- Compare the branch against the correct base branch, usually `main`
- Treat the task as a code review unless the user explicitly wants something else
- Default to findings-first output ordered by severity
- Keep summaries brief and secondary to the findings
- Do not block on perfect certainty; state assumptions when needed
- If the working tree has unrelated changes that affect the review, ask the user how to proceed

## Review Checklist

1. Identify the current branch and intended base branch.
2. Check the working tree state with `git status --short`.
3. Review the commit list and diff from the base branch to `HEAD`.
4. Inspect changed files closely, especially logic, data flow, and edge handling.
5. Look for:
   - Broken behavior
   - Regressions
   - Risky assumptions
   - Incomplete changes
   - Missing tests where coverage matters
6. Draft findings with severity ordering.
7. Add open questions or assumptions if any conclusions depend on context.
8. Provide a short merge-readiness summary only after the findings.

## Findings Format

Use a structure like this:

```md
## Findings
- High: Clear statement of the issue, impact, and where it appears
- Medium: Clear statement of the issue, impact, and where it appears

## Open Questions
- Any assumptions or context needed to confirm a concern

## Summary
- Short note on overall review status and testing confidence
```

Keep each finding concise but complete enough for the author to act on it.

## Severity Guidance

Use practical severity labels:

- High: Likely bug, regression, data loss, security issue, or merge blocker
- Medium: Meaningful correctness or maintainability risk that should likely be fixed before merge
- Low: Minor issue, polish item, or small clarity gap

If the review is clean, say that no findings were identified.

## Suggested Workflow

1. Read branch status and branch name.
2. Determine the base branch.
3. Review:
   - `git log --oneline <base>..HEAD`
   - `git diff --stat <base>..HEAD`
   - `git diff <base>..HEAD`
4. Read the changed files that carry the main logic.
5. Evaluate correctness, regressions, and testing coverage.
6. Write findings first, then questions, then a brief summary.

## Command Guidance

Use safe, non-interactive commands such as:

```bash
git status --short
git branch --show-current
git branch -vv
git log --oneline main..HEAD
git diff --stat main..HEAD
git diff main..HEAD
```

If the base branch is not `main`, replace it with the correct base branch.

## Notes

- Review only what the diff supports; do not speculate beyond the evidence
- If a changed area is complex, read the surrounding code before finalizing findings
- If tests are absent, mention the practical risk rather than asking for tests by default
- If the user asks for a general review and no PR exists yet, review the branch diff the same way
