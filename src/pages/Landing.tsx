import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const TYPED_PHRASES = [
  "интернет-магазин за 30 секунд",
  "сайт для ресторана",
  "портфолио фотографа",
  "лендинг для бизнеса",
  "сайт медицинской клиники",
  "корпоративный сайт компании",
];

const FEATURES = [
  {
    icon: "Zap",
    title: "ИИ создаёт за секунды",
    desc: "Опишите сайт словами — искусственный интеллект генерирует дизайн, структуру и тексты автоматически.",
  },
  {
    icon: "Globe",
    title: "Публикация одной кнопкой",
    desc: "Получите уникальную ссылку и сайт сразу доступен в интернете. Без хостинга и домена.",
  },
  {
    icon: "Paintbrush",
    title: "Редактор без кода",
    desc: "Меняйте цвета, тексты, разделы прямо в редакторе. Никакого программирования.",
  },
  {
    icon: "Smartphone",
    title: "Адаптивный дизайн",
    desc: "Все сайты автоматически корректно отображаются на телефонах, планшетах и компьютерах.",
  },
  {
    icon: "Shield",
    title: "Навсегда бесплатно",
    desc: "Без скрытых платежей и пробных периодов. Создавайте и публикуйте сколько угодно сайтов.",
  },
  {
    icon: "BarChart2",
    title: "Аналитика и статистика",
    desc: "Следите за посещаемостью ваших сайтов в личном кабинете в реальном времени.",
  },
];

const EXAMPLES = [
  { emoji: "☕", label: "Кофейня", prompt: "Уютная кофейня с меню и бронированием столика" },
  { emoji: "⚖️", label: "Юристы", prompt: "Юридическая фирма, услуги и консультации" },
  { emoji: "🏗️", label: "Строители", prompt: "Строительная компания с портфолио работ" },
  { emoji: "💄", label: "Красота", prompt: "Салон красоты с прайсом и онлайн-записью" },
  { emoji: "🏥", label: "Клиника", prompt: "Медицинская клиника с врачами и услугами" },
  { emoji: "📸", label: "Фотограф", prompt: "Портфолио фотографа с галереей работ" },
];

const STEPS = [
  { num: "01", title: "Опишите сайт", desc: "Напишите в чате что за сайт вам нужен — название, сфера, что хотите показать." },
  { num: "02", title: "ИИ генерирует", desc: "За несколько секунд ИИ создаёт дизайн, структуру и тексты для вашего сайта." },
  { num: "03", title: "Настройте детали", desc: "Используйте Ядро для точной настройки цветов, разделов и содержимого." },
  { num: "04", title: "Опубликуйте", desc: "Нажмите «Опубликовать» и получите ссылку — сайт сразу в интернете." },
];

