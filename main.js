/* =====================================================================
 *  main.js —— 站点渲染逻辑
 *  - 读取 config.js 渲染主页
 *  - 从 posts/ 目录加载 Markdown 文章
 *  - 内置轻量 Markdown / frontmatter 解析器（无外部依赖）
 *  绝大多数日常修改都不需要碰这个文件。
 * ===================================================================== */

const CONFIG = window.SITE_CONFIG || {};

/* ---------------------------------------------------------------------
 *  工具函数
 * ------------------------------------------------------------------- */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(dateText) {
  if (!dateText) return "";
  const d = new Date(dateText);
  if (isNaN(d.getTime())) return dateText;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/* 根据正文长度估算阅读时间（中文约每分钟 400 字） */
function estimateReadTime(body) {
  const chars = body.replace(/\s/g, "").length;
  const minutes = Math.max(1, Math.round(chars / 400));
  return `${minutes} min`;
}

/* ---------------------------------------------------------------------
 *  Markdown 解析器（支持标题/列表/引用/代码块/行内格式/图片/链接/分隔线）
 * ------------------------------------------------------------------- */
function parseInline(text) {
  // 保护原生 HTML 和行内代码，再做其余 Markdown 处理
  let t = String(text);
  const rawHtml = [];
  const codeSpans = [];

  t = t.replace(/<\/?[A-Za-z][^>]*>/g, (tag) => {
    const token = `@@RAW_HTML_${rawHtml.length}@@`;
    rawHtml.push(tag);
    return token;
  });

  t = escapeHtml(t);

  t = t.replace(/`([^`]+)`/g, (_, c) => {
    const token = `@@CODE_SPAN_${codeSpans.length}@@`;
    codeSpans.push(c);
    return token;
  });

  t = t.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    '<img alt="$1" src="$2" loading="lazy">'
  );
  t = t.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
  );
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  t = t.replace(/@@CODE_SPAN_(\d+)@@/g, (_, i) => `<code>${codeSpans[Number(i)]}</code>`);
  t = t.replace(/@@RAW_HTML_(\d+)@@/g, (_, i) => rawHtml[Number(i)]);
  return t;
}

function parseMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let i = 0;
  let listType = null;

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    const codeFence = line.match(/^```([^\s`]*)?\s*$/);
    if (codeFence) {
      closeList();
      const lang = (codeFence[1] || "").trim();
      i++;
      const code = [];
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++;
      const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      html += `<pre><code${langAttr}>${escapeHtml(code.join("\n"))}</code></pre>`;
      continue;
    }

    if (/^\s*$/.test(line)) {
      closeList();
      i++;
      continue;
    }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      closeList();
      html += "<hr>";
      i++;
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const lvl = h[1].length;
      html += `<h${lvl}>${parseInline(h[2])}</h${lvl}>`;
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      closeList();
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html += `<blockquote>${parseInline(quote.join(" "))}</blockquote>`;
      continue;
    }

    if (/^\s*<\/?[A-Za-z][^>]*>\s*$/.test(line)) {
      closeList();
      html += line.trim();
      i++;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      if (listType !== "ul") {
        closeList();
        html += "<ul>";
        listType = "ul";
      }
      html += `<li>${parseInline(line.replace(/^\s*[-*+]\s+/, ""))}</li>`;
      i++;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      if (listType !== "ol") {
        closeList();
        html += "<ol>";
        listType = "ol";
      }
      html += `<li>${parseInline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`;
      i++;
      continue;
    }

    closeList();
    const para = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6}\s|>|```|\s*<\/?[A-Za-z][^>]*>\s*$|\s*[-*+]\s|\s*\d+\.\s)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    html += `<p>${parseInline(para.join(" "))}</p>`;
  }

  closeList();
  return html;
}

/* ---------------------------------------------------------------------
 *  frontmatter 解析（文章头部 --- 之间的元信息）
 * ------------------------------------------------------------------- */
function parseFrontmatter(text) {
  const m = text.match(/^﻿?---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  m[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx > -1) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key) meta[key] = value;
    }
  });
  return { meta, body: m[2] };
}

/* ---------------------------------------------------------------------
 *  状态与 DOM 引用
 * ------------------------------------------------------------------- */
const state = { tag: "All", query: "", posts: [], lastView: "home" };

