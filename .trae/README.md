This folder is the canonical Trae configuration for the `versatile` plugin.

Why it lives here:

- It stays inside the plugin Git repository, so skills and rules are versioned with the project.
- The main workspace may still be the WordPress root for better code lookup and WordPress function context.

Recommended local setup:

- Open the WordPress root that contains `wp-content/plugins/versatile` as the workspace root.
- Keep the workspace-root `.trae` as a symlink to `wp-content/plugins/versatile/.trae`.

Release workflow note:

- Edit plugin files through the WordPress-root workspace paths.
- Run Git commands from `wp-content/plugins/versatile`.
