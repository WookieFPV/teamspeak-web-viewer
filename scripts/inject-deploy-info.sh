#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Get git commit hash (short)
COMMIT_SHORT=$(git describe --always --abbrev=7 HEAD 2>/dev/null || echo "unknown")

# Get full commit hash
COMMIT_FULL=$(git rev-parse HEAD 2>/dev/null || echo "unknown")

# Get commit message (first line)
COMMIT_MSG=$(git log -1 --format=%s 2>/dev/null || echo "unknown")

# Get deployment date (ISO format)
DEPLOY_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo "unknown")

# Write to .env.local (which Next.js picks up)
cat > .next/deploy-info.env <<EOF
NEXT_PUBLIC_DEPLOY_COMMIT="${COMMIT_FULL}"
NEXT_PUBLIC_DEPLOY_MESSAGE="${COMMIT_MSG}"
NEXT_PUBLIC_DEPLOY_DATE="${DEPLOY_DATE}"
EOF

echo "Deployment info injected:"
echo "  Commit: ${COMMIT_SHORT}"
echo "  Message: ${COMMIT_MSG}"
echo "  Date: ${DEPLOY_DATE}"
