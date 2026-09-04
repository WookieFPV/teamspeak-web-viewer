#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

TS3_VERSION="3.13.7"
TS3_DIR=".ts3"
TS3_HOME="$TS3_DIR/server"
TS3_URL="https://files.teamspeak-services.com/releases/server/$TS3_VERSION/teamspeak3-server_linux_amd64-$TS3_VERSION.tar.bz2"

usage() {
  echo "Usage: $0 {up|down|status|reset}"
  echo ""
  echo "  up      download (once), start the server and sync .env.local"
  echo "  down    stop the server"
  echo "  status  show whether the server is running"
  echo "  reset   stop the server and delete all server data in $TS3_DIR"
}

ensure_installed() {
  if [ ! -x "$TS3_HOME/ts3server" ]; then
    echo "Downloading TeamSpeak 3 server $TS3_VERSION..."
    rm -rf "$TS3_DIR"
    mkdir -p "$TS3_DIR"
    curl -sfL "$TS3_URL" | tar -xj -C "$TS3_DIR"
    mv "$TS3_DIR/teamspeak3-server_linux_amd64" "$TS3_HOME"
  fi
}

query_password() {
  grep -ho 'password= "[^"]*"' "$TS3_HOME"/logs/ts3server_*.log 2>/dev/null | head -1 | cut -d'"' -f2 || true
}

sync_env_local() {
  local password="$1"
  if [ ! -f .env.local ]; then
    cat > .env.local <<EOF
TS3_HOST=127.0.0.1
TS3_USERNAME=serveradmin
TS3_PASSWORD=$password
TS3_NICKNAME=webviewer-dev
EOF
    echo "Created .env.local"
  elif grep -q '^TS3_HOST=127.0.0.1$' .env.local && [ -n "$password" ]; then
    sed -i "s/^TS3_PASSWORD=.*/TS3_PASSWORD=$password/" .env.local
    echo "Synced TS3_PASSWORD into .env.local"
  fi
}

cmd_up() {
  ensure_installed
  if license_accepted=1 "$TS3_HOME/ts3server_startscript.sh" status > /dev/null 2>&1; then
    echo "TeamSpeak 3 server is already running (query port 10011)"
    return
  fi
  echo "Starting TeamSpeak 3 server..."
  local out
  out=$(license_accepted=1 TS3SERVER_LICENSE=accept "$TS3_HOME/ts3server_startscript.sh" start 2>&1 || true)
  echo "$out"
  for _ in $(seq 1 20); do
    if (echo > /dev/tcp/127.0.0.1/10011) 2> /dev/null; then
      break
    fi
    sleep 0.5
  done
  local password
  password=$(grep -o 'password= "[^"]*"' <<< "$out" | head -1 | cut -d'"' -f2 || true)
  if [ -z "$password" ]; then
    password=$(query_password)
  fi
  if [ -n "$password" ]; then
    echo "First run: generated query login serveradmin / $password"
    sync_env_local "$password"
  fi
  echo "Server is up: query 10011, voice 9987/udp, files 30033"
}

cmd_down() {
  "$TS3_HOME/ts3server_startscript.sh" stop || true
}

cmd_status() {
  "$TS3_HOME/ts3server_startscript.sh" status
}

cmd_reset() {
  cmd_down
  rm -rf "$TS3_DIR"
  echo "Removed $TS3_DIR"
}

case "${1:-}" in
  up) cmd_up ;;
  down) cmd_down ;;
  status) cmd_status ;;
  reset) cmd_reset ;;
  *) usage; exit 1 ;;
esac
