#!/bin/bash

set -euo pipefail

APP_DIR="${1:-$(cd "$(dirname "$0")" && pwd)}"
cd "$APP_DIR"

if docker compose version >/dev/null 2>&1; then
  docker compose down
elif command -v docker-compose >/dev/null 2>&1; then
  docker-compose down
else
  echo "Docker Compose no esta instalado."
  exit 1
fi

echo "Aplicacion detenida."
