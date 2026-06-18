# luxuuuuuuuu.github.io

一个可直接部署到 GitHub Pages 的个人主页博客模板，纯静态、无构建依赖。

## 已包含

- 首页 Hero、关于我、项目展示、联系区
- 博客列表、标签过滤、文章详情页（基于 hash 路由）
- 响应式布局，适配桌面和移动端
- 可直接推到 `luxuuuuuuuu.github.io` 仓库作为用户主页站点

## 文件结构

```text
.
├── index.html
├── main.js
├── styles.css
└── README.md
```

## 如何改成你自己的内容

1. 打开 `main.js`
2. 修改 `posts` 数组中的文章标题、日期、标签和正文
3. 修改 `projects` 数组中的项目说明
4. 打开 `index.html`
5. 替换“关于我”和“联系”部分的占位文案与链接

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库：`luxuuuuuuuu.github.io`
2. 把当前目录中的文件推到仓库根目录
3. 等待 GitHub Pages 自动发布
4. 访问 `https://luxuuuuuuuu.github.io`

这是用户主页仓库，所以默认发布根目录内容，不需要额外构建配置。
