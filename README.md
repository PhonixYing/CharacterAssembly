# 趣学汉字 Fun Hanzi

GitHub Pages website for Fun Hanzi (趣学汉字), a Chinese character, idiom, and classical text puzzle app for iPhone and iPad.

## Local Preview

Open `index.html` directly in a browser, or run a static server from the repository root:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## GitHub Pages

Publish from repository settings:

1. Open `Settings` -> `Pages`.
2. Set `Source` to `Deploy from a branch`.
3. Select branch `main` and folder `/ (root)`.
4. Save.

The site will be available at:

```text
https://phonixying.github.io/CharacterAssembly/
```

## SEO 与推广文章

站点结构：

- `index.html` — 产品首页，内置 `SoftwareApplication`、`FAQPage`、`BreadcrumbList` 结构化数据
- `blog/index.html` — 文章目录
- `blog/*.html` — 推广文章（笔顺、常用汉字、成语、文言文、English）
- `sitemap.xml` / `feed.xml` / `robots.txt` — 收录与订阅入口
- `assets/og-image.png` — 社交分享图（1200×630，OG/Twitter 使用）

新增一篇文章：

1. 复制 `blog/hanzi-stroke-order.html` 作为模板，修改 `<title>`、`description`、`canonical`、OG 标签与 `BlogPosting` 结构化数据。
2. 在 `blog/index.html` 和首页 `#posts` 区块补上卡片链接（内链直接影响收录速度）。
3. 把新 URL 追加到本仓库 `sitemap.xml`、`feed.xml`，以及上级站点 `PhonixYing.github.io/sitemap.xml`。
4. 推送后，在 Google Search Console 用「网址检查 → 请求编入索引」提交新页面。

搜索引擎设置：

- Search Console 已有 `https://phonixying.github.io/` 属性，`/CharacterAssembly/` 属于同一主机，可直接提交这两个站点地图：
  `https://phonixying.github.io/CharacterAssembly/sitemap.xml` 与 `https://phonixying.github.io/sitemap.xml`。
- 想单独看这个 App 的数据，可再新增「网址前缀」属性 `https://phonixying.github.io/CharacterAssembly/`（HTML 文件验证需要把验证文件放到本仓库根目录）。
- 页面内的推广链接（`app-ads.txt` 相关配置在上游站点）与 App Store 链接都使用绝对地址，避免被当成重复页。
