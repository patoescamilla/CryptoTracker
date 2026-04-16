#!/bin/bash

set -euo pipefail

REPO_URL="${1:-}"
APP_DIR="${2:-$HOME/CryptoTracker}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker no esta instalado."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "Docker Compose no esta instalado."
  exit 1
fi

if [ -n "$REPO_URL" ] && [ ! -d "$APP_DIR/.git" ]; then
  echo "Clonando repositorio en $APP_DIR..."
  git clone "$REPO_URL" "$APP_DIR"
fi

if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
  echo "No se encontro docker-compose.yml en $APP_DIR"
  exit 1
fi

cd "$APP_DIR"
mkdir -p logs

echo "Construyendo contenedores..."
$COMPOSE_CMD build

echo "Levantando aplicacion..."
$COMPOSE_CMD up -d

echo "Despliegue completado."
echo "Frontend: http://localhost"
echo "Backend: http://localhost:3001/health"
