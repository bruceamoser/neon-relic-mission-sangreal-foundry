---
name: create-release
description: 'Create a versioned GitHub release for neon-relic-mission-sangreal-foundry. Semver bump (major/minor/patch), pre-flight checks, build, tag, and publish. USE FOR: "create release", "make release", "publish release", "cut release", "ship it", "bump version and release", "release the mission module".'
argument-hint: '<major|minor|patch>'
user-invocable: true
---

# Create Release — neon-relic-mission-sangreal-foundry

Complete end-to-end workflow for cutting a versioned GitHub release of the *Mission: Sangreal* content module for the Neon Relic Foundry VTT system. This skill IS the procedure — follow every step, in order, without skipping.

## Prerequisites

- Working directory: the `neon-relic-mission-sangreal-foundry` repository root
- Tag format: `v<major>.<minor>.<patch>` (e.g., `v1.1.0`)
- Release artifacts: `neon-relic-mission-sangreal.zip` + `module.json`
- `gh` CLI authenticated with `repo` scope
- Node.js 22+ and npm available

> The repository also carries `.github/workflows/release.yml`. It runs when a release is **published** and rebuilds/re-attaches the CI artifacts (`allowUpdates: true`), so it is safe to publish the release manually — CI then refreshes the artifacts from a clean build.

## Parameter: `<type>`

One of:

- `major` — breaking changes (x.0.0)
- `minor` — new features/content, backwards-compatible (1.x.0)
- `patch` — bug fixes/content corrections (1.0.x)

## URI Convention

The source-of-truth `static/module.json` MUST keep URIs pointing to `latest`:

```json
"manifest": "https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json",
"download": "https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/neon-relic-mission-sangreal.zip"
```

The `manifest` always resolves to the latest release's `module.json`, and `download` always fetches the latest `neon-relic-mission-sangreal.zip`. Do NOT replace these with version-specific URLs in source. The version-specific download URL is set only at release time via `gh release upload`.

## Mandatory 6-Step Workflow

### Step 1 — Pre-Flight Checks

All of these MUST pass before proceeding:

```bash
# 1a. On main, fully up to date
git checkout main
git pull origin main
git status              # MUST show "nothing to commit, working tree clean"

# 1b. No open PRs against main
gh pr list --base main --state open --json number,title
# MUST return [] (empty). If any open PRs exist, stop and resolve them first.

# 1c. Pack sources validate
npm run validate

# 1d. Build succeeds
npm run build
```

If any check fails, stop and fix it before continuing.

### Step 2 — Compute & Bump Version

Read the current version from both files:

```bash
CURRENT=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT"
```

Parse the semver components and compute the new version:

```bash
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"
case "<type>" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
esac
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
echo "New version: $NEW_VERSION"
```

Bump the version in both manifest files:

1. **`package.json`** — update the `"version"` field.
2. **`static/module.json`** — update the `"version"` field.

Verify URIs still point to `latest`:

```bash
grep '"manifest"' static/module.json | grep 'latest/download'
grep '"download"' static/module.json | grep 'latest/download'
```

Both MUST contain `latest/download`. If they contain a specific version number, fix them back to `latest`.

### Step 3 — Build & Commit Version Bump

```bash
# Run production build
npm run build

# Verify dist/ was produced
ls dist/module.json dist/packs

# Commit the version bump
git add package.json static/module.json
git commit -m "chore: bump version to $NEW_VERSION"

# Push
git push origin main
```

### Step 4 — Create Git Tag & GitHub Release

Create an annotated tag:

```bash
git tag -a "v${NEW_VERSION}" -m "v${NEW_VERSION}"
git push origin "v${NEW_VERSION}"
```

Create the GitHub release with auto-generated notes and attach build artifacts:

```bash
# Create the ZIP artifact from dist/
cd dist && zip -r ../neon-relic-mission-sangreal.zip . && cd ..

# Create the release with artifacts
gh release create "v${NEW_VERSION}" \
  --title "v${NEW_VERSION} — Mission: Sangreal" \
  --generate-notes \
  --prerelease=false \
  ./neon-relic-mission-sangreal.zip \
  ./dist/module.json
```

**What this does:**

- Creates a GitHub Release tagged `v${NEW_VERSION}`
- Generates release notes from merged PRs since the last release
- Uploads `neon-relic-mission-sangreal.zip` (full module) and `module.json` (manifest) as release assets
- Foundry VTT resolves `.../latest/download/module.json` → this release's `module.json`
- Foundry VTT resolves `.../latest/download/neon-relic-mission-sangreal.zip` → this release's zip

If the release already exists (e.g., from a CI draft), use:

```bash
gh release upload "v${NEW_VERSION}" ./neon-relic-mission-sangreal.zip ./dist/module.json --clobber
```

### Step 5 — Verify

