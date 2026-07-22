---
name: "create-pull-request"
description: "Creates or prepares a pull request by reviewing branch changes, writing a PR title and description, and opening the PR if tooling is available. Invoke when user asks to create, open, or prepare a PR."
---

# Create Pull Request

Use this skill when the user wants to create, prepare, or open a pull request for the current branch.

## Goal

Prepare a clean pull request by:

- Checking the current branch and working tree status
- Identifying the correct base branch
- Reviewing the diff between the current branch and the base branch
- Summarizing the changes accurately
- Writing a clear PR title
- Writing a structured PR description
- Opening the pull request automatically if GitHub CLI or another available tool supports it
- Falling back to a ready-to-paste PR title and body if automatic PR creation is not available

## Important Rules

- Work from the actual repository root for the current project
- Do not create a PR from a dirty working tree unless the user clearly wants that
- Prefer comparing the current branch against its intended base branch, usually `main`
- Review the diff before writing the PR title or description
- Keep the PR title short, specific, and consistent with the actual change scope
- The PR description should reflect the real diff, not guessed or generic text
- If the branch has not been pushed yet, push it before attempting to open a PR
- If GitHub CLI is unavailable or unauthenticated, provide a manual PR title and body instead of blocking
- If the user already has a target base branch in mind, use that instead of assuming `main`

## Pull Request Checklist

1. Confirm the current branch name.
2. Determine the base branch, usually `main`.
3. Check `git status --short` to make sure the branch is in a usable state.
4. Review the commit list and diff from the base branch to `HEAD`.
5. Identify the primary purpose of the branch.
6. Draft a concise PR title.
7. Draft a PR description with:
   - Summary
   - What changed
   - Testing
   - Notes or risks, if relevant
8. Push the branch if needed.
9. Create the PR automatically if possible.
10. If automatic creation is not possible, give the user the exact title and body to use manually.

## Title Guidance

Use a title that matches the actual scope of the branch.

Good examples:

- `Fix quick actions dropdown width in admin bar`
- `Add debug log source filtering`
- `Update release workflow to use changelog as release notes`

Avoid vague titles like:

- `update code`
- `fix issue`
- `changes`

## Description Template

Use a structure like this:

```md
## Summary
- Short explanation of what this PR does

## Changes
- Main change one
- Main change two

## Testing
- Describe what was checked

## Notes
- Optional risks, follow-ups, or release considerations
```

Only include sections that are useful for the actual change.

## Suggested Workflow

1. Read the branch status.
2. Detect the current branch name.
3. Find the correct base branch.
4. Review:
   - `git log --oneline <base>..HEAD`
   - `git diff --stat <base>..HEAD`
   - `git diff <base>..HEAD`
5. Draft the PR title and description from the real diff.
6. Push the branch if it is ahead or not yet published.
7. If `gh` is available and authenticated, create the PR.
8. Otherwise, return a ready-to-copy PR title and PR body.

## Command Guidance

Use commands that are safe and non-interactive. Prefer this order:

```bash
git status --short
git branch --show-current
git branch -vv
git log --oneline main..HEAD
git diff --stat main..HEAD
git diff main..HEAD
git push -u origin <current-branch>
gh pr create --base main --head <current-branch> --title "<pr-title>" --body-file PR_BODY.md
```

If the base branch is not `main`, replace it with the correct base branch.

## Fallback Behavior

If automatic PR creation is not possible:

- Explain why, for example missing `gh` CLI or missing authentication
- Provide:
  - PR title
  - PR description
  - Compare link if it can be constructed confidently

## Notes

- If the branch is already merged or already has an open PR, stop and tell the user
- If the diff is too large to summarize safely, inspect the changed files more carefully before drafting the PR
- If there are unrelated uncommitted changes, ask the user how to proceed
- If the user asks for a PR for a specific branch or base branch, follow that exactly