const dom = {
  postList: document.getElementById("post-list"),
  featuredPost: document.getElementById("featured-post"),
  tagFilter: document.getElementById("tag-filter"),
  categoryList: document.getElementById("category-list"),
  searchInput: document.getElementById("search-input"),
  postDetail: document.getElementById("post-detail"),
  postDetailSection: document.getElementById("post-detail-section"),
  backLink: document.querySelector(".back-link"),
  views: Array.from(document.querySelectorAll(".view[data-view]")),
  navLinks: Array.from(document.querySelectorAll(".nav-link[data-view]")),
};

/* ---------------------------------------------------------------------
 *  加载文章
 * ------------------------------------------------------------------- */
async function loadPosts() {
  let manifest;
  try {
    manifest = await fetch("posts/posts.json", { cache: "no-cache" }).then((r) => r.json());
  } catch (e) {
    console.error("无法读取 posts/posts.json：", e);
    return [];
  }

  const posts = await Promise.all(
    manifest.map(async (file) => {
      try {
        const text = await fetch(`posts/${file}`, { cache: "no-cache" }).then((r) => r.text());
        const { meta, body } = parseFrontmatter(text);
        return {
          slug: file.replace(/\.md$/, ""),
          title: meta.title || file,
          date: meta.date || "",
          tags: (meta.tags || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          excerpt: meta.excerpt || "",
          cover: meta.cover || "",
          body,
          readTime: estimateReadTime(body),
        };
      } catch (e) {
        console.error(`无法读取文章 ${file}：`, e);
        return null;
      }
    })
  );

  return posts
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/* ---------------------------------------------------------------------
 *  渲染：博客
 * ------------------------------------------------------------------- */
function getAllTags() {
  const tags = new Set(["All"]);
  state.posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return [...tags];
}

function getVisiblePosts() {
  const q = state.query.trim().toLowerCase();
  return state.posts.filter((post) => {
    const tagOk = state.tag === "All" || post.tags.includes(state.tag);
    if (!tagOk) return false;
    if (!q) return true;
    const haystack = [post.title, post.excerpt, post.tags.join(" "), post.body]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function isFiltering() {
  return state.tag !== "All" || state.query.trim() !== "";
}

function renderTags() {
  dom.tagFilter.innerHTML = getAllTags()
    .map(
      (tag) => `
        <button class="tag-button ${tag === state.tag ? "active" : ""}" data-tag="${tag}">
          ${tag}
        </button>`
    )
    .join("");

  dom.tagFilter.querySelectorAll("[data-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tag = button.dataset.tag;
      renderWriting();
    });
  });
}

function renderFeatured(post) {
  if (!post) {
    dom.featuredPost.innerHTML = "";
    return;
  }
  const cover = post.cover
    ? `<div class="featured-cover" style="background-image:url('${post.cover}')"></div>`
    : "";
  dom.featuredPost.innerHTML = `
    <div class="featured-layout">
      <div>
        <p class="eyebrow">New Post</p>
        <h3>${escapeHtml(post.title)}</h3>
        <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
        <a class="button button-primary" href="#post/${post.slug}">阅读全文</a>
      </div>
      <div>
        ${cover}
        <p class="post-meta">${formatDate(post.date)} · ${post.readTime}</p>
        <div class="tag-row">
          ${post.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
        </div>
      </div>
    </div>`;
}

function renderPostCards(visiblePosts) {
  if (!visiblePosts.length) {
    dom.postList.innerHTML = isFiltering()
      ? `<p class="empty-hint">没有匹配的文章，换个关键词或标签试试。</p>`
      : `<p class="empty-hint">还没有文章。</p>`;
    return;
  }
  dom.postList.innerHTML = visiblePosts
    .map(
      (post) => `
        <article class="card post-card">
          ${
            post.cover
              ? `<div class="post-card-cover" style="background-image:url('${post.cover}')"></div>`
              : ""
          }
          <p class="post-meta">${formatDate(post.date)} · ${post.readTime}</p>
          <h3>${escapeHtml(post.title)}</h3>
          <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
          <div class="tag-row">
            ${post.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
          </div>
          <a class="post-link" href="#post/${post.slug}">查看文章 →</a>
        </article>`
    )
    .join("");
}

function renderCategories() {
  if (!dom.categoryList) return;

  const groups = new Map();
  state.posts.forEach((post) => {
    const tags = post.tags.length ? post.tags : ["Uncategorized"];
    tags.forEach((tag) => {
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag).push(post);
    });
  });

  const categories = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  if (!categories.length) {
    dom.categoryList.innerHTML = `<p class="empty-hint">还没有可归类的文章。</p>`;
    return;
  }

  dom.categoryList.innerHTML = categories
    .map(
      ([tag, posts]) => `
        <article class="category-card">
          <p class="eyebrow">Category</p>
          <h3>${escapeHtml(tag)}</h3>
          <p class="category-meta">${posts.length} 篇文章</p>
          <div class="category-posts">
            ${posts
              .map(
                (post) => `
                  <a class="category-post-link" href="#post/${post.slug}">
                    <strong>${escapeHtml(post.title)}</strong>
                    <span>${formatDate(post.date)} · ${post.readTime}</span>
                  </a>`
              )
              .join("")}
          </div>
        </article>`
    )
    .join("");
}

function renderWriting() {
  const visiblePosts = getVisiblePosts();
  renderTags();
  // 过滤/搜索状态下隐藏“精选文章”，避免和结果列表重复
  if (isFiltering()) {
    dom.featuredPost.style.display = "none";
  } else {
    dom.featuredPost.style.display = "";
    renderFeatured(visiblePosts[0] || state.posts[0]);
  }
  renderPostCards(visiblePosts);
}

function initSearch() {
  if (!dom.searchInput) return;
  dom.searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderWriting();
  });
}

function getViewFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "home" || hash === "about" || hash === "blog") return hash;
  return "home";
}

function setActiveNav(view) {
  dom.navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view);
  });
}

function showView(view) {
  dom.views.forEach((section) => {
    section.classList.toggle("active", section.dataset.view === view);
  });
  dom.postDetailSection.classList.add("hidden");
  state.lastView = view;
  setActiveNav(view);
}

function updateBackLink() {
  if (!dom.backLink) return;
  const view = state.lastView || "home";
  const text = view === "blog" ? "← 返回文章列表" : "← 返回首页目录";
  dom.backLink.setAttribute("href", `#${view}`);
  dom.backLink.textContent = text;
}

/* ---------------------------------------------------------------------
 *  渲染：文章详情
 * ------------------------------------------------------------------- */
function renderPostDetailByHash() {
  const hash = window.location.hash;

  if (!hash.startsWith("#post/")) {
    dom.postDetailSection.classList.add("hidden");
    showView(getViewFromHash());
    return;
  }

  const slug = hash.replace("#post/", "");
  const post = state.posts.find((item) => item.slug === slug);

  dom.views.forEach((section) => section.classList.remove("active"));
  dom.postDetailSection.classList.remove("hidden");
  updateBackLink();
  setActiveNav("blog");
  const commentsMount = document.getElementById("comments");

  if (!post) {
    dom.postDetail.innerHTML = `
      <p class="eyebrow">404</p>
      <h1>文章不存在</h1>
      <p>这个链接指向的文章还没有创建，先回到博客列表继续浏览。</p>`;
    if (commentsMount) commentsMount.innerHTML = "";
    return;
  }

  const cover = post.cover
    ? `<div class="article-cover" style="background-image:url('${post.cover}')"></div>`
    : "";

  dom.postDetail.innerHTML = `
    <p class="eyebrow">Article</p>
    <h1>${escapeHtml(post.title)}</h1>
    <p class="post-meta">${formatDate(post.date)} · ${post.readTime}</p>
    <div class="tag-row">
      ${post.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
    </div>
    ${cover}
    <div class="post-body">${parseMarkdown(post.body)}</div>`;

  loadComments(slug);

  window.scrollTo({ top: dom.postDetailSection.offsetTop - 80, behavior: "smooth" });
}

/* ---------------------------------------------------------------------
 *  评论（giscus，基于 GitHub Discussions）
 *  - 每篇文章用 slug 作为唯一标识（data-term），评论互不串台
 *  - 未在 config.js 配置时，显示提示而不报错
 * ------------------------------------------------------------------- */