```bash
# 5a. Confirm the release exists
gh release view "v${NEW_VERSION}" --json tagName,name,publishedAt,isPrerelease

# 5b. Confirm assets are attached
gh release view "v${NEW_VERSION}" --json assets --jq '.assets[] | "\(.name) — \(.size) bytes"'

# Expected output:
#   module.json — <size> bytes
#   neon-relic-mission-sangreal.zip — <size> bytes

# 5c. Verify module.json is downloadable and its version matches
curl -sL "https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/download/v${NEW_VERSION}/module.json" | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).version"
# MUST output: ${NEW_VERSION}

# 5d. Verify the manifest field in the uploaded module.json points to latest
curl -sL "https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json" | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).manifest"
# MUST output: https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json

# 5e. Clean up local ZIP
rm -f neon-relic-mission-sangreal.zip
```

### Step 6 — Confirm & Clean Up

```bash
# Final status check
git status                          # clean, on main
git branch -a                       # no stale branches
gh release list --limit 3           # new release is at the top
```

## Install in Foundry VTT

After the release, the module is installed from its manifest URL:

1. **Setup → Add-on Modules → Install Module → Manifest URL**:

   `https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/latest/download/module.json`

2. The **neon-relic** system must be installed first (`https://github.com/bruceamoser/foundry-neon-relic-system/releases/latest/download/system.json`).

3. Enable the module in the world, then run the **Content Installer** (Configure Settings → Module Settings → Mission: Sangreal → Content Installer) to import the mission content into the `Mission: Sangreal` folder tree.

## Complete Script (Reference)

For convenience, here is the full procedure as a single script. Replace `<type>` with the actual bump type.

```bash
#!/usr/bin/env bash
set -euo pipefail

BUMP_TYPE="<type>"  # major, minor, or patch
cd "$(git rev-parse --show-toplevel)"

# ── Step 1: Pre-flight ────────────────────────────────
echo "=== Step 1: Pre-flight checks ==="
git checkout main
git pull origin main
[[ -z $(git status --porcelain) ]] || { echo "Working tree not clean"; exit 1; }
OPEN_PRS=$(gh pr list --base main --state open --json number --jq 'length')
[[ "$OPEN_PRS" -eq 0 ]] || { echo "Open PRs exist: $OPEN_PRS"; exit 1; }
npm run validate
npm run build
echo "Pre-flight: OK"

# ── Step 2: Bump version ──────────────────────────────
echo "=== Step 2: Bump version ==="
CURRENT=$(node -p "require('./package.json').version")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"
case "$BUMP_TYPE" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  *) echo "Invalid bump type: $BUMP_TYPE"; exit 1 ;;
esac
NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
echo "Bumping $CURRENT → $NEW_VERSION"

node -e "
  const pkg = require('./package.json');
  pkg.version = '${NEW_VERSION}';
  require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"
node -e "
  const mod = require('./static/module.json');
  mod.version = '${NEW_VERSION}';
  require('fs').writeFileSync('./static/module.json', JSON.stringify(mod, null, 2) + '\n');
"
grep -q 'latest/download' static/module.json || { echo "URIs must use 'latest/download'"; exit 1; }
echo "Version bump: OK"

# ── Step 3: Build & commit ────────────────────────────
echo "=== Step 3: Build & commit ==="
npm run build
git add package.json static/module.json
git commit -m "chore: bump version to ${NEW_VERSION}"
git push origin main
echo "Build & commit: OK"

# ── Step 4: Tag & release ─────────────────────────────
echo "=== Step 4: Tag & release ==="
git tag -a "v${NEW_VERSION}" -m "v${NEW_VERSION}"
git push origin "v${NEW_VERSION}"
(cd dist && zip -r ../neon-relic-mission-sangreal.zip .)
gh release create "v${NEW_VERSION}" \
  --title "v${NEW_VERSION} — Mission: Sangreal" \
  --generate-notes \
  --prerelease=false \
  ./neon-relic-mission-sangreal.zip \
  ./dist/module.json
echo "Tag & release: OK"

# ── Step 5: Verify ────────────────────────────────────
echo "=== Step 5: Verify ==="
gh release view "v${NEW_VERSION}" --json tagName,name,publishedAt,isPrerelease
gh release view "v${NEW_VERSION}" --json assets --jq '.assets[] | "\(.name) — \(.size) bytes"'
curl -sL "https://github.com/bruceamoser/neon-relic-mission-sangreal-foundry/releases/download/v${NEW_VERSION}/module.json" \
  | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).version"
rm -f neon-relic-mission-sangreal.zip

# ── Step 6: Clean up ──────────────────────────────────
echo "=== Step 6: Clean up ==="
git status
gh release list --limit 3
echo "Release ${NEW_VERSION}: COMPLETE"
```
