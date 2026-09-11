#!/usr/bin/env bash

set -euo pipefail

BACKUP_ROOT="${BACKUP_ROOT:-backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"
DATABASE_USER="${POSTGRES_USER:-badshot}"
DATABASE_NAME="${POSTGRES_DB:-badshot}"

mkdir -p "$BACKUP_DIR"

echo "Ensuring PostgreSQL is running..."
docker compose up -d postgres

echo "Waiting for PostgreSQL to accept connections..."
for _ in {1..30}; do
  if docker compose exec -T postgres pg_isready \
    -U "$DATABASE_USER" \
    -d "$DATABASE_NAME" \
    >/dev/null 2>&1; then
    break
  fi

  sleep 1
done

if ! docker compose exec -T postgres pg_isready \
  -U "$DATABASE_USER" \
  -d "$DATABASE_NAME" \
  >/dev/null 2>&1; then
  echo "PostgreSQL did not become ready within 30 seconds." >&2
  exit 1
fi

echo "Creating PostgreSQL backup..."
docker compose exec -T postgres pg_dump \
  -U "$DATABASE_USER" \
  -d "$DATABASE_NAME" \
  --no-owner \
  --no-privileges \
  > "$BACKUP_DIR/database.sql"

echo "Creating uploads backup..."
if [ -d "apps/api/uploads" ]; then
  tar -czf "$BACKUP_DIR/uploads.tar.gz" -C apps/api uploads
else
  echo "apps/api/uploads does not exist; creating an empty archive."
  tar -czf "$BACKUP_DIR/uploads.tar.gz" -T /dev/null
fi

echo "Backup created at $BACKUP_DIR"
du -sh "$BACKUP_DIR"
