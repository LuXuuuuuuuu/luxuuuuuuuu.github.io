/* =====================================================================
 *  站点配置 —— 只改这一个文件就能更新主页的大部分内容
 *  改完保存后刷新页面即可看到效果（文章内容在 posts/ 目录里单独管理）
 * ===================================================================== */
window.SITE_CONFIG = {
  /* 浏览器标签页标题 */
  title: "Luxu | 个人主页与博客",

  /* 左上角品牌标识 */
  brand: {
    mark: "LX", // 圆形图标里的文字
    text: "Luxu Notes", // 站点名称
  },

  /* ---------------------------------------------------------------
   *  背景图片
   *  - image 留空 ("") 则使用默认的渐变背景
   *  - 把图片放进 assets/ 目录，例如 assets/background.jpg
   *  - overlay 是蒙版浓度：0 = 完全显示原图，1 = 完全被纸色盖住
   *    （建议 0.55 ~ 0.8，太低会影响文字阅读）
   *  - fixed 为 true 时背景固定不随滚动移动
   * --------------------------------------------------------------- */
  background: {
    image: "", // 例如："assets/background.jpg"
    overlay: 0.72,
    fixed: true,
  },

  /* 首屏 Hero 区 */
  hero: {
    eyebrow: "Personal Homepage / Blog",
    heading: "把项目、思考和成长轨迹放在同一个地方。",
    text: "这是 Luxu 的个人站点。记录项目、随笔与持续学习，作为公开的工作台。",
    primaryText: "开始阅读",
    primaryHref: "#writing",
    secondaryText: "查看项目",
    secondaryHref: "#projects",
  },

  /* 右侧 “Now” 面板，想写几条写几条 */
  now: [
    "专注方向：前端、系统课程、个人写作",
    "站点形式：纯静态，无依赖，可直接部署",
    "更新方式：新建一个 Markdown 文件即可发布文章",
  ],

  /* 关于我（卡片，可增删） */
  about: [
    {
      title: "身份",
      text: "南京大学在读，关注软件工程与系统方向。这里换成你的简介。",
    },
    {
      title: "关注",
      text: "长期关注的问题，例如软件工程、AI 应用、编译原理、产品设计。",
    },
    {
      title: "写作目的",
      text: "记录实践、沉淀方法、公开作品。让博客成为公开的工作台。",
    },
  ],

  /* 项目展示（卡片，可增删） */
  projects: [
    {
      name: "Course Lab Notes",
      description:
        "把课程实验中的关键实现、错误案例和调试经验整理成系列笔记，方便回顾和展示。",
      stack: "Markdown / Static Site / GitHub Pages",
      links: ["文档归档", "持续更新"],
      href: "", // 可填项目链接，留空则不可点击
    },
    {
      name: "Frontend Playground",
      description:
        "用于沉淀页面设计、交互原型和组件实验的小型前端作品集合，适合挂在主页展示。",
      stack: "HTML / CSS / JavaScript",
      links: ["Demo 展示", "源码整理"],
      href: "",
    },
    {
      name: "Weekly Review",
      description:
        "每周总结学习主题、完成内容和下一步计划，作为博客栏目的固定节奏。",
      stack: "Writing Workflow / Personal Ops",
      links: ["周记模板", "复盘入口"],
      href: "",
    },
  ],

  /* 联系方式（label + href，可增删） */
  contact: {
    intro: "把下面的链接换成你真实的地址，例如 GitHub、邮箱、Bilibili、X 或简历。",
    links: [
      { label: "GitHub", href: "https://github.com/LuXuuuuuuuu" },
      { label: "Email", href: "mailto:hello@example.com" },
      { label: "Resume", href: "#" },
    ],
  },

  /* 页脚 */
  footer: {
    text: "Luxu Notes",
  },
};
