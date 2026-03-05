#!/usr/bin/env bash
set -euo pipefail

REPO="sevalla-hosting/cli"
BINARY_NAME="sevalla"
INSTALL_DIR="/usr/local/bin"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
RESET='\033[0m'

info() { printf "${BOLD}%s${RESET}\n" "$*"; }
success() { printf "${GREEN}${BOLD}%s${RESET}\n" "$*"; }
error() { printf "${RED}error:${RESET} %s\n" "$*" >&2; exit 1; }

# Uninstall
if [ "${1:-}" = "-r" ]; then
  if [ -f "${INSTALL_DIR}/${BINARY_NAME}" ]; then
    info "Removing ${INSTALL_DIR}/${BINARY_NAME}..."
    rm -f "${INSTALL_DIR}/${BINARY_NAME}" 2>/dev/null || sudo rm -f "${INSTALL_DIR}/${BINARY_NAME}"
    success "Sevalla CLI uninstalled."
  else
    error "Sevalla CLI is not installed at ${INSTALL_DIR}/${BINARY_NAME}"
  fi
  exit 0
fi

# Detect OS
case "$(uname -s)" in
  Linux*)  OS="linux" ;;
  Darwin*) OS="darwin" ;;
  *)       error "Unsupported OS: $(uname -s)" ;;
esac

# Detect architecture
case "$(uname -m)" in
  x86_64|amd64)  ARCH="x64" ;;
  arm64|aarch64)  ARCH="arm64" ;;
  *)              error "Unsupported architecture: $(uname -m)" ;;
esac

TARGET="${BINARY_NAME}-${OS}-${ARCH}"
DOWNLOAD_URL="https://github.com/${REPO}/releases/latest/download/${TARGET}.tar.gz"

info "Installing Sevalla CLI (${OS}/${ARCH})..."

# Download and extract to temp directory
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

curl -fsSL "$DOWNLOAD_URL" -o "${TMPDIR}/${TARGET}.tar.gz" || error "Download failed. Check https://github.com/${REPO}/releases for available binaries."
tar -xzf "${TMPDIR}/${TARGET}.tar.gz" -C "$TMPDIR"
chmod +x "${TMPDIR}/${TARGET}"

# Install
if mv "${TMPDIR}/${TARGET}" "${INSTALL_DIR}/${BINARY_NAME}" 2>/dev/null; then
  :
else
  sudo mv "${TMPDIR}/${TARGET}" "${INSTALL_DIR}/${BINARY_NAME}"
fi

success "Sevalla CLI installed to ${INSTALL_DIR}/${BINARY_NAME}"
echo ""
info "Run 'sevalla login' to get started."