function loadComments(slug) {
  const mount = document.getElementById("comments");
  if (!mount) return;
  mount.innerHTML = "";

  const c = CONFIG.comments || {};
  if (!c.enabled || !c.repo || !c.repoId || !c.categoryId) {
    mount.innerHTML = `<p class="comments-hint">评论区即将开启 🚧</p>`;
    return;
  }

  const heading = document.createElement("h2");
  heading.className = "comments-title";
  heading.textContent = "评论";
  mount.appendChild(heading);

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", c.repo);
  script.setAttribute("data-repo-id", c.repoId);
  script.setAttribute("data-category", c.category || "Announcements");
  script.setAttribute("data-category-id", c.categoryId);
  script.setAttribute("data-mapping", "specific");
  script.setAttribute("data-term", slug);
  script.setAttribute("data-strict", "1");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "bottom");
  script.setAttribute("data-theme", giscusTheme());
  script.setAttribute("data-lang", c.lang || "zh-CN");
  script.setAttribute("data-loading", "lazy");
  script.crossOrigin = "anonymous";
  script.async = true;
  mount.appendChild(script);
}

function giscusTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function updateCommentTheme() {
  const iframe = document.querySelector("iframe.giscus-frame");
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusTheme() } } },
    "https://giscus.app"
  );
}

/* ---------------------------------------------------------------------
 *  渲染：主页（config 驱动）
 * ------------------------------------------------------------------- */
function renderHomeFromConfig() {
  if (CONFIG.title) document.title = CONFIG.title;

  // 品牌
  const brand = CONFIG.brand || {};
  setText("brand-mark", brand.mark);
  setText("brand-text", brand.text);

  // 关于
  const about = CONFIG.about || {};
  const aboutPhoto = document.getElementById("about-photo");
  if (aboutPhoto) {
    if (about.photo) {
      aboutPhoto.style.backgroundImage = `url('${about.photo}')`;
      aboutPhoto.classList.remove("empty");
      aboutPhoto.textContent = "";
    } else {
      aboutPhoto.classList.add("empty");
      aboutPhoto.textContent = "照片位";
    }
  }
  setText("about-bio", about.bio);

  // 联系方式
  const contact = CONFIG.contact || {};
  setText("contact-intro", contact.intro);
  const contactLinks = document.getElementById("contact-links");
  if (contactLinks && Array.isArray(contact.links)) {
    contactLinks.innerHTML = contact.links
      .map((l) => {
        const external = /^https?:/.test(l.href) ? ' target="_blank" rel="noreferrer"' : "";
        const icon = l.image
          ? `<img class="contact-img" src="${l.image}" alt="${escapeHtml(l.label)}">`
          : CONTACT_ICONS[l.icon] || "";
        return `<a class="contact-link" href="${l.href || "#"}"${external} aria-label="${escapeHtml(
          l.label
        )}" title="${escapeHtml(l.label)}">
          <span class="contact-icon">${icon}</span>
          <span class="contact-label">${escapeHtml(l.label)}</span>
        </a>`;
      })
      .join("");
  }

  // 页脚
  setText("footer-text", (CONFIG.footer && CONFIG.footer.text) || "");
}

/* 联系方式图标（行内 SVG，跟随文字颜色 currentColor） */
const CONTACT_ICONS = {
  email: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  github: `<svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  zhihu: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0H5.72zm1.964 6.717h2.473s-.069 1.327-.498 1.973H9.21v.949c.566.354 1.962 1.501 2.31 1.827l-.756 1.047c-.46-.583-1.012-1.198-1.554-1.774v4.943H7.685v-4.566a13.78 13.78 0 0 1-1.755 2.927c-.232-.485-.515-1.06-.732-1.553a14.05 14.05 0 0 0 2.31-3.8H5.245V8.69h2.44V6.717zm5.469.083h5.097v1.214h-2.165v1.9h2.06v6.395h-1.485l1.114 1.205-.917.749c-.516-.612-1.227-1.355-1.749-1.86l.84-.685c.207.196.447.43.679.665v-5.005h-2.31c-.025.515-.057 1.002-.106 1.467l.527-.337c.516.65 1.143 1.503 1.422 2.07l-.96.629c-.232-.547-.737-1.355-1.21-1.98-.207 1.327-.59 2.43-1.282 3.317-.207-.34-.715-.886-1.024-1.143.965-1.197 1.107-2.957 1.157-4.886V8.014h-1.624V6.8z"/></svg>`,
};

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.textContent = value;
}

