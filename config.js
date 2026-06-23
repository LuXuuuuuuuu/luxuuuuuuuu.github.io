/* =====================================================================
 *  站点配置 —— 只改这一个文件就能更新主页的大部分内容
 *  改完保存后刷新页面即可看到效果（文章内容在 posts/ 目录里单独管理）
 *  ⚠️ 改完建议先运行： node -e 'global.window={};require("./config.js");console.log("ok")'
 *     来检查有没有语法错误（比如漏了逗号、引号、key），再刷新页面。
 * ===================================================================== */
window.SITE_CONFIG = {
  /* 浏览器标签页标题 */
  title: "Lucks' Space",

  /* 左上角品牌标识 */
  brand: {
    mark: "Lucks", // 图标里的文字
    text: "Lucks' Space", // 站点名称
  },

  /* ---------------------------------------------------------------
   *  背123景图片
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
    heading: "Welcome to Lucks Space, may the lucks be with you forever!",
    
    primaryText: "开始阅读",
    primaryHref: "#writing",
    secondaryText: "联系我",
    secondaryHref: "#contact",
  },

  /* 右侧 “Now” 面板，想写几条写几条 */
  now: [
    "分享一些生活趣事"
  ],

  /* ---------------------------------------------------------------
   *  关于（导航栏“关于”点进来的个人简介）
   *  - photo：照片路径，先用现有图占位，换成你自己的照片即可
   *    （把照片放进 assets/ 后，把下面路径改成 assets/你的文件名）
   *    留空 ("") 会显示一个“照片位”占位框
   *  - bio：个人简介正文，支持换行（直接在引号里敲回车，或用 \n）
   * --------------------------------------------------------------- */
  about: {
    photo: "../assets/self.jpg",
    bio:"我叫芦旭，NJUSE 23级本科生，在这里分享一些有趣的东西（目前看来有些内容已经不有趣了，特指“疲于应付”系列）",
  },

  /* 联系方式（label + href + icon，可增删；icon 可选 github / email / zhihu） */
  contact: {
    
    links: [
      { label: "Email", href: "mailto:231250073@smail.nju.edu.cn", icon: "email" },
      { label: "GitHub", href: "https://github.com/LuXuuuuuuuu", icon: "github" },
      // ↓ 把下面的 your_username 换成你的 Instagram 用户名
      { label: "Instagram", href: "https://www.instagram.com/luxu051109", icon: "instagram" },
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
   *  访客统计（基于免费计数 API：Abacus，无需注册）
   *  - enabled 设为 false 可关闭，显示在底部“总访问量 / 访客数”
   *  - 和原来的 busuanzi 不同，这里刷新页面【不会】重复 +1：
   *      · 总访问量(pv)：同一浏览器【每天】只 +1 一次
   *      · 访客数(uv)：同一浏览器【一辈子】只 +1 一次（清掉浏览器数据会重新算）
   *  - namespace 是你这个站点的“命名空间”，保持唯一即可（别和别人重名）
   *  - 数字是从 0 重新开始统计的（旧的 busuanzi 数字本来也读不出来）
   * --------------------------------------------------------------- */
  stats: {
    enabled: true,
    api: "https://abacus.jasoncameron.dev",
    namespace: "luxuuuuuuuu-github-io",
    pvKey: "site-pv",
    uvKey: "site-uv",
  },

  /* 页脚 */
  footer: {
    text: "Lux Log",
  },
};
