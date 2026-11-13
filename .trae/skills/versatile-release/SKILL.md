---
name: "versatile-release"
description: "Releases the Versatile WordPress plugin by bumping version files, updating Tested up to and changelog, then creating and pushing a git tag. Invoke when user asks to prepare or publish a plugin release."
---

# Versatile Release

Use this skill when the user wants to prepare, publish, or tag a new release of the `versatile` WordPress plugin.

## Goal

Prepare a clean plugin release by:

- Updating the plugin version in `wp-content/plugins/versatile/versatile-toolkit.php`
- Updating `VERSATILE_VERSION` in `wp-content/plugins/versatile/constants.php`
- Updating `Stable tag` in `wp-content/plugins/versatile/readme.txt`
- Updating `Tested up to` in `wp-content/plugins/versatile/readme.txt` to the latest WordPress release version
- Adding or updating the latest changelog section in `wp-content/plugins/versatile/readme.txt`
- Creating a git commit with a short, clear message that follows the workspace commit message rule
- Creating a git tag that matches the released Versatile plugin version
- Pushing the branch and tag so GitHub Actions can publish the release automatically

## Important Rules

- The opened workspace may be the WordPress root, but all release git commands must run inside `wp-content/plugins/versatile`
- Work inside the plugin repository: `wp-content/plugins/versatile`
- Before changing anything, read the current version from:
  - `wp-content/plugins/versatile/versatile-toolkit.php`
  - `wp-content/plugins/versatile/constants.php`
  - `wp-content/plugins/versatile/readme.txt`
- If the user does not specify the next version, suggest the next semantic version, usually a patch bump
- Always make the plugin version, `VERSATILE_VERSION`, and `Stable tag` match exactly
- `Tested up to` should be updated to the latest stable WordPress release version
- The changelog entry header must match the release version exactly, for example `= 1.0.12 =`
- Create a new changelog block for every release at the top of the `== Changelog ==` section in `wp-content/plugins/versatile/readme.txt`
- Create changelog bullets from the diff between the latest existing release tag and the current release commit, for example `git diff v1.0.12..HEAD`
- The release notes must be exactly the same as the latest changelog entry text in `wp-content/plugins/versatile/readme.txt`
- Before creating or pushing a tag, show the proposed version and changelog to the user and wait for explicit verification
- Do not create or push a tag until version files are updated and committed
- Use short and clear commit messages, following the workspace rule in `.trae/rules/git-commit-message.md`

## Release Checklist

1. Confirm or determine the next plugin version.
2. Find the latest stable WordPress version and use it for `Tested up to`.
3. Update these files:
   - `wp-content/plugins/versatile/versatile-toolkit.php`
   - `wp-content/plugins/versatile/constants.php`
   - `wp-content/plugins/versatile/readme.txt`
4. Ensure these values are aligned:
   - Plugin header `Version:`
   - `VERSATILE_VERSION`
   - `Stable tag:`
   - Changelog section title
   - Release notes content
5. Insert the new version block above the previous latest version under `== Changelog ==`.
6. Review the diff to make sure only intended release changes are included.
7. Show the proposed version and changelog to the user and wait for verification.
8. Run git commands from `wp-content/plugins/versatile`.
9. Commit the release changes.
10. Create a tag using the exact plugin version, normally prefixed with `v`, for example `v1.0.12`.
11. Push the branch and push the tag.
12. Tell the user that GitHub Actions should start automatically after the tag push.

## Expected File Updates

### `versatile-toolkit.php`

Update:

```php
 * Version: 1.0.11
```

to the next release version.

### `readme.txt`

Update:

```txt
Tested up to: 6.9.4
Stable tag: 1.0.11
```

and add a new changelog block like:

```txt
= 1.0.12 =
* Short summary of release change one
* Short summary of release change two
```

Place this new block directly under `== Changelog ==`, above the previous latest version block.

Use the exact same bullet text for the release notes.

### `constants.php`

Update:

```php
define( 'VERSATILE_VERSION', '1.0.11' );
```

to the next release version.

## Suggested Workflow

1. Read the current version and changelog.
2. Ask the user for the next version only if it is ambiguous.
3. Find the latest existing release tag and inspect the diff from that tag to `HEAD` to prepare the new changelog.
4. Check the latest WordPress stable version. If web access is available, verify it instead of guessing.
5. Add the new changelog block at the top of `== Changelog ==`.
6. Edit the remaining release files.
7. Show the proposed version and changelog to the user for verification before continuing.
8. Run a quick review of the changed files.
9. Change into `wp-content/plugins/versatile` for all git operations.
10. Commit using a concise message such as:
   - `chore: release v1.0.12`
   - `feat: release v1.0.12`
11. Create the tag:

```bash
git tag v1.0.12
```

12. Push branch and tag:

```bash
git push
git push origin v1.0.12
```

## Command Guidance

Use commands that are safe and non-interactive. Run them from `wp-content/plugins/versatile`. Prefer this order:

```bash
git status --short
git tag --list
git log --oneline v1.0.12..HEAD
git diff --stat v1.0.12..HEAD
git diff v1.0.12..HEAD
git diff -- wp-content/plugins/versatile/versatile-toolkit.php wp-content/plugins/versatile/constants.php wp-content/plugins/versatile/readme.txt
git add wp-content/plugins/versatile/versatile-toolkit.php wp-content/plugins/versatile/constants.php wp-content/plugins/versatile/readme.txt
git commit -m "chore: release v1.0.12"
git tag v1.0.12
git push
git push origin v1.0.12
```

If the repository has other unrelated changes, do not include them unless the user asks.

## Notes

- If the release version is already tagged, stop and ask the user how to proceed.
- If `Tested up to` cannot be verified confidently, ask the user before finalizing the release.
- Use the latest changelog bullets as the release notes without rewriting them.
- Do not push the release tag until the user has explicitly verified the version and changelog.
- If the workspace root is the full WordPress install, keep file edits rooted at that workspace but keep git operations scoped to `wp-content/plugins/versatile`.
- After pushing the tag, remind the user that the GitHub Action should handle the plugin release automatically.
