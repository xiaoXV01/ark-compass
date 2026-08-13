#!/usr/bin/env bash
# Ark & Compass 后端启动脚本（带 .env 环境变量）
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# 若 .env 存在则加载（Node 22 原生 --env-file 支持，这里用 source 导出再传）
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# 默认生产模式启动（当前已在 server 目录）
exec node index.js
