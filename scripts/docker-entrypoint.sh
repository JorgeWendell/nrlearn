#!/bin/sh
set -e
mkdir -p /app/uploads/lessons
chown -R nextjs:nodejs /app/uploads 2>/dev/null || true
if [ "$(id -u)" = "0" ]; then
  exec su-exec nextjs "$@"
fi
exec "$@"
