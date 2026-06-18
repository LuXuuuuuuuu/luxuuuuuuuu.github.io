/* =====================================================================
 *  站点配置 —— 只改这一个文件就能更新主页的大部分内容
 *  改完保存后刷新页面即可看到效果（文章内容在 posts/ 目录里单独管理）
 *  ⚠️ 改完建议先运行： node -e 'global.window={};require("./config.js");console.log("ok")'
 *     来检查有没有语法错误（比如漏了逗号、引号、key），再刷新页面。
 * ===================================================================== */
window.SITE_CONFIG = {
  /* 浏览器标签页标题 */
  title: "Lux Log",

  /* 左上角品牌标识 */
  brand: {
    mark: "Lux", // 图标里的文字
    text: "Lux Log", // 站点名称
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
    image: "assets/page.jpg",
    overlay: 0.72,
    fixed: true,
  },

  /* 首屏 Hero 区 */
  hero: {
    eyebrow: "Personal Homepage / Blog",
    heading: "Welcome to LuxLog",
    text: "这是 Luxu 的个人主页，分享一些有趣的东西。我的邮箱：231250073@smail.nju.edu.cn，欢迎大家交流想法。",
    primaryText: "开始阅读",
    primaryHref: "#writing",
    secondaryText: "联系我",
    secondaryHref: "#contact",
  },

  /* 右侧 “Now” 面板，想写几条写几条 */
  now: [
    "分享一些生活趣事和 cs 知识",
  ],

  /* 联系方式（label + href + icon，可增删；icon 可选 github / email / zhihu） */
  contact: {
    intro: "欢迎通过下面任意方式找到我。",
    links: [
      { label: "Email", href: "mailto:231250073@smail.nju.edu.cn", icon: "email" },
      { label: "GitHub", href: "https://github.com/LuXuuuuuuuu", icon: "github" },
      { label: "知乎", href: "https://www.zhihu.com/people/abc-46-6-42", image: "assets/zhihu.jpg" },
    ],
  },

  /* ---------------------------------------------------------------
   *  评论（giscus，基于 GitHub Discussions）
   *  还差 categoryId 才能真正生效，按下面三步操作（一次性，约 3 分钟）：
   *    1. 开启讨论区：仓库 Settings → General → Features → 勾选 Discussions
   *    2. 安装应用：打开 https://github.com/apps/giscus → Install → 选择本仓库
   *    3. 取 categoryId：打开 https://giscus.app ，“仓库”填
   *       LuXuuuuuuuu/luxuuuuuuuu.github.io ，“Discussion 分类”选 Announcements，
   *       页面下方生成的代码里有 data-category-id="..."，把引号里的值粘到下面 categoryId
   *  （repoId 我已帮你填好；填完 categoryId 保存刷新即可看到评论框）
   * --------------------------------------------------------------- */
  comments: {
    enabled: true,
    repo: "LuXuuuuuuuu/luxuuuuuuuu.github.io",
    repoId: "R_kgDONWCXgg",
    category: "Announcements",
    categoryId: "DIC_kwDONWCXgs4C_ade",
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
    text: "Lux Log",
  },
};
