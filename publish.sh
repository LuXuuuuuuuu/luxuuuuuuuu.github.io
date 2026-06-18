#!/usr/bin/env bash
# =====================================================================
#  一键发布：提交所有改动并推送到 GitHub（即更新线上博客）
#  用法：
#     ./publish.sh                 # 使用默认提交信息
#     ./publish.sh "更新某篇文章"   # 自定义提交信息
# =====================================================================
set -e

cd "$(dirname "$0")"

MSG="$1"
if [ -z "$MSG" ]; then
  MSG="Update site ($(date +%Y-%m-%d\ %H:%M))"
fi

if [ -z "$(git status --porcelain)" ]; then
  echo "没有需要提交的改动。"
  exit 0
fi

git add -A
git commit -m "$MSG"
git push

echo "✅ 已推送。稍等约 1 分钟，访问 https://luxuuuuuuuu.github.io 查看更新。"
