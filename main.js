const posts = [
  {
    slug: "building-in-public",
    title: "把个人主页当成公开工作台",
    date: "2026-06-12",
    readTime: "4 min",
    tags: ["Blog", "Personal Branding"],
    excerpt:
      "个人主页不该只是一个静态名片。更好的方式是把它变成作品集、写作入口和长期成长记录。",
    paragraphs: [
      "很多个人主页的问题，不是设计太普通，而是信息密度太低。打开后只看到一句自我介绍和几个外链，别人很难建立对你的明确印象。",
      "更有效的结构是：先告诉访问者你是谁、正在做什么，再给出可验证的内容，比如项目、文章、公开笔记和联系方式。这样主页就不只是“介绍”，而是证据。",
      "如果你把 GitHub Pages 作为长期站点，静态站点已经足够覆盖绝大多数需求。先保证持续更新，再考虑更复杂的 CMS 或评论系统。"
    ]
  },
  {
    slug: "small-systems-big-learning",
    title: "小项目为什么更适合积累方法论",
    date: "2026-05-28",
    readTime: "5 min",
    tags: ["Projects", "Learning"],
    excerpt:
      "真正能沉淀能力的，往往不是最宏大的项目，而是那些能完整交付、能复盘的中小型实践。",
    paragraphs: [
      "大型项目常常把注意力吸走到协作、依赖和排期上，最后留下来的技术复盘反而很少。小项目的优势是边界清晰，能更快形成闭环。",
      "当你自己定义需求、实现、上线、记录问题和改进方案时，方法论就开始出现了。博客最适合承接这类过程性输出。",
      "把每个项目拆成背景、方案、踩坑、结果四个部分，再用统一模板发布，几个月后你会得到一套非常清晰的成长档案。"
    ]
  },
  {
    slug: "writing-as-debugging",
    title: "写作也是一种调试",
    date: "2026-04-17",
    readTime: "3 min",
    tags: ["Writing", "Thinking"],
    excerpt:
      "很多模糊的理解，只有写下来时才会暴露问题。写作本身就是梳理结构、发现漏洞的过程。",
    paragraphs: [
      "当你尝试把一个想法讲清楚时，哪些地方只能靠直觉，哪些地方缺证据，会立刻显现出来。这一点和调试程序很像。",
      "好的博客不一定追求高频，但应该追求可复用。哪怕是一篇几百字的短文，只要能明确记录问题、判断和结论，就有长期价值。",
      "长期写作的人，通常也更容易形成自己的技术判断，因为他们被迫一次次把模糊观点压缩成可公开表达的内容。"
    ]
  }
];

const projects = [
  {
    name: "Course Lab Notes",
    description:
      "把课程实验中的关键实现、错误案例和调试经验整理成系列笔记，方便回顾和展示。",
    stack: "Markdown / Static Site / GitHub Pages",
    links: ["文档归档", "持续更新"]
  },
  {
    name: "Frontend Playground",
    description:
      "用于沉淀页面设计、交互原型和组件实验的小型前端作品集合，适合挂在主页展示。",
    stack: "HTML / CSS / JavaScript",
    links: ["Demo 展示", "源码整理"]
  },
  {
    name: "Weekly Review",
    description:
      "每周总结学习主题、完成内容和下一步计划。作为博客栏目的固定节奏，比零散发文更容易持续。",
    stack: "Writing Workflow / Personal Ops",
    links: ["周记模板", "复盘入口"]
  }
];

const state = {
  tag: "All"
};

const postList = document.getElementById("post-list");
const featuredPost = document.getElementById("featured-post");
const projectList = document.getElementById("project-list");
const tagFilter = document.getElementById("tag-filter");
const postDetail = document.getElementById("post-detail");
const postDetailSection = document.getElementById("post-detail-section");

function formatDate(dateText) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(dateText));
}

function getAllTags() {
  const tags = new Set(["All"]);
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return [...tags];
}

function getVisiblePosts() {
  if (state.tag === "All") {
    return posts;
  }

  return posts.filter((post) => post.tags.includes(state.tag));
}

function renderTags() {
  tagFilter.innerHTML = getAllTags()
    .map(
      (tag) => `
        <button class="tag-button ${tag === state.tag ? "active" : ""}" data-tag="${tag}">
          ${tag}
        </button>
      `
    )
    .join("");

  tagFilter.querySelectorAll("[data-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tag = button.dataset.tag;
      renderWriting();
    });
  });
}

function renderFeatured(post) {
  featuredPost.innerHTML = `
    <div class="featured-layout">
      <div>
        <p class="eyebrow">Featured Post</p>
        <h3>${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <a class="button button-primary" href="#post/${post.slug}">阅读全文</a>
      </div>
      <div>
        <p class="post-meta">${formatDate(post.date)} · ${post.readTime}</p>
        <div class="tag-row">
          ${post.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderPostCards(visiblePosts) {
  postList.innerHTML = visiblePosts
    .map(
      (post) => `
        <article class="card post-card">
          <p class="post-meta">${formatDate(post.date)} · ${post.readTime}</p>
          <h3>${post.title}</h3>
          <p class="post-excerpt">${post.excerpt}</p>
          <div class="tag-row">
            ${post.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
          </div>
          <a class="post-link" href="#post/${post.slug}">查看文章</a>
        </article>
      `
    )
    .join("");
}

function renderProjects() {
  projectList.innerHTML = projects
    .map(
      (project) => `
        <article class="card project-card">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <p class="post-meta">${project.stack}</p>
          <p class="project-links">${project.links.join(" / ")}</p>
        </article>
      `
    )
    .join("");
}

function renderWriting() {
  const visiblePosts = getVisiblePosts();
  renderTags();
  renderFeatured(visiblePosts[0] || posts[0]);
  renderPostCards(visiblePosts);
}

function renderPostDetailByHash() {
  const hash = window.location.hash;

  if (!hash.startsWith("#post/")) {
    postDetailSection.classList.add("hidden");
    return;
  }

  const slug = hash.replace("#post/", "");
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    postDetailSection.classList.remove("hidden");
    postDetail.innerHTML = `
      <p class="eyebrow">404</p>
      <h1>文章不存在</h1>
      <p>这个链接指向的文章还没有创建，先回到博客列表继续浏览。</p>
    `;
    return;
  }

  postDetailSection.classList.remove("hidden");
  postDetail.innerHTML = `
    <p class="eyebrow">Article</p>
    <h1>${post.title}</h1>
    <p class="post-meta">${formatDate(post.date)} · ${post.readTime}</p>
    <div class="tag-row">
      ${post.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("")}
    </div>
    <div class="post-body">
      ${post.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
  `;
}

function renderCounts() {
  document.getElementById("post-count").textContent = String(posts.length);
  document.getElementById("project-count").textContent = String(projects.length);
  document.getElementById("current-year").textContent = String(
    new Date().getFullYear()
  );
}

function init() {
  renderCounts();
  renderWriting();
  renderProjects();
  renderPostDetailByHash();
}

window.addEventListener("hashchange", renderPostDetailByHash);
window.addEventListener("DOMContentLoaded", init);
