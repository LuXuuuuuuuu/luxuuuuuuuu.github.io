#!/usr/bin/env bash
# =====================================================================
#  新建一篇文章
#  用法：
#     ./new-post.sh "我的文章标题"
#     ./new-post.sh "我的文章标题" my-custom-slug
#  会在 posts/ 下生成一个 Markdown 文件，并自动登记到 posts/posts.json
# =====================================================================
set -e

cd "$(dirname "$0")"

TITLE="$1"
SLUG="$2"

if [ -z "$TITLE" ]; then
  echo "用法: ./new-post.sh \"文章标题\" [可选的英文slug]"
  exit 1
fi

# 没给 slug 就用当天日期生成
if [ -z "$SLUG" ]; then
  SLUG="post-$(date +%Y%m%d-%H%M%S)"
fi

FILE="posts/${SLUG}.md"
TODAY="$(date +%Y-%m-%d)"

if [ -f "$FILE" ]; then
  echo "❌ 文件已存在: $FILE"
  exit 1
fi

cat > "$FILE" <<EOF
---
title: ${TITLE}
date: ${TODAY}
tags: 随笔
excerpt: 在这里写一句话摘要，会显示在文章卡片上。
cover:
---

在这里开始写正文。支持 Markdown：

## 小标题

- 列表项一
- 列表项二

> 引用块

**加粗**、*斜体*、\`行内代码\`，以及插入图片：

![图片描述](assets/your-image.jpg)
EOF

# 把新文件登记进 posts.json（插到数组开头）—— 优先用 node，没有则用 python
NODE_SCRIPT='const fs=require("fs");const name=process.argv[1]+".md";const p="posts/posts.json";const a=JSON.parse(fs.readFileSync(p,"utf8"));if(!a.includes(name))a.unshift(name);fs.writeFileSync(p,JSON.stringify(a,null,2)+"\n");console.log("已登记到 posts.json");'
PY_SCRIPT='import json,sys;p="posts/posts.json";a=json.load(open(p,encoding="utf-8"));n=sys.argv[1]+".md";(n in a) or a.insert(0,n);json.dump(a,open(p,"w",encoding="utf-8"),ensure_ascii=False,indent=2);open(p,"a",encoding="utf-8").write("\n");print("已登记到 posts.json")'

if command -v node >/dev/null 2>&1; then
  node -e "$NODE_SCRIPT" "$SLUG"
elif command -v python3 >/dev/null 2>&1; then
  python3 -c "$PY_SCRIPT" "$SLUG"
elif command -v python >/dev/null 2>&1; then
  python -c "$PY_SCRIPT" "$SLUG"
else
  echo "⚠️  已生成 $FILE，但未找到 node/python，无法自动更新 posts.json"
  echo "    请手动把 \"${SLUG}.md\" 加到 posts/posts.json 数组开头。"
fi

echo "✅ 已创建文章: $FILE"
echo "   现在用编辑器打开它写正文即可。完成后运行 ./publish.sh 发布。"
