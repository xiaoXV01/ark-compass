#!/usr/bin/env bash
# Ark & Compass 后端启动脚本（使用 Node 22 原生 --env-file 加载 .env）
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Node 22 原生加载 .env 文件（无需额外依赖）
exec node --env-file=.env index.js
