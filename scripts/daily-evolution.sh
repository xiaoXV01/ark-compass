#!/bin/bash
# ==============================================================
# ARSKQ · 每日进化脚本 — 新闻采集 + 题库更新 + 构建部署
# ==============================================================
# 运行方式: 由 OpenClaw cron 每日触发
# 流程: 
#   1. web_search 采集最新 AI 伦理新闻（由 cron 任务中的 AI 代理执行）
#   2. 解析新闻 → 提取维度关键词 → 生成新题目候选
#   3. 验证题目质量后合并入题库
#   4. 构建部署
# ==============================================================

set -euo pipefail

PROJECT_DIR="/home/ubuntu/.openclaw/workspace/ark-compass"
DIST_DIR="/var/www/html/ark"
LOG_DIR="${PROJECT_DIR}/scripts/logs"
TIMESTAMP=$(date +%Y%m%d_%H%M)

mkdir -p "${LOG_DIR}"

echo "[$(date)] === ARSKQ 日报更新开始 ==="

# Step 1: Git pull 确保同步
cd "${PROJECT_DIR}"
git pull --rebase origin master 2>&1 || echo "git pull 失败（可能无远程变更）"

# Step 2: 检查当前题库状态
BBQ_COUNT=$(grep -c "id:" src/services/bbqQuestions.js || echo 0)
echo "当前 BBQ 题数: ${BBQ_COUNT}"

# Step 3: 代码检查 + 构建
echo "--- 构建中 ---"
node --check src/services/bbqQuestions.js 2>&1 || { echo "❌ BBQ 语法错误"; exit 1; }
npm run build 2>&1 || { echo "❌ 构建失败"; exit 1; }
echo "✅ 构建成功"

# Step 4: 部署
sudo rm -rf "${DIST_DIR}"
sudo cp -r dist "${DIST_DIR}"
sudo chown -R www-data:www-data "${DIST_DIR}"
echo "✅ 部署完成"

# Step 5: 记录
echo "[$(date)] === ARSKQ 日报更新完成 ==="
echo "BBQ: ${BBQ_COUNT} 题"
echo ""
