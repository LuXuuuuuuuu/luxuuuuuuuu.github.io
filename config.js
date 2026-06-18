/* =====================================================================
 *  站点配置 —— 只改这一个文件就能更新主页的大部分内容
 *  改完保存后刷新页面即可看到效果（文章内容在 posts/ 目录里单独管理）
 *  ⚠️ 改完建议先运行： node -e 'global.window={};require("./config.js");console.log("ok")'
 *     来检查有没有语法错误（比如漏了逗号、引号、key），再刷新页面。
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
   *  - 路径用正斜杠 "/"，例如 assets/background.jpg（不要用反斜杠 \）
   *  - overlay 是蒙版浓度：0 = 完全显示原图，1 = 完全被纸色盖住
   *    （建议 0.55 ~ 0.85，太低会影响文字阅读）
   *  - fixed 为 true 时背景固定不随滚动移动
   * --------------------------------------------------------------- */
  background: {
    image: "assets/IMG_20260605_183710.jpg",
    overlay: 0.72,
    fixed: true,
  },

  /* 首屏 Hero 区 */
  hero: {
    eyebrow: "Personal Homepage / Blog",
    heading: "Welcome to LuxLog",
    text: "这是 Luxu 的个人主页，分享一些有趣的东西",
    primaryText: "开始阅读",
    primaryHref: "#writing",
    secondaryText: "联系我",
    secondaryHref: "#contact",
  },

  /* 右侧 “Now” 面板，想写几条写几条 */
  now: [
    "NJUSE 23 级，考研 ing",
    "站点形式：纯静态，无依赖，可直接部署",
    "更新方式：新建一个 Markdown 文件即可发布文章",
  ],

  /* 联系方式（label + href，可增删） */
  contact: {
    intro: "欢迎通过下面任意方式找到我。",
    links: [
      { label: "GitHub", href: "https://github.com/LuXuuuuuuuu" },
      { label: "Email", href: "mailto:231250073@smail.nju.edu.cn" },
      { label: "知乎", href: "https://www.zhihu.com/people/abc-46-6-42" },
    ],
  },

  /* ---------------------------------------------------------------
   *  评论（giscus，基于 GitHub Discussions）
   *  开启步骤（一次性）：
   *    1. 确保本仓库是 Public，并在仓库 Settings → General → Features 勾选 Discussions
   *    2. 打开 https://github.com/apps/giscus 安装到本仓库
   *    3. 打开 https://giscus.app ，在“仓库”填 LuXuuuuuuuu/luxuuuuuuuu.github.io
   *       页面会生成 repo-id 和 category-id，把它们填到下面，并把 enabled 改成 true
   * --------------------------------------------------------------- */
  comments: {
    enabled: false,
    repo: "LuXuuuuuuuu/luxuuuuuuuu.github.io",
    repoId: "",           // giscus.app 生成的 data-repo-id
    category: "Announcements",
    categoryId: "",       // giscus.app 生成的 data-category-id
    lang: "zh-CN",
  },

  /* ---------------------------------------------------------------
   *  访客统计（不蒜子 busuanzi，零配置）
   *  - enabled 设为 false 可关闭
   *  - 显示在首页“总访问量 / 访客数”两个数字处
   *  - 这是免费公共服务，偶尔会抽风导致数字不显示，属正常现象
   * --------------------------------------------------------------- */
  stats: {
    enabled: true,
    // 如官方源加载不出来，可换成镜像，例如：
    // script: "https://cdn.jsdelivr.net/gh/aoki-marika/busuanzi@latest/busuanzi.pure.mini.js",
  },

  /* 页脚 */
  footer: {
    text: "LuxLog",
  },
};
