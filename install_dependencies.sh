#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$SCRIPT_DIR/backend"
echo "Installing backend dependencies..."
npm install

cd "$SCRIPT_DIR/frontend"
echo "Installing frontend dependencies..."
npm install
