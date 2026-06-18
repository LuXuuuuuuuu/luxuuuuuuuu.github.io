# luxuuuuuuuu.github.io

Luxu 的个人主页与博客 —— 纯静态、零依赖、零构建，直接部署在 GitHub Pages。

线上地址： https://luxuuuuuuuu.github.io

---

## 目录结构

```
.
├── index.html        页面骨架（一般不用动）
├── styles.css        样式（深/浅色主题都在这里）
├── main.js           渲染逻辑 + 内置 Markdown 解析（一般不用动）
├── config.js         ⭐ 站点配置：标题、简介、背景图、项目、联系方式
├── posts/
│   ├── posts.json    ⭐ 文章清单（哪些 .md 会显示）
│   └── *.md          ⭐ 每篇文章一个 Markdown 文件
├── assets/           图片目录（背景图、封面、插图）
├── new-post.sh       新建文章脚本
└── publish.sh        一键提交并推送
```

带 ⭐ 的是日常需要改的文件。

---

## 三件最常做的事

### 1. 写一篇新文章

```bash
./new-post.sh "我的文章标题"
```

会在 `posts/` 下生成一个 `.md` 文件并自动登记。用编辑器打开它，
开头是文章信息（标题/日期/标签/摘要/封面），下面用 Markdown 写正文。

> 也可以手动操作：在 `posts/` 新建一个 `.md` 文件，再把文件名加进
> `posts/posts.json` 数组即可。

文章开头的元信息示例：

```markdown
---
title: 文章标题
date: 2026-06-18
tags: 随笔, 技术
excerpt: 显示在卡片上的一句话摘要
cover: assets/cover.jpg
---

正文从这里开始……
```

- `tags` 用英文逗号分隔，会自动变成可筛选的标签
- `cover` 可留空（不显示封面图）
- 阅读时长会根据正文长度自动计算

### 2. 换背景图 / 改主页文字

打开 `config.js`：

- **背景图**：把图片放进 `assets/`，然后填
  `background.image: "assets/background.jpg"`；
  `overlay` 调蒙版浓度（0.55~0.8 之间阅读体验最好），留空 `""` 则用默认渐变。
- **个人简介、项目、联系方式**：都在 `config.js` 里对应字段直接改。

### 3. 发布到线上

```bash
./publish.sh "这次改了什么"
```

提交并推送后，约 1 分钟 GitHub Pages 会自动更新线上页面。

---

## 本地预览

因为文章是通过 `fetch` 加载的，直接双击 `index.html` 用 `file://` 打开会被浏览器拦截。
请用一个本地服务器预览：

```bash
# 任选其一，在项目根目录运行
python -m http.server 8000
# 或
npx serve .
```

然后浏览器打开 http://localhost:8000 。

---

## Markdown 支持的语法

标题、**加粗**、*斜体*、`行内代码`、代码块、引用、有序/无序列表、
分隔线、链接、图片。够日常写作使用，且无需任何外部依赖。
