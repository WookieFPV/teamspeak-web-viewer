#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Get git commit hash (short)
COMMIT_SHORT=$(git describe --always --abbrev=7 HEAD 2>/dev/null || echo "unknown")

# Get full commit hash
COMMIT_FULL=$(git rev-parse HEAD 2>/dev/null || echo "unknown")

# Get commit message (first line, with double quotes stripped so it can't break the .env file)
COMMIT_MSG=$(git log -1 --format=%s 2>/dev/null | tr -d '"' || echo "unknown")

# Get deployment date (ISO format)
DEPLOY_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo "unknown")

# Write deployment info to .env.local, which Next.js loads at build/dev time
# (this script runs before `next build`/`next dev`, so values are picked up).
# Any previously injected values are removed first so they never go stale.
touch .env.local
grep -v '^NEXT_PUBLIC_DEPLOY_COMMIT=' .env.local | grep -v '^NEXT_PUBLIC_DEPLOY_MESSAGE=' | grep -v '^NEXT_PUBLIC_DEPLOY_DATE=' | grep -v '^# Auto-injected deployment info$' > .env.local.tmp || true
mv .env.local.tmp .env.local
cat >> .env.local <<EOF

# Auto-injected deployment info
NEXT_PUBLIC_DEPLOY_COMMIT="${COMMIT_FULL}"
NEXT_PUBLIC_DEPLOY_MESSAGE="${COMMIT_MSG}"
NEXT_PUBLIC_DEPLOY_DATE="${DEPLOY_DATE}"
EOF

echo "Deployment info injected:"
echo "  Commit: ${COMMIT_SHORT}"
echo "  Message: ${COMMIT_MSG}"
echo "  Date: ${DEPLOY_DATE}"