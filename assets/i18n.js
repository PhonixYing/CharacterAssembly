/*
 * Character Assembly — 轻量客户端国际化（i18n）
 *
 * 支持语言：英文 en（默认 + 兜底）、简体中文 zh、西班牙语 es、
 *          法文 fr、德文 de、葡萄牙语 pt
 *
 * 工作方式：
 *   1. HTML 中用 data-i18n="key"           替换元素文本
 *   2. data-i18n-html="key"                替换元素 HTML（词条内可含标签）
 *   3. data-i18n-content="key"             写入 content 属性（meta 标签）
 *   4. data-i18n-aria-label / -alt /
 *      -title / -placeholder="key"         写入对应属性
 *   5. data-lang-switch 容器内自动生成语言下拉框
 *
 * 语言优先级（用户手动选择始终优先）：
 *   URL ?lang=xx > localStorage（用户选择）> 浏览器系统语言 > 默认英文
 *   自动适配只在用户从未主动选择过语言时生效。
 *
 * 兜底：某个语言缺少词条时自动回退到英文（DEFAULT_LOCALE）。
 * HTML 里的静态文案本身就是英文，因此禁用 JS 时页面仍是英文。
 *
 * 新增语言：在 SUPPORTED_LOCALES / LOCALE_LABELS / HTML_LANG 中登记，
 *          并在 MESSAGES（以及 PAGE_MESSAGES 各页面）补一份词条即可。
 */