export default function Landing({ onStart }: { onStart: () => void }) {
  const [typedIndex, setTypedIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    const phrase = TYPED_PHRASES[typedIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= phrase.length) {
      timeout = setTimeout(() => {
        setDisplayText(phrase.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, 55);
    } else if (!deleting && charIdx > phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setCharIdx(c => c - 1);
        setDisplayText(phrase.slice(0, charIdx - 1));
      }, 28);
    } else {
      setDeleting(false);
      setTypedIndex(i => (i + 1) % TYPED_PHRASES.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, typedIndex]);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-lg">
              <span className="text-sm font-black text-gray-900">S</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">SiteAI</span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold border border-green-500/20">
              100% бесплатно
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {["Возможности", "Как работает", "Примеры", "FAQ"].map(l => (
              <a key={l} href={`#${l}`} className="nav-link hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onStart}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "hsl(43,85%,52%)", color: "#1a1a2e" }}
            >
              Создать сайт
              <Icon name="ArrowRight" size={15} />
            </button>
            <button className="md:hidden p-2 rounded-md hover:bg-secondary" onClick={() => setMenuOpen(m => !m)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-5 py-4 flex flex-col gap-3 text-sm">
            {["Возможности", "Как работает", "Примеры", "FAQ"].map(l => (
              <a key={l} href={`#${l}`} className="text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
            <button onClick={onStart} className="mt-2 w-full py-2.5 rounded-lg font-bold text-sm" style={{ background: "hsl(43,85%,52%)", color: "#1a1a2e" }}>
              Создать сайт бесплатно
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="mesh-bg pt-20 pb-24 px-5 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Бесплатно навсегда — без карты и регистрации
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-black leading-tight mb-6">
            Создайте{" "}
            <span className="gradient-text">
              {displayText}
              <span className="typing-cursor" />
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Опишите сайт на русском языке — ИИ создаст его за секунды. Никакого кода, никаких шаблонов, никаких знаний дизайна.
          </p>

          {/* Быстрый промпт прямо на лендинге */}
          <div className="max-w-xl mx-auto flex gap-2 mb-5">
            <input
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onStart()}
              placeholder="Например: сайт для цветочного магазина..."
              className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
            />
            <button
              onClick={onStart}
              className="px-5 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: "hsl(43,85%,52%)", color: "#1a1a2e" }}
            >
              Создать →
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLES.slice(0, 4).map(ex => (
              <button
                key={ex.label}
                onClick={onStart}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-yellow-500/40 transition-all"
              >
                {ex.emoji} {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview mockup */}
        <div className="max-w-5xl mx-auto mt-16 rounded-2xl overflow-hidden border border-border shadow-2xl" style={{ background: "hsl(220,25%,9%)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-secondary rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                siteai.app/my-site-xk7q2
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 h-64 sm:h-80">
            {/* Chat panel */}
            <div className="border-r border-border p-4 flex flex-col gap-3">
              <div className="text-xs font-semibold text-muted-foreground mb-1">ИИ-ассистент</div>
              <div className="bg-secondary rounded-xl p-2.5 text-xs text-muted-foreground leading-relaxed">Привет! Опишите ваш сайт...</div>
              <div className="ml-auto rounded-xl p-2.5 text-xs text-gray-900 leading-relaxed max-w-[85%]" style={{ background: "hsl(43,85%,52%)" }}>Нужен сайт кофейни с меню</div>
              <div className="bg-secondary rounded-xl p-2.5 text-xs text-muted-foreground leading-relaxed">Отлично! Создал сайт «Кофейня». Добавить раздел с ценами? ☕</div>
            </div>
            {/* Core panel */}
            <div className="border-r border-border p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-3">Ядро</div>
              <div className="space-y-2.5">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Название</div>
                  <div className="bg-secondary rounded-md px-2 py-1.5 text-xs text-foreground">Кофейня «Уют»</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Стиль</div>
                  <div className="flex gap-1">
                    {["Модерн", "Минимал"].map((s, i) => (
                      <div key={s} className={`text-xs px-2 py-1 rounded-md ${i === 0 ? "text-gray-900 font-semibold" : "bg-secondary text-muted-foreground"}`} style={i === 0 ? { background: "hsl(43,85%,52%)" } : {}}>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Разделы</div>
                  {["Меню ✓", "Цены ✓", "Контакты"].map((s, i) => (
                    <div key={s} className="flex items-center gap-1.5 mb-1.5">
                      <div className={`w-6 h-3 rounded-full ${i < 2 ? "" : "bg-border"}`} style={i < 2 ? { background: "hsl(43,85%,52%)" } : {}} />
                      <span className="text-xs text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Preview panel */}
            <div className="bg-white overflow-hidden">
              <div className="h-8 flex items-center px-3 gap-1" style={{ background: "#1e3a5f" }}>
                <span className="text-white text-xs font-bold">Кофейня «Уют»</span>
              </div>
              <div className="h-full p-3" style={{ background: "linear-gradient(135deg,#1e3a5f,#c9a22722)" }}>
                <div className="text-white text-sm font-black mb-1">Добро пожаловать</div>
                <div className="text-white/70 text-xs mb-3">Уютная атмосфера и вкусный кофе</div>
                <div className="inline-block px-3 py-1 rounded text-xs font-bold text-gray-900" style={{ background: "#c9a227" }}>Забронировать</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="Возможности" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-line mx-auto" style={{ width: "fit-content" }} />
            <h2 className="font-display text-4xl font-black mb-4">Всё что нужно для сайта</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Полный набор инструментов — бесплатно, без ограничений</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-glass rounded-2xl p-6 hover-lift">
                <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4">
                  <Icon name={f.icon} size={20} className="text-gold" />
                </div>
                <h3 className="font-display font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="Как работает" className="py-24 px-5 border-y border-border" style={{ background: "hsl(220,25%,8%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black mb-4">Как это работает</h2>
            <p className="text-muted-foreground">От идеи до готового сайта — 4 шага</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-2xl bg-card border border-border hover-lift">
                <div className="font-display text-4xl font-black text-gold opacity-40 leading-none shrink-0">{s.num}</div>
                <div>
                  <h3 className="font-display font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section id="Примеры" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black mb-4">Примеры сайтов</h2>
            <p className="text-muted-foreground">Нажмите чтобы создать похожий</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {EXAMPLES.map(ex => (
              <button
                key={ex.label}
                onClick={onStart}
                className="card-glass rounded-2xl p-6 text-left hover-lift group"
              >
                <div className="text-4xl mb-4">{ex.emoji}</div>
                <div className="font-display font-bold text-base mb-2 group-hover:text-gold transition-colors">{ex.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{ex.prompt}</div>
                <div className="mt-4 flex items-center gap-1 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Создать <Icon name="ArrowRight" size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — всё бесплатно */}
      <section className="py-24 px-5 border-y border-border" style={{ background: "hsl(220,25%,8%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-black mb-4">Тарифы</h2>
          <p className="text-muted-foreground mb-12">Один тариф — бесплатный навсегда</p>
          <div className="card-glass rounded-3xl p-10 border-2 relative" style={{ borderColor: "hsl(43,85%,52%)" }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold text-gray-900" style={{ background: "hsl(43,85%,52%)" }}>
              Единственный тариф
            </div>
            <div className="font-display text-7xl font-black text-gold mb-2">₀</div>
            <div className="text-muted-foreground mb-8">руб / навсегда</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-10">
              {[
                "Неограниченно сайтов",
                "ИИ-генерация дизайна",
                "Публикация с ссылкой",
                "Редактор без кода",
                "Адаптивный дизайн",
                "SSL-сертификат",
                "Аналитика посещений",
                "Техподдержка",
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "hsl(43,85%,52%,0.15)" }}>
                    <Icon name="Check" size={12} className="text-gold" />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onStart}
              className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
              style={{ background: "hsl(43,85%,52%)", color: "#1a1a2e" }}
            >
              Начать бесплатно прямо сейчас →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="FAQ" className="py-24 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-black mb-4">Частые вопросы</h2>
          </div>
          <div className="space-y-4">
            {[
              ["Правда всё бесплатно?", "Да, полностью бесплатно. Без скрытых платежей, пробных периодов и ограничений. Создавайте сколько угодно сайтов."],
              ["Нужна ли регистрация?", "Нет. Просто начните создавать сайт прямо сейчас — без регистрации и ввода карты."],
              ["Как работает публикация?", "После создания нажмите «Опубликовать» — вы получите уникальную ссылку вида siteai.app/ваш-сайт. Ссылку можно отправить клиентам или разместить в соцсетях."],
              ["Можно подключить свой домен?", "Да, подключение собственного домена доступно бесплатно в настройках сайта."],
              ["Что если мне нужна помощь?", "В правом нижнем углу всегда есть кнопка поддержки. Отвечаем в течение нескольких часов."],
            ].map(([q, a], i) => (
              <FaqItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 mesh-bg text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-5xl font-black mb-5">Создайте сайт прямо сейчас</h2>
          <p className="text-muted-foreground text-lg mb-10">Бесплатно. Без кода. За 30 секунд.</p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:opacity-90 animate-pulse-gold"
            style={{ background: "hsl(43,85%,52%)", color: "#1a1a2e" }}
          >
            <Icon name="Zap" size={20} />
            Создать бесплатный сайт
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-5" style={{ background: "hsl(220,25%,5%)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center">
              <span className="text-xs font-black text-gray-900">S</span>
            </div>
            <span className="font-display font-bold">SiteAI</span>
            <span className="text-muted-foreground text-sm">— бесплатный конструктор сайтов на ИИ</span>
          </div>
          <div className="text-xs text-muted-foreground">© 2025 SiteAI. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-semibold text-sm">{q}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground shrink-0 ml-3" />
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
          {a}
        </div>
      )}
    </div>
  );
}
