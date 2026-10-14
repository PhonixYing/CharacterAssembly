# Character Assembly

GitHub Pages website for Character Assembly, a Chinese character, idiom, and classical text puzzle app for iPhone and iPad.

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

## Internationalization

The site ships six locales through a dependency-free client-side switcher in `assets/i18n.js`:

| Locale | Code | `<html lang>` |
| --- | --- | --- |
| English (default + fallback) | `en` | `en` |
| Simplified Chinese | `zh` | `zh-CN` |
| Spanish | `es` | `es` |
| French | `fr` | `fr` |
| German | `de` | `de` |
| Portuguese | `pt` | `pt` |

Locale resolution order:

1. `?lang=xx` query parameter, e.g. `/CharacterAssembly/?lang=de` (shareable links; treated as an explicit choice)
2. `localStorage` key `characterAssembly.locale` — the visitor's own pick, and it always wins over the browser language
3. Browser system language (`navigator.languages`), used for automatic matching on a first visit
4. English

English is also the fallback: any key missing from another locale falls back to the English copy. The English text is what the HTML contains, so the page still reads correctly without JavaScript.

Choosing a language in the header select re-renders the page in place, remembers the choice in `localStorage` and rewrites the `lang` query parameter. `<html lang>`, `<title>`, the description and the Open Graph tags are updated as well. Each page starts with a small inline script that resolves the locale before the first paint and hides the body until the translation is applied, so visitors never see a flash of the default English.

### Editing copy

All copy lives in `assets/i18n.js`:

- `MESSAGES` — shared copy plus the home page (`home.*`, `nav.*`, `footer.*`, `store.*`)
- `PAGE_MESSAGES` — per-page copy, selected by the `data-i18n-page` attribute on `<html>` (`privacy`, `notFound`)

Bind strings in HTML with these attributes:

| Attribute | Effect |
| --- | --- |
| `data-i18n="key"` | replaces the element text |
| `data-i18n-html="key"` | replaces the element HTML (copy containing markup) |
| `data-i18n-content="key"` | sets the `content` attribute (meta tags) |
| `data-i18n-aria-label` / `-alt` / `-title` / `-placeholder="key"` | sets the matching attribute |
| `data-i18n-page="privacy"` on `<html>` | loads that page's copy table |
| `data-lang-switch` | placeholder element that receives the language `<select>` |

English text stays in the HTML as the no-JavaScript fallback, and any missing key falls back to the default locale.

### Adding a language

1. Register the code in `SUPPORTED_LOCALES`, `LOCALE_LABELS` (native label shown in the switcher) and `HTML_LANG` in `assets/i18n.js`.
2. Add a complete copy table to `MESSAGES[<code>]`, plus an entry in every page table of `PAGE_MESSAGES`.

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
3. 新区块文案若需要在首页多语言切换，在 `assets/i18n.js` 的 `MESSAGES.en` 与 `MESSAGES.zh` 中补同名 key（其他语言自动回退英文）。
4. 把新 URL 追加到本仓库 `sitemap.xml`、`feed.xml`，以及上级站点 `PhonixYing.github.io/sitemap.xml`。
5. 推送后，在 Google Search Console 用「网址检查 → 请求编入索引」提交新页面。

搜索引擎设置：

- Search Console 已有 `https://phonixying.github.io/` 属性，`/CharacterAssembly/` 属于同一主机，可直接提交这两个站点地图：
  `https://phonixying.github.io/CharacterAssembly/sitemap.xml` 与 `https://phonixying.github.io/sitemap.xml`。
- 想单独看这个 App 的数据，可再新增「网址前缀」属性 `https://phonixying.github.io/CharacterAssembly/`（HTML 文件验证需要把验证文件放到本仓库根目录）。
- App Store 链接与站点地图统一使用绝对地址，避免多语言 URL（`?lang=xx`）被当成重复页。