(function () {
  "use strict";

  var DEFAULT_LOCALE = "en";
  var SUPPORTED_LOCALES = ["en", "zh", "es", "fr", "de", "pt"];
  var LOCALE_LABELS = { en: "English", zh: "中文", es: "Español", fr: "Français", de: "Deutsch", pt: "Português" };
  var HTML_LANG = { en: "en", zh: "zh-CN", es: "es", fr: "fr", de: "de", pt: "pt" };
  var STORAGE_KEY = "characterAssembly.locale";
  var QUERY_KEY = "lang";
  var ATTRIBUTE_BINDINGS = ["content", "aria-label", "alt", "title", "placeholder"];

  var MESSAGES = {
    zh: {
      "lang.label": "语言",
      "nav.home": "首页",
      "nav.features": "功能",
      "nav.stages": "关卡",
      "nav.updates": "更新",
      "nav.privacy": "隐私",
      "nav.download": "下载",
      "footer.tagline": "适用于 iPhone 与 iPad 的字词解谜学习",
      "footer.copyright": "Copyright © 2026 Character Assembly",
      "store.badgeLine": "下载于",
      "store.badgeName": "App Store",
      "store.badgeAria": "从 App Store 下载 Character Assembly",

      "home.meta.title": "Character Assembly | 学汉字、拼成语、读文言文",
      "home.meta.description": "Character Assembly 是一款支持 iPhone、iPad 和 English 界面的中文学习解谜游戏：逐笔描红、拖拽成语、按原文还原文言经典。",
      "home.meta.ogDescription": "逐笔描红、拖拽成语、按原文还原文言经典。",
      "home.hero.eyebrow": "中文学习 × 轻度解谜 · iPhone、iPad 与 English",
      "home.hero.title": "Character Assembly",
      "home.hero.subtitle": "把每一笔、每一个字、每一句经典，拼回正确的位置。",
      "home.hero.copy": "从逐笔描红开始，进入成语拖拽，再到文言文原文排序。第 4 关起，玩家需要自己点击正确笔画完成描红；iPad 会根据横竖屏自动调整布局，英文环境也有对应的关卡与进度文案。",
      "home.hero.ctaFeatures": "查看玩法",
      "home.hero.ctaUpdates": "查看最近更新",
      "home.hero.ctaPrivacy": "隐私政策",
      "home.hero.ctaSupport": "联系支持",
      "home.app.pill": "第 4 关 · 新玩法",
      "home.app.title": "笔顺挑战",
      "home.app.caption": "前三关跟随提示；从第 4 关开始，只点击下方笔画，按正确顺序描红。",
      "home.app.strokeHeading": "木 · 笔顺",
      "home.app.glyphAria": "汉字木",
      "home.app.tapHint": "点击，不拖动",
      "home.features.title": "围绕中文结构设计的解谜体验",
      "home.features.lead": "不是单纯背字或猜答案，而是在笔顺、部件、字序和语义关系里做选择。每种玩法都保留清晰目标、即时反馈和可继续的进度。",
      "home.features.a.title": "逐笔描红",
      "home.features.a.body": "前 3 关提供清晰引导；第 4 关起，笔画全部展示在下方，按正确笔顺点击，选对才会描上。",
      "home.features.b.title": "成语拖拽",
      "home.features.b.body": "把词块拖到目标槽位，完成后点击查看释义；未完成的词块可以双击移回零件区。",
      "home.features.c.title": "文言排序",
      "home.features.c.body": "从打乱的字堆中按原文依次找字，支持中途退出后继续；重新排序按钮让零件区随时换一种排列。",
      "home.features.d.title": "多语言与多尺寸",
      "home.features.d.body": "支持简体中文与 English。iPad 竖屏按手机纵向阅读，横屏把正文、零件和拼图区并排展开。",
      "home.stages.title": "三种玩法，三种节奏",
      "home.stages.lead": "单字是笔顺训练，成语是词序与语义，文言文是长文本复原。关卡数量和目标都保持明确，适合短时间反复挑战，也适合连续学习。",
      "home.stages.a.title": "50 关识字练习",
      "home.stages.a.body": "每关 10 个常用汉字。先熟悉标准笔顺，再逐步从跟随描红进入自主点选。",
      "home.stages.a.note": "500 个常用汉字 · 逐笔反馈",
      "home.stages.b.title": "50 关四字成语",
      "home.stages.b.body": "每关 4 个成语，从高频直观成语进入共享字、主题词和易混典故，完成后可查看释义。",
      "home.stages.b.note": "200 个成语目标 · 拖拽组合",
      "home.stages.c.title": "5 篇文言文",
      "home.stages.c.body": "把长篇内容拆成可操作的字块与步骤，按原文顺序逐字还原，支持断点续玩和重新排序。",
      "home.stages.c.note": "经典文本 · 横屏 iPad 双栏体验",
      "home.updates.title": "最近更新",
      "home.updates.lead": "官网内容同步当前版本的玩法和界面行为，方便你在下载或反馈前快速了解完整体验。",
      "home.updates.a.kicker": "笔顺",
      "home.updates.a.title": "标准笔画提示持续校正",
      "home.updates.a.body": "常见的横撇、竖折、竖弯钩、卧钩、点与捺等容易混淆的提示已统一按笔顺数据校正。",
      "home.updates.b.kicker": "玩法升级",
      "home.updates.b.title": "第 4 关起自主选择笔画",
      "home.updates.b.body": "不再直接给出下一笔提示。所有笔画会摆在下方，玩家只需点击正确的一笔，不需要拖动。",
      "home.updates.c.kicker": "适配",
      "home.updates.c.title": "iPad 横竖屏与 English 文案",
      "home.updates.c.body": "主菜单、成语、文言文和描红页面都按方向自适应；英文环境下的关卡标题与拼字进度也已翻译。",
      "home.band.title": "为移动端学习和休闲解谜设计",
      "home.band.lead": "游戏流程强调快速进入、清晰目标和即时反馈。完成一关后进度会解锁下一关；文言文支持中途继续，适合通勤、课后练习或亲子共玩。",
      "home.band.cta": "反馈建议",
      "home.band.mini1": "笔顺点选",
      "home.band.mini2": "文言排序",
      "home.band.mini3": "iPad 双栏"
    },
    en: {
      "lang.label": "Language",
      "nav.home": "Home",
      "nav.features": "Features",
      "nav.stages": "Levels",
      "nav.updates": "Updates",
      "nav.privacy": "Privacy",
      "nav.download": "Download",
      "footer.tagline": "Character-based puzzle learning for iPhone and iPad",
      "footer.copyright": "Copyright © 2026 Character Assembly",
      "store.badgeLine": "Download on the",
      "store.badgeName": "App Store",
      "store.badgeAria": "Download Character Assembly on the App Store",

      "home.meta.title": "Character Assembly | Learn Chinese characters, idioms and classical texts",
      "home.meta.description": "Character Assembly is a Chinese learning puzzle game for iPhone and iPad: trace every stroke, drag idioms into place and restore classical texts in their original order.",
      "home.meta.ogDescription": "Trace every stroke, drag idioms into place and restore classical texts in their original order.",
      "home.hero.eyebrow": "Chinese learning × light puzzling · iPhone, iPad & English",
      "home.hero.title": "Character Assembly",
      "home.hero.subtitle": "Snap every stroke, every character and every classic line back into place.",
      "home.hero.copy": "Start by tracing each stroke, move on to dragging idioms into place, then restore classical Chinese texts in their original order. From level 4, players pick the correct stroke themselves; iPad adapts its layout to portrait and landscape, and English players get matching level and progress copy.",
      "home.hero.ctaFeatures": "See how it plays",
      "home.hero.ctaUpdates": "See latest updates",
      "home.hero.ctaPrivacy": "Privacy Policy",
      "home.hero.ctaSupport": "Contact support",
      "home.app.pill": "Level 4 · New mode",
      "home.app.title": "Stroke order challenge",
      "home.app.caption": "The first three levels follow the prompts; from level 4 you tap the strokes shown below and trace them in the right order.",
      "home.app.strokeHeading": "木 · Stroke Order",
      "home.app.glyphAria": "The Chinese character 木",
      "home.app.tapHint": "Tap, don't drag",
      "home.features.title": "Puzzles built around the structure of Chinese",
      "home.features.lead": "This is not about memorising characters or guessing answers: you choose based on stroke order, components, character sequence and meaning. Every mode keeps a clear goal, immediate feedback and progress you can pick up again.",
      "home.features.a.title": "Stroke-by-stroke tracing",
      "home.features.a.body": "The first three levels guide you clearly; from level 4 all strokes are shown below — tap them in the right order and only the correct one is traced.",
      "home.features.b.title": "Drag-and-drop idioms",
      "home.features.b.body": "Drag each tile into its target slot, then tap to read the meaning; unfinished tiles can be double-tapped back to the parts tray.",
      "home.features.c.title": "Classical text ordering",
      "home.features.c.body": "Find the characters in the original order from a shuffled pile and pick up where you left off; a reshuffle button rearranges the parts tray at any time.",
      "home.features.d.title": "Multiple languages and sizes",
      "home.features.d.body": "Simplified Chinese and English are supported. On iPad, portrait reads in a single column like a phone, while landscape lays out the text, the parts and the puzzle board side by side.",
      "home.stages.title": "Three modes, three rhythms",
      "home.stages.lead": "Characters train stroke order, idioms train word order and meaning, and classical texts rebuild long passages. Level counts and goals stay clear, so short repeated sessions work as well as longer study.",
      "home.stages.a.title": "50 character levels",
      "home.stages.a.body": "Ten common characters per level. Learn the standard stroke order first, then move from guided tracing to tapping on your own.",
      "home.stages.a.note": "500 common characters · stroke-by-stroke feedback",
      "home.stages.b.title": "50 four-character idiom levels",
      "home.stages.b.body": "Four idioms per level, moving from high-frequency everyday idioms to shared characters, themes and easily confused allusions, with meanings available on completion.",
      "home.stages.b.note": "200 idiom goals · drag to combine",
      "home.stages.c.title": "5 classical texts",
      "home.stages.c.body": "Long passages are split into workable character tiles and steps so you can rebuild them character by character, with resume and reshuffle support.",
      "home.stages.c.note": "Classic texts · two-column iPad landscape",
      "home.updates.title": "Latest updates",
      "home.updates.lead": "The site mirrors the current build's gameplay and interface behaviour, so you can see the full experience before downloading or sending feedback.",
      "home.updates.a.kicker": "Stroke order",
      "home.updates.a.title": "Standard stroke hints keep getting refined",
      "home.updates.a.body": "Hints for easily confused strokes — such as 横撇, 竖折, 竖弯钩, 卧钩, 点 and 捺 — are now aligned with the stroke-order data.",
      "home.updates.b.kicker": "Gameplay",
      "home.updates.b.title": "Choose your own strokes from level 4",
      "home.updates.b.body": "The next stroke is no longer revealed. All strokes are laid out below — just tap the right one, no dragging needed.",
      "home.updates.c.kicker": "Layout",
      "home.updates.c.title": "iPad portrait/landscape and interface copy",
      "home.updates.c.body": "The main menu, idioms, classical texts and tracing screens all adapt to orientation, and level titles plus puzzle progress are localised for the supported languages.",
      "home.band.title": "Designed for mobile learning and casual puzzling",
      "home.band.lead": "The flow favours quick starts, clear goals and immediate feedback. Finishing a level unlocks the next one, and classical texts can be resumed — good for commutes, after-school practice or playing together with family.",
      "home.band.cta": "Send feedback",
      "home.band.mini1": "Stroke tapping",
      "home.band.mini2": "Text ordering",
      "home.band.mini3": "iPad two-column"
    },
    es: {
      "lang.label": "Idioma",
      "nav.home": "Inicio",
      "nav.features": "Funciones",
      "nav.stages": "Niveles",
      "nav.updates": "Novedades",
      "nav.privacy": "Privacidad",
      "nav.download": "Descargar",
      "footer.tagline": "Aprendizaje con puzles de caracteres para iPhone y iPad",
      "footer.copyright": "Copyright © 2026 Character Assembly",
      "store.badgeLine": "Descargar en el",
      "store.badgeName": "App Store",
      "store.badgeAria": "Descargar Character Assembly en el App Store",

      "home.meta.title": "Character Assembly | Aprende caracteres, chengyu y textos clásicos",
      "home.meta.description": "Character Assembly es un juego de puzles para aprender chino en iPhone y iPad: repasa cada trazo, arrastra los chengyu a su sitio y reconstruye textos clásicos en su orden original.",
      "home.meta.ogDescription": "Repasa cada trazo, arrastra los chengyu a su sitio y reconstruye textos clásicos en su orden original.",
      "home.hero.eyebrow": "Aprendizaje de chino × puzle ligero · iPhone, iPad y español",
      "home.hero.title": "Character Assembly",
      "home.hero.subtitle": "Devuelve cada trazo, cada carácter y cada verso clásico a su lugar.",
      "home.hero.copy": "Empieza repasando cada trazo, pasa a arrastrar chengyu y después reconstruye textos clásicos chinos en su orden original. A partir del nivel 4, el jugador elige el trazo correcto por sí mismo; el iPad adapta su diseño al modo vertical y horizontal, y el español cuenta con sus propios textos de nivel y progreso.",
      "home.hero.ctaFeatures": "Ver cómo se juega",
      "home.hero.ctaUpdates": "Ver novedades",
      "home.hero.ctaPrivacy": "Política de privacidad",
      "home.hero.ctaSupport": "Contactar con soporte",
      "home.app.pill": "Nivel 4 · Nuevo modo",
      "home.app.title": "Reto de orden de trazos",
      "home.app.caption": "Los tres primeros niveles siguen las indicaciones; a partir del nivel 4, toca los trazos que aparecen abajo y repásalos en el orden correcto.",
      "home.app.strokeHeading": "木 · Orden de trazos",
      "home.app.glyphAria": "El carácter chino 木",
      "home.app.tapHint": "Toca, no arrastres",
      "home.features.title": "Puzles diseñados en torno a la estructura del chino",
      "home.features.lead": "No se trata de memorizar caracteres ni de adivinar respuestas, sino de elegir a partir del orden de los trazos, los componentes, la secuencia de caracteres y el significado. Cada modo mantiene un objetivo claro, respuesta inmediata y progreso que puedes retomar.",
      "home.features.a.title": "Repaso trazo a trazo",
      "home.features.a.body": "Los tres primeros niveles ofrecen una guía clara; desde el nivel 4 todos los trazos aparecen abajo: tócalos en el orden correcto y solo se dibujará el acertado.",
      "home.features.b.title": "Chengyu con arrastrar y soltar",
      "home.features.b.body": "Arrastra cada pieza a su hueco y tócala para ver el significado; las piezas no usadas vuelven a la bandeja con un doble toque.",
      "home.features.c.title": "Ordenación de textos clásicos",
      "home.features.c.body": "Encuentra los caracteres en el orden original dentro de un montón desordenado y continúa donde lo dejaste; un botón de rebarajado reorganiza la bandeja cuando quieras.",
      "home.features.d.title": "Varios idiomas y tamaños",
      "home.features.d.body": "Compatible con chino simplificado e inglés. En el iPad, el modo vertical se lee en una sola columna como en el móvil y el horizontal coloca el texto, las piezas y el tablero en paralelo.",
      "home.stages.title": "Tres modos, tres ritmos",
      "home.stages.lead": "Los caracteres entrenan el orden de los trazos, los chengyu el orden de las palabras y el significado, y los textos clásicos la reconstrucción de pasajes largos. La cantidad de niveles y los objetivos siguen siendo claros: ideal tanto para sesiones cortas y repetidas como para un estudio continuo.",
      "home.stages.a.title": "50 niveles de caracteres",
      "home.stages.a.body": "Diez caracteres frecuentes por nivel. Familiarízate primero con el orden estándar de los trazos y pasa después del repaso guiado a la selección autónoma.",
      "home.stages.a.note": "500 caracteres frecuentes · respuesta trazo a trazo",
      "home.stages.b.title": "50 niveles de chengyu",
      "home.stages.b.body": "Cuatro chengyu por nivel, desde los más frecuentes y directos hasta caracteres compartidos, temas y alusiones fáciles de confundir, con significados al terminar.",
      "home.stages.b.note": "200 chengyu como objetivo · combinar arrastrando",
      "home.stages.c.title": "5 textos clásicos",
      "home.stages.c.body": "Los pasajes largos se dividen en piezas de caracteres manejables para reconstruirlos carácter a carácter, con posibilidad de retomar y rebarajar.",
      "home.stages.c.note": "Textos clásicos · dos columnas en el iPad horizontal",
      "home.updates.title": "Últimas novedades",
      "home.updates.lead": "La web refleja la jugabilidad y la interfaz de la versión actual, para que conozcas la experiencia completa antes de descargar o enviar comentarios.",
      "home.updates.a.kicker": "Orden de trazos",
      "home.updates.a.title": "Las indicaciones de trazos estándar se siguen afinando",
      "home.updates.a.body": "Las indicaciones de trazos fáciles de confundir —como 横撇, 竖折, 竖弯钩, 卧钩, 点 y 捺— ya siguen los datos del orden de trazos.",
      "home.updates.b.kicker": "Mejora de jugabilidad",
      "home.updates.b.title": "Elige tú los trazos desde el nivel 4",
      "home.updates.b.body": "Ya no se revela el trazo siguiente. Todos los trazos se colocan abajo: solo tienes que tocar el correcto, sin arrastrar.",
      "home.updates.c.kicker": "Adaptación",
      "home.updates.c.title": "iPad vertical/horizontal y textos de interfaz",
      "home.updates.c.body": "El menú principal, los chengyu, los textos clásicos y las pantallas de repaso se adaptan a la orientación, y los títulos de nivel y el progreso también se han traducido.",
      "home.band.title": "Diseñado para el aprendizaje móvil y los puzles casuales",
      "home.band.lead": "El flujo prioriza un inicio rápido, objetivos claros y respuesta inmediata. Completar un nivel desbloquea el siguiente y los textos clásicos se pueden retomar: ideal para el trayecto, para practicar o para jugar en familia.",
      "home.band.cta": "Enviar comentarios",
      "home.band.mini1": "Selección de trazos",
      "home.band.mini2": "Ordenar texto",
      "home.band.mini3": "iPad dos columnas"
    },
    fr: {
      "lang.label": "Langue",
      "nav.home": "Accueil",
      "nav.features": "Fonctionnalités",
      "nav.stages": "Niveaux",
      "nav.updates": "Nouveautés",
      "nav.privacy": "Confidentialité",
      "nav.download": "Télécharger",
      "footer.tagline": "Apprentissage par le puzzle à base de caractères sur iPhone et iPad",
      "footer.copyright": "Copyright © 2026 Character Assembly",
      "store.badgeLine": "Télécharger dans l'",
      "store.badgeName": "App Store",
      "store.badgeAria": "Télécharger Character Assembly dans l'App Store",

      "home.meta.title": "Character Assembly | Apprendre les caractères, les chengyu et les textes classiques",
      "home.meta.description": "Character Assembly est un jeu de puzzle d'apprentissage du chinois pour iPhone et iPad : tracez chaque trait, glissez les chengyu en place et reconstituez les textes classiques dans leur ordre d'origine.",
      "home.meta.ogDescription": "Tracez chaque trait, glissez les chengyu en place et reconstituez les textes classiques dans leur ordre d'origine.",
      "home.hero.eyebrow": "Apprentissage du chinois × puzzle léger · iPhone, iPad et français",
      "home.hero.title": "Character Assembly",
      "home.hero.subtitle": "Replacez chaque trait, chaque caractère et chaque vers classique à sa juste place.",
      "home.hero.copy": "Commencez par tracer chaque trait, passez au glisser-déposer des chengyu, puis reconstituez des textes chinois classiques dans leur ordre d'origine. À partir du niveau 4, le joueur sélectionne lui-même le bon trait ; l'iPad adapte sa mise en page au portrait et au paysage, et la version française dispose de ses propres textes de niveau et de progression.",
      "home.hero.ctaFeatures": "Voir comment jouer",
      "home.hero.ctaUpdates": "Voir les nouveautés",
      "home.hero.ctaPrivacy": "Politique de confidentialité",
      "home.hero.ctaSupport": "Contacter le support",
      "home.app.pill": "Niveau 4 · Nouveau mode",
      "home.app.title": "Défi de l'ordre des traits",
      "home.app.caption": "Les trois premiers niveaux suivent les indications ; à partir du niveau 4, touchez les traits affichés en bas et tracez-les dans le bon ordre.",
      "home.app.strokeHeading": "木 · Ordre des traits",
      "home.app.glyphAria": "Le caractère chinois 木",
      "home.app.tapHint": "Touchez, sans glisser",
      "home.features.title": "Des puzzles pensés autour de la structure du chinois",
      "home.features.lead": "Il ne s'agit pas de mémoriser des caractères ou de deviner des réponses, mais de choisir selon l'ordre des traits, les composants, la séquence des caractères et le sens. Chaque mode conserve un objectif clair, un retour immédiat et une progression reprenable.",
      "home.features.a.title": "Traçage trait par trait",
      "home.features.a.body": "Les trois premiers niveaux offrent un guidage clair ; à partir du niveau 4, tous les traits s'affichent en bas : touchez-les dans le bon ordre, seul le trait correct est tracé.",
      "home.features.b.title": "Chengyu en glisser-déposer",
      "home.features.b.body": "Faites glisser chaque bloc vers son emplacement, puis touchez pour lire la définition ; un bloc non validé peut revenir au bac d'un double tap.",
      "home.features.c.title": "Remise en ordre des textes classiques",
      "home.features.c.body": "Retrouvez les caractères dans l'ordre d'origine depuis un tas mélangé et reprenez où vous vous êtes arrêté ; un bouton de remélange réorganise le bac à tout moment.",
      "home.features.d.title": "Plusieurs langues et formats",
      "home.features.d.body": "Le chinois simplifié et l'anglais sont pris en charge. Sur iPad, le mode portrait se lit en une colonne comme sur téléphone, le mode paysage dispose le texte, les pièces et le plateau côte à côte.",
      "home.stages.title": "Trois modes, trois rythmes",
      "home.stages.lead": "Les caractères entraînent l'ordre des traits, les chengyu l'ordre des mots et le sens, et les textes classiques la reconstruction de longs passages. Le nombre de niveaux et les objectifs restent clairs : idéal pour de courtes sessions répétées comme pour une étude suivie.",
      "home.stages.a.title": "50 niveaux de caractères",
      "home.stages.a.body": "Dix caractères courants par niveau. Familiarisez-vous d'abord avec l'ordre standard des traits, puis passez du traçage guidé à la sélection autonome.",
      "home.stages.a.note": "500 caractères courants · retour trait par trait",
      "home.stages.b.title": "50 niveaux de chengyu",
      "home.stages.b.body": "Quatre chengyu par niveau, des expressions les plus courantes aux caractères partagés, thèmes et allusions faciles à confondre, avec les définitions à la fin.",
      "home.stages.b.note": "200 chengyu à découvrir · combiner en glissant",
      "home.stages.c.title": "5 textes classiques",
      "home.stages.c.body": "Les longs passages sont découpés en blocs de caractères manipulables pour les reconstituer caractère par caractère, avec reprise et remélange.",
      "home.stages.c.note": "Textes classiques · double colonne sur iPad en paysage",
      "home.updates.title": "Dernières nouveautés",
      "home.updates.lead": "Le site reflète le gameplay et l'interface de la version actuelle, pour découvrir l'expérience complète avant de télécharger ou d'envoyer un retour.",
      "home.updates.a.kicker": "Ordre des traits",
      "home.updates.a.title": "Des indications de traits sans cesse affinées",
      "home.updates.a.body": "Les indications des traits faciles à confondre — comme 横撇, 竖折, 竖弯钩, 卧钩, 点 et 捺 — sont désormais alignées sur les données d'ordre des traits.",
      "home.updates.b.kicker": "Nouveau gameplay",
      "home.updates.b.title": "Choisissez vous-même les traits dès le niveau 4",
      "home.updates.b.body": "Le trait suivant n'est plus indiqué. Tous les traits sont disposés en bas : touchez simplement le bon, sans glisser.",
      "home.updates.c.kicker": "Adaptation",
      "home.updates.c.title": "iPad portrait/paysage et textes d'interface",
      "home.updates.c.body": "Le menu principal, les chengyu, les textes classiques et les écrans de traçage s'adaptent à l'orientation ; les titres de niveaux et la progression ont aussi été traduits.",
      "home.band.title": "Conçu pour l'apprentissage mobile et le puzzle casual",
      "home.band.lead": "Le déroulé privilégie une entrée rapide, des objectifs clairs et un retour immédiat. Terminer un niveau débloque le suivant, et les textes classiques sont reprenables — idéal pour les trajets, les révisions ou le jeu en famille.",
      "home.band.cta": "Donner mon avis",
      "home.band.mini1": "Sélection des traits",
      "home.band.mini2": "Ordre des textes",
      "home.band.mini3": "iPad double colonne"
    },
    de: {
      "lang.label": "Sprache",
      "nav.home": "Startseite",
      "nav.features": "Funktionen",
      "nav.stages": "Level",
      "nav.updates": "Updates",
      "nav.privacy": "Datenschutz",
      "nav.download": "Laden",
      "footer.tagline": "Lernen mit Zeichenrätseln für iPhone und iPad",
      "footer.copyright": "Copyright © 2026 Character Assembly",
      "store.badgeLine": "Laden im",
      "store.badgeName": "App Store",
      "store.badgeAria": "Character Assembly im App Store laden",

      "home.meta.title": "Character Assembly | Chinesische Zeichen, Chengyu und klassische Texte lernen",
      "home.meta.description": "Character Assembly ist ein Chinesisch-Lernpuzzle für iPhone und iPad: Zeichen Strich für Strich nachfahren, Chengyu per Drag-and-drop einsetzen und klassische Texte in ihrer Originalreihenfolge wiederherstellen.",
      "home.meta.ogDescription": "Zeichen Strich für Strich nachfahren, Chengyu per Drag-and-drop einsetzen und klassische Texte originalgetreu wiederherstellen.",
      "home.hero.eyebrow": "Chinesisch lernen × leichtes Rätseln · iPhone, iPad und Deutsch",
      "home.hero.title": "Character Assembly",
      "home.hero.subtitle": "Setze jeden Strich, jedes Zeichen und jede klassische Zeile wieder an die richtige Stelle.",
      "home.hero.copy": "Beginne mit dem Nachfahren einzelner Striche, wechsle zum Ziehen von Chengyu und stelle schließlich klassische chinesische Texte in ihrer ursprünglichen Reihenfolge wieder her. Ab Level 4 wählen Spieler den richtigen Strich selbst; das iPad passt sein Layout an Hoch- und Querformat an, und für die deutsche Oberfläche gibt es passende Level- und Fortschrittstexte.",
      "home.hero.ctaFeatures": "So wird gespielt",
      "home.hero.ctaUpdates": "Neueste Updates",
      "home.hero.ctaPrivacy": "Datenschutzerklärung",
      "home.hero.ctaSupport": "Support kontaktieren",
      "home.app.pill": "Level 4 · Neuer Modus",
      "home.app.title": "Herausforderung Strichfolge",
      "home.app.caption": "Die ersten drei Level folgen den Hinweisen; ab Level 4 tippst du die unten gezeigten Striche an und fährst sie in der richtigen Reihenfolge nach.",
      "home.app.strokeHeading": "木 · Strichfolge",
      "home.app.glyphAria": "Das chinesische Zeichen 木",
      "home.app.tapHint": "Tippen, nicht ziehen",
      "home.features.title": "Puzzles rund um die Struktur des Chinesischen",
      "home.features.lead": "Hier geht es nicht ums bloße Auswendiglernen oder Raten, sondern um Entscheidungen anhand von Strichfolge, Bausteinen, Zeichenreihenfolge und Bedeutung. Jeder Modus behält ein klares Ziel, unmittelbares Feedback und fortsetzbaren Fortschritt.",
      "home.features.a.title": "Strich für Strich nachfahren",
      "home.features.a.body": "Die ersten drei Level bieten klare Führung; ab Level 4 werden alle Striche unten angezeigt – tippe sie in der richtigen Reihenfolge an, nur der passende wird nachgefahren.",
      "home.features.b.title": "Chengyu per Drag-and-drop",
      "home.features.b.body": "Ziehe jeden Baustein in den Zielplatz und tippe danach für die Bedeutung; nicht verwendete Bausteine lassen sich per Doppeltipp zurücklegen.",
      "home.features.c.title": "Klassische Texte ordnen",
      "home.features.c.body": "Finde die Zeichen in der Originalreihenfolge aus einem gemischten Haufen und mache später weiter; ein Neumischen-Knopf ordnet die Ablage jederzeit neu.",
      "home.features.d.title": "Mehrere Sprachen und Größen",
      "home.features.d.body": "Unterstützt werden vereinfachtes Chinesisch und Englisch. Auf dem iPad liest sich das Hochformat einspaltig wie am Telefon, das Querformat stellt Text, Bausteine und Spielfeld nebeneinander.",
      "home.stages.title": "Drei Modi, drei Rhythmen",
      "home.stages.lead": "Zeichen trainieren die Strichfolge, Chengyu die Wortstellung und Bedeutung, klassische Texte den Wiederaufbau langer Passagen. Levelanzahl und Ziele bleiben klar – ideal für kurze, wiederholte Sessions wie für längeres Lernen.",
      "home.stages.a.title": "50 Level Zeichenübung",
      "home.stages.a.body": "Zehn häufige Zeichen pro Level. Erst die Standard-Strichfolge lernen, dann vom geführten Nachfahren zum eigenständigen Antippen wechseln.",
      "home.stages.a.note": "500 häufige Zeichen · Feedback Strich für Strich",
      "home.stages.b.title": "50 Chengyu-Level",
      "home.stages.b.body": "Vier Chengyu pro Level – von häufigen, anschaulichen Wendungen über gemeinsame Zeichen und Themen bis zu leicht verwechselbaren Anspielungen, mit Bedeutungen nach dem Abschluss.",
      "home.stages.b.note": "200 Chengyu-Ziele · per Drag-and-drop kombinieren",
      "home.stages.c.title": "5 klassische Texte",
      "home.stages.c.body": "Lange Passagen werden in handhabbare Zeichenbausteine und Schritte zerlegt, die sich Zeichen für Zeichen rekonstruieren lassen – mit Fortsetzen und Neumischen.",
      "home.stages.c.note": "Klassische Texte · zwei Spalten im iPad-Querformat",
      "home.updates.title": "Neueste Updates",
      "home.updates.lead": "Die Website spiegelt Gameplay und Oberfläche der aktuellen Version, damit du das komplette Erlebnis schon vor dem Download oder Feedback siehst.",
      "home.updates.a.kicker": "Strichfolge",
      "home.updates.a.title": "Standard-Strichhinweise werden laufend verfeinert",
      "home.updates.a.body": "Hinweise zu leicht verwechselbaren Strichen – etwa 横撇, 竖折, 竖弯钩, 卧钩, 点 und 捺 – folgen jetzt den Strichfolge-Daten.",
      "home.updates.b.kicker": "Gameplay-Upgrade",
      "home.updates.b.title": "Ab Level 4 Striche selbst auswählen",
      "home.updates.b.body": "Der nächste Strich wird nicht mehr verraten. Alle Striche liegen unten bereit – tippe einfach den richtigen an, kein Ziehen nötig.",
      "home.updates.c.kicker": "Anpassung",
      "home.updates.c.title": "iPad Hoch-/Querformat und Oberflächentexte",
      "home.updates.c.body": "Hauptmenü, Chengyu, klassische Texte und Nachfahr-Screens passen sich der Ausrichtung an; Leveltitel und Fortschritt wurden ebenfalls übersetzt.",
      "home.band.title": "Für mobiles Lernen und entspanntes Rätseln gemacht",
      "home.band.lead": "Der Ablauf setzt auf schnellen Einstieg, klare Ziele und sofortiges Feedback. Ein abgeschlossenes Level schaltet das nächste frei, klassische Texte lassen sich fortsetzen – gut für den Arbeitsweg, zum Üben oder für gemeinsames Spielen in der Familie.",
      "home.band.cta": "Feedback senden",
      "home.band.mini1": "Strich auswählen",
      "home.band.mini2": "Text ordnen",
      "home.band.mini3": "iPad zwei Spalten"
    },
    pt: {
      "lang.label": "Idioma",
      "nav.home": "Início",
      "nav.features": "Recursos",
      "nav.stages": "Níveis",
      "nav.updates": "Atualizações",
      "nav.privacy": "Privacidade",
      "nav.download": "Baixar",
      "footer.tagline": "Aprendizado com quebra-cabeças de caracteres para iPhone e iPad",
      "footer.copyright": "Copyright © 2026 Character Assembly",
      "store.badgeLine": "Baixar na",
      "store.badgeName": "App Store",
      "store.badgeAria": "Baixar o Character Assembly na App Store",

      "home.meta.title": "Character Assembly | Aprenda caracteres, chengyu e textos clássicos",
      "home.meta.description": "Character Assembly é um jogo de quebra-cabeça para aprender chinês no iPhone e iPad: trace cada traço, arraste chengyu para o lugar e reconstitua textos clássicos na ordem original.",
      "home.meta.ogDescription": "Trace cada traço, arraste chengyu para o lugar e reconstitua textos clássicos na ordem original.",
      "home.hero.eyebrow": "Aprendizado de chinês × quebra-cabeça leve · iPhone, iPad e português",
      "home.hero.title": "Character Assembly",
      "home.hero.subtitle": "Coloque cada traço, cada caractere e cada frase clássica de volta no lugar certo.",
      "home.hero.copy": "Comece traçando cada traço, avance para arrastar chengyu e depois reconstitua textos clássicos chineses na ordem original. A partir do nível 4, o jogador escolhe o traço correto por conta própria; o iPad adapta o layout ao modo retrato e paisagem, e o português conta com textos próprios de níveis e progresso.",
      "home.hero.ctaFeatures": "Veja como jogar",
      "home.hero.ctaUpdates": "Ver atualizações",
      "home.hero.ctaPrivacy": "Política de Privacidade",
      "home.hero.ctaSupport": "Falar com o suporte",
      "home.app.pill": "Nível 4 · Novo modo",
      "home.app.title": "Desafio da ordem dos traços",
      "home.app.caption": "Os três primeiros níveis seguem as dicas; a partir do nível 4, toque nos traços exibidos abaixo e trace-os na ordem correta.",
      "home.app.strokeHeading": "木 · Ordem dos traços",
      "home.app.glyphAria": "O caractere chinês 木",
      "home.app.tapHint": "Toque, não arraste",
      "home.features.title": "Quebra-cabeças criados em torno da estrutura do chinês",
      "home.features.lead": "Não se trata de decorar caracteres ou adivinhar respostas, mas de escolher com base na ordem dos traços, nos componentes, na sequência dos caracteres e no significado. Cada modo mantém um objetivo claro, retorno imediato e progresso retomável.",
      "home.features.a.title": "Traçado traço a traço",
      "home.features.a.body": "Os três primeiros níveis oferecem orientação clara; a partir do nível 4, todos os traços aparecem abaixo — toque na ordem correta e só o traço certo é desenhado.",
      "home.features.b.title": "Chengyu com arrastar e soltar",
      "home.features.b.body": "Arraste cada bloco para o espaço de destino e toque para ver o significado; blocos não usados podem voltar à bandeja com um toque duplo.",
      "home.features.c.title": "Ordenação de textos clássicos",
      "home.features.c.body": "Encontre os caracteres na ordem original em uma pilha embaralhada e continue de onde parou; um botão de reembaralhar reorganiza a bandeja a qualquer momento.",
      "home.features.d.title": "Vários idiomas e tamanhos",
      "home.features.d.body": "São compatíveis o chinês simplificado e o inglês. No iPad, o modo retrato lê-se em coluna única como no celular e o modo paisagem organiza texto, peças e tabuleiro lado a lado.",
      "home.stages.title": "Três modos, três ritmos",
      "home.stages.lead": "Os caracteres treinam a ordem dos traços, os chengyu a ordem das palavras e o significado, e os textos clássicos a reconstrução de passagens longas. A quantidade de níveis e os objetivos permanecem claros, ideais tanto para sessões curtas e repetidas quanto para estudo contínuo.",
      "home.stages.a.title": "50 níveis de caracteres",
      "home.stages.a.body": "Dez caracteres comuns por nível. Primeiro familiarize-se com a ordem padrão dos traços e depois passe do traçado guiado para a seleção autônoma.",
      "home.stages.a.note": "500 caracteres comuns · retorno traço a traço",
      "home.stages.b.title": "50 níveis de chengyu",
      "home.stages.b.body": "Quatro chengyu por nível, dos mais frequentes e diretos a caracteres compartilhados, temas e alusões fáceis de confundir, com significados disponíveis após concluir.",
      "home.stages.b.note": "200 chengyu como meta · combinar arrastando",
      "home.stages.c.title": "5 textos clássicos",
      "home.stages.c.body": "Passagens longas são divididas em blocos de caracteres manipuláveis para reconstruí-las caractere por caractere, com retomada e reembaralhamento.",
      "home.stages.c.note": "Textos clássicos · duas colunas no iPad em paisagem",
      "home.updates.title": "Últimas atualizações",
      "home.updates.lead": "O site reflete a jogabilidade e a interface da versão atual, para você conhecer a experiência completa antes de baixar ou enviar feedback.",
      "home.updates.a.kicker": "Ordem dos traços",
      "home.updates.a.title": "As dicas de traços padrão seguem sendo refinadas",
      "home.updates.a.body": "As dicas de traços fáceis de confundir — como 横撇, 竖折, 竖弯钩, 卧钩, 点 e 捺 — agora seguem os dados de ordem dos traços.",
      "home.updates.b.kicker": "Novidade de jogabilidade",
      "home.updates.b.title": "Escolha os traços a partir do nível 4",
      "home.updates.b.body": "O próximo traço não é mais revelado. Todos os traços ficam dispostos abaixo — basta tocar no correto, sem arrastar.",
      "home.updates.c.kicker": "Adaptação",
      "home.updates.c.title": "iPad retrato/paisagem e textos da interface",
      "home.updates.c.body": "O menu principal, os chengyu, os textos clássicos e as telas de traçado se adaptam à orientação, e os títulos de nível e o progresso também foram traduzidos.",
      "home.band.title": "Feito para aprendizado móvel e quebra-cabeças casuais",
      "home.band.lead": "O fluxo prioriza início rápido, objetivos claros e retorno imediato. Concluir um nível libera o próximo, e os textos clássicos podem ser retomados — ideais para o trajeto, para praticar ou para jogar em família.",
      "home.band.cta": "Enviar sugestão",
      "home.band.mini1": "Seleção de traços",
      "home.band.mini2": "Ordenar texto",
      "home.band.mini3": "iPad duas colunas"
    }
  };

  /* 页面级词条（首页 meta + 隐私政策 + 404） */
  var PAGE_MESSAGES = {
    privacy: {
      zh: {
        "page.privacy.metaTitle": "隐私政策 | Character Assembly",
        "page.privacy.metaDescription": "Character Assembly 隐私政策。",
        "page.privacy.title": "隐私政策",
        "page.privacy.updated": "最后更新：2026 年 5 月 12 日",
        "page.privacy.intro": "Character Assembly 是一款用于汉字、成语和文言文组合解谜的 iOS 应用。",
        "page.privacy.summary": "摘要：应用不要求注册账号，不出售个人数据，不使用第三方广告 SDK。游戏进度和设置主要保存在你的设备上。",
        "page.privacy.info.title": "我们访问的信息",
        "page.privacy.info.body": "Character Assembly 的核心玩法不需要你提供姓名、手机号、邮箱或账户资料。应用可能保存以下本地数据：",
        "page.privacy.info.item1": "关卡进度，例如已完成到哪一关。",
        "page.privacy.info.item2": "应用设置，例如语言、音效、音乐和触感开关。",
        "page.privacy.storage.title": "数据如何存储",
        "page.privacy.storage.body": "上述数据使用 Apple 系统提供的本地存储能力保存在你的设备上。开发者不会自动把你的游戏进度上传到自有服务器。",
        "page.privacy.ads.title": "分析、广告与追踪",
        "page.privacy.ads.body": "当前版本不包含第三方广告 SDK，也不进行跨 App 广告追踪。如果未来加入分析或崩溃报告工具，本政策和 App Store 隐私说明会在发布前更新。",
        "page.privacy.children.title": "儿童隐私",
        "page.privacy.children.body": "Character Assembly 可用于中文学习和亲子练习。我们不会有意收集儿童的个人身份信息。",
        "page.privacy.deletion.title": "数据删除",
        "page.privacy.deletion.body": "你可以通过 iOS 系统删除应用及其本地数据。删除应用后，设备上的本地进度和设置也会随之移除，除非你使用了系统级备份或恢复功能。",
        "page.privacy.contact.title": "联系我们",
        "page.privacy.contact.body": "如有隐私或支持问题，请联系：<code>lidonghui11911@gmail.com</code>"
      },
      en: {
        "page.privacy.metaTitle": "Privacy Policy | Character Assembly",
        "page.privacy.metaDescription": "Character Assembly privacy policy.",
        "page.privacy.title": "Privacy Policy",
        "page.privacy.updated": "Last updated: May 12, 2026",
        "page.privacy.intro": "Character Assembly is an iOS app for solving puzzles built from Chinese characters, idioms and classical texts.",
        "page.privacy.summary": "Summary: the app requires no account, does not sell personal data and uses no third-party ad SDK. Game progress and settings are stored mainly on your device.",
        "page.privacy.info.title": "Information we access",
        "page.privacy.info.body": "The core gameplay of Character Assembly does not require your name, phone number, email or account details. The app may store the following local data:",
        "page.privacy.info.item1": "Level progress, for example which level you have reached.",
        "page.privacy.info.item2": "App settings such as language, sound effects, music and haptics.",
        "page.privacy.storage.title": "How data is stored",
        "page.privacy.storage.body": "This data is kept on your device using the local storage provided by Apple's system. The developer does not automatically upload your game progress to their own servers.",
        "page.privacy.ads.title": "Analytics, ads and tracking",
        "page.privacy.ads.body": "The current version contains no third-party ad SDK and does not perform cross-app ad tracking. If analytics or crash-reporting tools are added later, this policy and the App Store privacy details will be updated before release.",
        "page.privacy.children.title": "Children's privacy",
        "page.privacy.children.body": "Character Assembly can be used for Chinese learning and practice with children. We do not knowingly collect personal information from children.",
        "page.privacy.deletion.title": "Data deletion",
        "page.privacy.deletion.body": "You can delete the app and its local data through iOS. Removing the app also removes the local progress and settings from the device, unless you use system-level backup or restore.",
        "page.privacy.contact.title": "Contact us",
        "page.privacy.contact.body": "For privacy or support questions, contact: <code>lidonghui11911@gmail.com</code>"
      },
      es: {
        "page.privacy.metaTitle": "Política de privacidad | Character Assembly",
        "page.privacy.metaDescription": "Política de privacidad de Character Assembly.",
        "page.privacy.title": "Política de privacidad",
        "page.privacy.updated": "Última actualización: 12 de mayo de 2026",
        "page.privacy.intro": "Character Assembly es una app de iOS para resolver puzles formados por caracteres chinos, chengyu y textos clásicos.",
        "page.privacy.summary": "Resumen: la app no requiere cuenta, no vende datos personales y no usa SDK de publicidad de terceros. El progreso y los ajustes se guardan principalmente en tu dispositivo.",
        "page.privacy.info.title": "Información a la que accedemos",
        "page.privacy.info.body": "La jugabilidad principal de Character Assembly no requiere tu nombre, teléfono, correo electrónico ni datos de cuenta. La app puede guardar los siguientes datos locales:",
        "page.privacy.info.item1": "El progreso de los niveles, por ejemplo hasta qué nivel has llegado.",
        "page.privacy.info.item2": "Los ajustes de la app, como idioma, efectos de sonido, música y vibración.",
        "page.privacy.storage.title": "Cómo se guardan los datos",
        "page.privacy.storage.body": "Estos datos se guardan en tu dispositivo mediante el almacenamiento local que ofrece el sistema de Apple. El desarrollador no sube automáticamente tu progreso a servidores propios.",
        "page.privacy.ads.title": "Análisis, publicidad y seguimiento",
        "page.privacy.ads.body": "La versión actual no incluye SDK de publicidad de terceros y no realiza seguimiento publicitario entre apps. Si en el futuro se añaden herramientas de análisis o de informes de fallos, esta política y los datos de privacidad de la App Store se actualizarán antes del lanzamiento.",
        "page.privacy.children.title": "Privacidad de menores",
        "page.privacy.children.body": "Character Assembly puede usarse para aprender chino y practicar en familia. No recopilamos a sabiendas información personal de menores.",
        "page.privacy.deletion.title": "Eliminación de datos",
        "page.privacy.deletion.body": "Puedes eliminar la app y sus datos locales desde iOS. Al borrar la app también se eliminan del dispositivo el progreso y los ajustes locales, salvo que uses copias de seguridad o restauración del sistema.",
        "page.privacy.contact.title": "Contacto",
        "page.privacy.contact.body": "Para dudas sobre privacidad o soporte, escribe a: <code>lidonghui11911@gmail.com</code>"
      },
      fr: {
        "page.privacy.metaTitle": "Politique de confidentialité | Character Assembly",
        "page.privacy.metaDescription": "Politique de confidentialité de Character Assembly.",
        "page.privacy.title": "Politique de confidentialité",
        "page.privacy.updated": "Dernière mise à jour : 12 mai 2026",
        "page.privacy.intro": "Character Assembly est une application iOS de puzzles composés de caractères chinois, de chengyu et de textes classiques.",
        "page.privacy.summary": "Résumé : l'application ne demande aucun compte, ne vend aucune donnée personnelle et n'utilise aucun SDK publicitaire tiers. La progression et les réglages sont surtout stockés sur votre appareil.",
        "page.privacy.info.title": "Informations auxquelles nous accédons",
        "page.privacy.info.body": "Le cœur du jeu de Character Assembly ne vous demande ni nom, ni numéro de téléphone, ni e-mail, ni données de compte. L'application peut conserver les données locales suivantes :",
        "page.privacy.info.item1": "La progression, par exemple jusqu'à quel niveau vous êtes arrivé.",
        "page.privacy.info.item2": "Les réglages de l'application, comme la langue, les effets sonores, la musique et les retours haptiques.",
        "page.privacy.storage.title": "Comment les données sont stockées",
        "page.privacy.storage.body": "Ces données sont conservées sur votre appareil grâce au stockage local fourni par le système Apple. Le développeur ne téléverse pas automatiquement votre progression sur ses propres serveurs.",
        "page.privacy.ads.title": "Analyse, publicité et suivi",
        "page.privacy.ads.body": "La version actuelle n'intègre aucun SDK publicitaire tiers et n'effectue aucun suivi publicitaire entre applications. Si des outils d'analyse ou de rapport de plantage sont ajoutés, cette politique et les informations de confidentialité de l'App Store seront mises à jour avant la publication.",
        "page.privacy.children.title": "Confidentialité des enfants",
        "page.privacy.children.body": "Character Assembly peut servir à l'apprentissage du chinois et à des exercices en famille. Nous ne collectons pas sciemment de données personnelles concernant les enfants.",
        "page.privacy.deletion.title": "Suppression des données",
        "page.privacy.deletion.body": "Vous pouvez supprimer l'application et ses données locales via iOS. La suppression de l'application efface aussi la progression et les réglages locaux de l'appareil, sauf si vous utilisez une sauvegarde ou une restauration système.",
        "page.privacy.contact.title": "Nous contacter",
        "page.privacy.contact.body": "Pour toute question relative à la confidentialité ou à l'assistance : <code>lidonghui11911@gmail.com</code>"
      },
      de: {
        "page.privacy.metaTitle": "Datenschutzerklärung | Character Assembly",
        "page.privacy.metaDescription": "Datenschutzerklärung von Character Assembly.",
        "page.privacy.title": "Datenschutzerklärung",
        "page.privacy.updated": "Zuletzt aktualisiert: 12. Mai 2026",
        "page.privacy.intro": "Character Assembly ist eine iOS-App für Puzzles aus chinesischen Zeichen, Chengyu und klassischen Texten.",
        "page.privacy.summary": "Zusammenfassung: Die App erfordert kein Konto, verkauft keine personenbezogenen Daten und nutzt kein Werbe-SDK von Drittanbietern. Fortschritt und Einstellungen werden vor allem auf deinem Gerät gespeichert.",
        "page.privacy.info.title": "Informationen, auf die wir zugreifen",
        "page.privacy.info.body": "Das Kern-Gameplay von Character Assembly verlangt weder Name, Telefonnummer, E-Mail noch Kontodaten. Die App kann folgende lokale Daten speichern:",
        "page.privacy.info.item1": "Level-Fortschritt, etwa bis zu welchem Level du gekommen bist.",
        "page.privacy.info.item2": "App-Einstellungen wie Sprache, Soundeffekte, Musik und Haptik.",
        "page.privacy.storage.title": "Wie Daten gespeichert werden",
        "page.privacy.storage.body": "Diese Daten werden mit dem lokalen Speicher von Apples System auf deinem Gerät abgelegt. Der Entwickler lädt deinen Spielfortschritt nicht automatisch auf eigene Server hoch.",
        "page.privacy.ads.title": "Analyse, Werbung und Tracking",
        "page.privacy.ads.body": "Die aktuelle Version enthält kein Werbe-SDK von Drittanbietern und betreibt kein app-übergreifendes Werbe-Tracking. Sollten künftig Analyse- oder Absturzbericht-Tools hinzukommen, werden diese Richtlinie und die Datenschutzangaben im App Store vor der Veröffentlichung aktualisiert.",
        "page.privacy.children.title": "Datenschutz für Kinder",
        "page.privacy.children.body": "Character Assembly kann zum Chinesischlernen und für gemeinsames Üben mit Kindern genutzt werden. Wir erheben nicht wissentlich personenbezogene Daten von Kindern.",
        "page.privacy.deletion.title": "Löschen der Daten",
        "page.privacy.deletion.body": "Du kannst die App und ihre lokalen Daten über iOS löschen. Beim Löschen der App werden auch lokaler Fortschritt und Einstellungen vom Gerät entfernt, sofern du keine systemweite Sicherung oder Wiederherstellung nutzt.",
        "page.privacy.contact.title": "Kontakt",
        "page.privacy.contact.body": "Bei Fragen zu Datenschutz oder Support: <code>lidonghui11911@gmail.com</code>"
      },
      pt: {
        "page.privacy.metaTitle": "Política de Privacidade | Character Assembly",
        "page.privacy.metaDescription": "Política de privacidade do Character Assembly.",
        "page.privacy.title": "Política de Privacidade",
        "page.privacy.updated": "Última atualização: 12 de maio de 2026",
        "page.privacy.intro": "Character Assembly é um aplicativo iOS de quebra-cabeças com caracteres chineses, chengyu e textos clássicos.",
        "page.privacy.summary": "Resumo: o app não exige conta, não vende dados pessoais e não usa SDK de anúncios de terceiros. O progresso do jogo e as configurações ficam principalmente no seu dispositivo.",
        "page.privacy.info.title": "Informações a que temos acesso",
        "page.privacy.info.body": "A jogabilidade principal do Character Assembly não exige nome, telefone, e-mail ou dados de conta. O app pode armazenar os seguintes dados locais:",
        "page.privacy.info.item1": "Progresso dos níveis, por exemplo até qual nível você chegou.",
        "page.privacy.info.item2": "Configurações do app, como idioma, efeitos sonoros, música e resposta tátil.",
        "page.privacy.storage.title": "Como os dados são armazenados",
        "page.privacy.storage.body": "Esses dados ficam no seu dispositivo, usando o armazenamento local fornecido pelo sistema da Apple. O desenvolvedor não envia automaticamente seu progresso para servidores próprios.",
        "page.privacy.ads.title": "Análise, anúncios e rastreamento",
        "page.privacy.ads.body": "A versão atual não inclui SDK de anúncios de terceiros e não faz rastreamento publicitário entre apps. Se ferramentas de análise ou relatório de falhas forem adicionadas no futuro, esta política e as informações de privacidade da App Store serão atualizadas antes do lançamento.",
        "page.privacy.children.title": "Privacidade de crianças",
        "page.privacy.children.body": "O Character Assembly pode ser usado para aprender chinês e praticar em família. Não coletamos intencionalmente informações pessoais de crianças.",
        "page.privacy.deletion.title": "Exclusão de dados",
        "page.privacy.deletion.body": "Você pode excluir o app e seus dados locais pelo iOS. Ao remover o app, o progresso e as configurações locais também saem do dispositivo, a menos que você use backup ou restauração do sistema.",
        "page.privacy.contact.title": "Fale conosco",
        "page.privacy.contact.body": "Para dúvidas sobre privacidade ou suporte: <code>lidonghui11911@gmail.com</code>"
      }
    },
    notFound: {
      zh: {
        "page.notFound.metaTitle": "页面未找到 | Character Assembly",
        "page.notFound.title": "页面未找到",
        "page.notFound.body": "这个地址没有对应页面。你可以返回 Character Assembly 首页继续浏览。",
        "page.notFound.cta": "返回首页"
      },
      en: {
        "page.notFound.metaTitle": "Page not found | Character Assembly",
        "page.notFound.title": "Page not found",
        "page.notFound.body": "There is no page at this address. You can head back to the Character Assembly home page.",
        "page.notFound.cta": "Back to home"
      },
      es: {
        "page.notFound.metaTitle": "Página no encontrada | Character Assembly",
        "page.notFound.title": "Página no encontrada",
        "page.notFound.body": "No hay ninguna página en esta dirección. Puedes volver a la página de inicio de Character Assembly.",
        "page.notFound.cta": "Volver al inicio"
      },
      fr: {
        "page.notFound.metaTitle": "Page introuvable | Character Assembly",
        "page.notFound.title": "Page introuvable",
        "page.notFound.body": "Aucune page ne correspond à cette adresse. Vous pouvez revenir à l'accueil de Character Assembly.",
        "page.notFound.cta": "Retour à l'accueil"
      },
      de: {
        "page.notFound.metaTitle": "Seite nicht gefunden | Character Assembly",
        "page.notFound.title": "Seite nicht gefunden",
        "page.notFound.body": "Unter dieser Adresse gibt es keine Seite. Du kannst zur Startseite von Character Assembly zurückkehren.",
        "page.notFound.cta": "Zur Startseite"
      },
      pt: {
        "page.notFound.metaTitle": "Página não encontrada | Character Assembly",
        "page.notFound.title": "Página não encontrada",
        "page.notFound.body": "Não há nenhuma página neste endereço. Você pode voltar à página inicial do Character Assembly.",
        "page.notFound.cta": "Voltar ao início"
      }
    }
  };

  var currentLocale = DEFAULT_LOCALE;

  function isSupported(code) {
    return SUPPORTED_LOCALES.indexOf(code) !== -1;
  }

  function normalize(code) {
    if (!code) return null;
    var value = String(code).trim().toLowerCase().replace(/_/g, "-");
    if (!value) return null;
    if (isSupported(value)) return value;
    var base = value.split("-")[0];
    return isSupported(base) ? base : null;
  }

  function each(selector, callback) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i += 1) callback(nodes[i]);
  }

  function tableFor(locale) {
    var page = document.documentElement.getAttribute("data-i18n-page");
    var merged = {};
    var base = MESSAGES[DEFAULT_LOCALE];
    var key;
    if (base) {
      for (key in base) if (Object.prototype.hasOwnProperty.call(base, key)) merged[key] = base[key];
    }
    var pageTable = page && PAGE_MESSAGES[page] ? PAGE_MESSAGES[page] : null;
    if (pageTable && pageTable[DEFAULT_LOCALE]) {
      for (key in pageTable[DEFAULT_LOCALE]) {
        if (Object.prototype.hasOwnProperty.call(pageTable[DEFAULT_LOCALE], key)) merged[key] = pageTable[DEFAULT_LOCALE][key];
      }
    }
    var target = MESSAGES[locale];
    if (target) {
      for (key in target) if (Object.prototype.hasOwnProperty.call(target, key)) merged[key] = target[key];
    }
    var pageTarget = pageTable ? pageTable[locale] : null;
    if (pageTarget) {
      for (key in pageTarget) {
        if (Object.prototype.hasOwnProperty.call(pageTarget, key)) merged[key] = pageTarget[key];
      }
    }
    return merged;
  }

  function t(key, locale) {
    var table = tableFor(locale || currentLocale);
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : key;
  }

  function readQueryLocale() {
    try {
      if (!window.URLSearchParams) return null;
      return normalize(new window.URLSearchParams(window.location.search).get(QUERY_KEY));
    } catch (error) {
      return null;
    }
  }

  function readStoredLocale() {
    try {
      return normalize(window.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }

  function readBrowserLocale() {
    var candidates = [];
    if (navigator.languages && navigator.languages.length) {
      candidates = candidates.concat(Array.prototype.slice.call(navigator.languages));
    }
    if (navigator.language) candidates.push(navigator.language);
    if (navigator.userLanguage) candidates.push(navigator.userLanguage);
    for (var i = 0; i < candidates.length; i += 1) {
      var code = normalize(candidates[i]);
      if (code) return code;
    }
    return null;
  }

  /* 优先 URL 参数，其次用户已保存的选择，最后才按浏览器系统语言自动适配 */
  function detectLocale() {
    return readQueryLocale() || readStoredLocale() || readBrowserLocale() || DEFAULT_LOCALE;
  }

  function persistLocale(locale) {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch (error) {
      /* 隐私模式或 file:// 下忽略 */
    }
  }

  function syncUrl(locale) {
    try {
      var url = new URL(window.location.href);
      if (locale === DEFAULT_LOCALE) url.searchParams.delete(QUERY_KEY);
      else url.searchParams.set(QUERY_KEY, locale);
      window.history.replaceState(null, "", url.toString());
    } catch (error) {
      /* file:// 等环境不支持时忽略 */
    }
  }

  function updateSwitchers(locale) {
    var label = t("lang.label", locale);
    each("[data-lang-select]", function (select) {
      if (select.value !== locale) select.value = locale;
      select.setAttribute("aria-label", label);
      select.setAttribute("title", label);
    });
  }

  function render(locale) {
    document.documentElement.setAttribute("lang", HTML_LANG[locale] || locale);
    document.documentElement.setAttribute("data-locale", locale);
    /* 解除 head 中内联脚本设置的首屏遮罩 */
    document.documentElement.setAttribute("data-i18n-ready", "true");

    each("[data-i18n]", function (node) {
      node.textContent = t(node.getAttribute("data-i18n"), locale);
    });

    each("[data-i18n-html]", function (node) {
      node.innerHTML = t(node.getAttribute("data-i18n-html"), locale);
    });

    for (var i = 0; i < ATTRIBUTE_BINDINGS.length; i += 1) {
      (function (attr) {
        each("[data-i18n-" + attr + "]", function (node) {
          node.setAttribute(attr, t(node.getAttribute("data-i18n-" + attr), locale));
        });
      })(ATTRIBUTE_BINDINGS[i]);
    }

    updateSwitchers(locale);
  }

  function buildSwitchers() {
    each("[data-lang-switch]", function (container) {
      if (container.getAttribute("data-lang-ready") === "true") return;
      container.setAttribute("data-lang-ready", "true");

      var select = document.createElement("select");
      select.className = "lang-select";
      select.setAttribute("data-lang-select", "");

      for (var i = 0; i < SUPPORTED_LOCALES.length; i += 1) {
        var code = SUPPORTED_LOCALES[i];
        var option = document.createElement("option");
        option.value = code;
        option.textContent = LOCALE_LABELS[code] || code;
        select.appendChild(option);
      }

      select.addEventListener("change", function () {
        setLocale(select.value);
      });

      container.appendChild(select);
    });
  }

  function setLocale(locale) {
    var next = isSupported(locale) ? locale : DEFAULT_LOCALE;
    currentLocale = next;
    persistLocale(next);
    syncUrl(next);
    render(next);
    try {
      document.dispatchEvent(new CustomEvent("i18n:change", { detail: { locale: next } }));
    } catch (error) {
      /* 旧浏览器忽略 */
    }
  }

  function init() {
    buildSwitchers();
    /* URL 上显式写了 ?lang=xx 视为一次明确选择，记下来，
       这样分享链接在站内跳转或下次访问时不会又退回浏览器语言 */
    var fromQuery = readQueryLocale();
    if (fromQuery) persistLocale(fromQuery);
    currentLocale = detectLocale();
    render(currentLocale);
  }

  window.CharacterAssemblyI18n = {
    locales: SUPPORTED_LOCALES.slice(),
    defaultLocale: DEFAULT_LOCALE,
    labels: LOCALE_LABELS,
    getLocale: function () {
      return currentLocale;
    },
    setLocale: setLocale,
    t: function (key) {
      return t(key, currentLocale);
    },
    messages: MESSAGES,
    pageMessages: PAGE_MESSAGES
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
