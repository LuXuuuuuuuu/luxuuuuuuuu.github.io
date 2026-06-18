/* =====================================================================
 *  站点配置 —— 只改这一个文件就能更新主页的大部分内容
 *  改完保存后刷新页面即可看到效果（文章内容在 posts/ 目录里单独管理）
 * ===================================================================== */
window.SITE_CONFIG = {
  /* 浏览器标签页标题 */
  title: "LuxLog",

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
    image: "assets/IMG_20260605_183710.jpg", // 例如："assets/background.jpg"
    overlay: 0.72,
    fixed: true,
  },

  /* 首屏 Hero 区 */
  hero: {
    eyebrow: "Personal Homepage / Blog",
    heading: "Welcome to LuxLog",
    text: "这是 Luxu 的webset，分享一些有趣的东西",
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
      title: "状态",
      text: "NJUSE 23级 考研ing",
    },
    
    
  ],

  /* 项目展示（卡片，可增删） */
  projects: [
    {
      name: "Technical Notes",
      
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
    
    links: [
      { label: "GitHub", href: "https://github.com/LuXuuuuuuuu" },
      { label: "Email", href: "mailto:231250073@smail.nju.edu.cn" },
      { label: "知乎", href: "https://www.zhihu.com/people/abc-46-6-42" },
    ],
  },

  /* 页脚 */
  footer: {
    text: "LuxLog",
  },
};
