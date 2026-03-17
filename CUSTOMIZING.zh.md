# 自定义 Astrologer

English version: [CUSTOMIZING.md](./CUSTOMIZING.md)

这份文档说明了 Astrologer 推荐的自定义入口与主题自有文件边界，帮助你在升级主题时尽量减少冲突。这些边界能降低合并成本，但如果上游改动与本地自定义发生重叠，仍然可能需要手工处理冲突。

## 用户配置入口

这些文件是放置个人数据与自定义配置的主要位置。它们被设计成尽量减少升级冲突，但如果上游也修改了相同区域，依然可能需要手工合并。

### 配置

| 文件                      | 用途                                                     |
| ------------------------- | -------------------------------------------------------- |
| `src/site.config.ts`      | 站点元数据、部署 URL、作者链接、功能开关、首页 Hero 内容 |
| `src/config/friends.ts`   | 友链数据                                                 |
| `src/styles/fonts.ts`     | 站点使用的字体包导入                                     |
| `src/styles/tokens.css`   | 调色板、字体栈、圆角                                     |
| `src/config/og-colors.ts` | OG 图颜色（`tokens.css` 的 hex 对应值，需要同步维护）    |

### 内容

| 文件                     | 用途                                      |
| ------------------------ | ----------------------------------------- |
| `src/content/blog/`      | 博客文章（按语言分目录，如 `zh/`、`en/`） |
| `src/content/project/`   | 项目内容（同样按语言分目录）              |
| `src/pages/about.mdx`    | 中文关于页                                |
| `src/pages/en/about.mdx` | 英文关于页                                |

### 资源

| 文件                           | 用途                                             |
| ------------------------------ | ------------------------------------------------ |
| `src/assets/avatar.jpg`        | 头像（用于 Hero 和 OG 图）                       |
| `public/favicon.svg`           | 网站图标                                         |
| `public/og-default.png`        | 默认 OG 图（运行 `pnpm generate:og` 重新生成）   |
| `src/assets/default-cover.png` | 默认文章封面（运行 `pnpm generate:og` 重新生成） |

## 主题自有文件

这些文件属于主题引擎本身。升级主题时它们可能被上游更新；除非你明确接受后续手工合并成本，否则不建议直接修改。

- `src/components/` — Astro 组件
- `src/layouts/` — 布局模板
- `src/styles/global.css` — 基础样式、prose 覆盖、代码块样式
- `src/utils/` — 工具函数
- `src/scripts/` — 客户端脚本
- `src/data/` — 类型定义与辅助工具（例如 `Friend` 接口）
- `src/lib/` — 内部库
- `astro.config.ts` — 构建配置与插件管线

## 部分可自定义文件

这些文件常见于“需要保留上游改动，同时也可能存在本地扩展”的场景，升级时更容易出现人工合并。

| 文件              | 你可能会改什么               |
| ----------------- | ---------------------------- |
| `src/i18n/ui.ts`  | 新增翻译键，或增加新语言     |
| `astro.config.ts` | 添加自定义集成、适配器或插件 |

## 修改配色

1. 修改 `src/styles/tokens.css` 中的 `:root`（亮色）和 `.dark`（暗色）token
2. 修改 `src/config/og-colors.ts`，同步更新对应的 hex 值
3. 运行 `pnpm generate:og`，重新生成默认 OG 图与默认封面

最关键的设计参数是 **hue**（默认值 `107.57`，偏暖的“宣纸感”中性色）。统一修改这个值，就可以整体改变站点的色温。

如果你修改了 `author`、`authorUrl`、`subtitle`、`domain` 或 `src/assets/avatar.jpg`，也应该重新运行 `pnpm generate:og`，否则生成出来的默认 OG 图和默认封面仍会使用旧信息。

## 修改字体

字体修改需要联动三个位置：

1. `package.json` — 安装新的 Fontsource 包，例如 `@fontsource-variable/your-font`
2. `src/styles/fonts.ts` — 修改 Fontsource 导入
3. `src/styles/tokens.css` — 更新 `--font-sans` 或 `--font-mono`

`src/layouts/Layout.astro` 现在只负责导入 `src/styles/fonts.ts`，所以绝大多数字体自定义不再需要直接编辑 layout。

## 功能开关

`src/site.config.ts` 中的功能开关同时控制导航显示与路由生成：

| 开关                             | 控制范围                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `enableProjectsShowcase`         | 项目列表页、项目详情页、项目 OG 路由，以及首页 Recent Projects 是否可用      |
| `enableAboutMe`                  | 关于页导航链接（页面本身仍会构建；如果要彻底移除，请删除 `.mdx` 文件）       |
| `enableFriendLinks`              | 友链页                                                                       |
| `enableRecentProjectsOnHomepage` | 首页 Recent Projects 区块，但只有在 `enableProjectsShowcase=true` 时才会显示 |

## 站点 URL

`src/site.config.ts` 是部署 URL 的唯一来源。`astro.config.ts` 会直接读取 `siteConfig.site`，所以你只需要改这一处。

## 添加新语言

新增语言需要同时修改多个位置：

1. `src/i18n/ui.ts` — 添加到 `languages`，补全 `ui` 翻译，并在 `localeByLang` 中加入 locale 映射
2. `src/site.config.ts` — 在 `locales` 中增加该语言的配置（标题、作者、描述、关键词、Hero）
3. 新建内容目录：`src/content/blog/{lang}/`、`src/content/project/{lang}/`
4. 新建关于页：`src/pages/{lang}/about.mdx`

## 升级主题

```bash
# 如果还没有上游仓库
git remote add upstream https://github.com/KyleRicardo/astrologer.git

# 拉取并合并
git fetch upstream
git merge upstream/main
```

最容易出现冲突的是你直接自定义过的文件。主题自有文件通常更容易跟进上游，但如果上游重构碰到了同一段代码，也不能保证一定无冲突。
