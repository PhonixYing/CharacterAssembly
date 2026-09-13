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
