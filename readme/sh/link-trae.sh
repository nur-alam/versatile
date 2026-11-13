#!/bin/sh

set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
wp_root=$(CDPATH= cd -- "$repo_root/../../.." && pwd)

target="$repo_root/.trae"
link_path="$wp_root/.trae"

if [ ! -d "$target" ]; then
  echo "Missing target folder: $target" >&2
  exit 1
fi

if [ -L "$link_path" ]; then
  current_target=$(readlink "$link_path")

  if [ "$current_target" = "$target" ]; then
    echo "Symlink already exists: $link_path -> $current_target"
    exit 0
  fi

  echo "Existing symlink points somewhere else: $link_path -> $current_target" >&2
  echo "Remove it first, then run this script again." >&2
  exit 1
fi

if [ -e "$link_path" ]; then
  echo "A real file or directory already exists at: $link_path" >&2
  echo "Move or delete it first, then run this script again." >&2
  exit 1
fi

ln -s "$target" "$link_path"
echo "Created symlink: $link_path -> $target"