function setLink(id, text, href) {
  const el = document.getElementById(id);
  if (!el) return;
  if (text != null) el.textContent = text;
  if (href != null) el.setAttribute("href", href);
}

/* ---------------------------------------------------------------------
 *  背景图片
 * ------------------------------------------------------------------- */
function applyBackground() {
  const bg = CONFIG.background || {};
  if (!bg.image) return;
  const a = bg.overlay == null ? 0.72 : Number(bg.overlay);
  const tint = getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#f7f0e3";
  const rgba = hexToRgba(tint, a);
  document.body.style.backgroundImage = `linear-gradient(${rgba}, ${rgba}), url("${bg.image}")`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = bg.fixed ? "fixed" : "scroll";
  document.body.classList.add("has-bg-image");
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "").trim();
  if (h.length !== 6) return `rgba(247,240,227,${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ---------------------------------------------------------------------
 *  主题（深 / 浅）
 * ------------------------------------------------------------------- */
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  setTheme(theme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
      localStorage.setItem("theme", next);
    });
  }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const toggle = document.getElementById("theme-toggle");
  if (toggle) toggle.textContent = theme === "dark" ? "☀" : "☾";
  // 背景图蒙版颜色会随主题变化，重新应用
  applyBackground();
  // 评论区主题跟随
  updateCommentTheme();
}

/* ---------------------------------------------------------------------
 *  访客统计（基于免费计数 API：Abacus）
 *  - 关键点：刷新页面不会重复 +1
 *      · 总访问量(pv)：同一浏览器每天只 +1 一次，其余时间只“读取”不“增加”
 *      · 访客数(uv)：同一浏览器仅 +1 一次（用 localStorage 记住）
 *  - hit 接口会 +1 并返回最新值；get 接口只读取不增加
 * ------------------------------------------------------------------- */
function initStats() {
  const s = CONFIG.stats || {};
  if (s.enabled === false) return;

  const api = (s.api || "https://abacus.jasoncameron.dev").replace(/\/+$/, "");
  const ns = s.namespace || "luxuuuuuuuu-github-io";
  const pvKey = s.pvKey || "site-pv";
  const uvKey = s.uvKey || "site-uv";

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // mode: "hit" = 计数 +1 并返回最新值；"get" = 只读取当前值
  const fetchCount = async (key, mode) => {
    try {
      const res = await fetch(`${api}/${mode}/${ns}/${key}`, { cache: "no-store" });
      const data = await res.json();
      return typeof data.value === "number" ? data.value : null;
    } catch (e) {
      console.warn("访客统计读取失败：", e);
      return null;
    }
  };

  const show = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value == null ? "—" : value.toLocaleString("en-US");
  };

  // 总访问量：每天每个浏览器只计一次
  const pvDoneToday = localStorage.getItem("stats_pv_date") === today;
  fetchCount(pvKey, pvDoneToday ? "get" : "hit").then((v) => {
    if (!pvDoneToday && v != null) localStorage.setItem("stats_pv_date", today);
    show("stat-pv", v);
  });

  // 访客数：同一浏览器只计一次
  const uvCounted = localStorage.getItem("stats_uv_counted") === "1";
  fetchCount(uvKey, uvCounted ? "get" : "hit").then((v) => {
    if (!uvCounted && v != null) localStorage.setItem("stats_uv_counted", "1");
    show("stat-uv", v);
  });
}

/* ---------------------------------------------------------------------
 *  滚动渐入 + 回到顶部
 * ------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 600);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------------------------------------------------------------------
 *  初始化
 * ------------------------------------------------------------------- */
async function init() {
  renderHomeFromConfig();
  applyBackground();
  initTheme();
  initBackToTop();
  initSearch();
  initStats();

  setText("current-year", String(new Date().getFullYear()));

  state.posts = await loadPosts();
  setText("post-count", String(state.posts.length));

  renderWriting();
  renderCategories();
  renderPostDetailByHash();
  initScrollReveal();
}

window.addEventListener("hashchange", renderPostDetailByHash);
window.addEventListener("DOMContentLoaded", init);
