import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// --- Типы ---
interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;
}

interface SiteConfig {
  title: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  heroText: string;
  heroSub: string;
  ctaText: string;
  sections: string[];
  font: string;
  style: "modern" | "minimal" | "bold" | "elegant";
}

// --- Дефолтный конфиг сайта ---
const defaultConfig: SiteConfig = {
  title: "Мой сайт",
  primaryColor: "#1e3a5f",
  accentColor: "#c9a227",
  bgColor: "#ffffff",
  textColor: "#1a1a2e",
  heroText: "Добро пожаловать",
  heroSub: "Опишите ваш сайт в чате слева — ИИ создаст его за секунды",
  ctaText: "Начать",
  sections: [],
  font: "sans-serif",
  style: "modern",
};

// --- ИИ-парсер описания ---
function parseUserIntent(text: string, prev: SiteConfig): SiteConfig {
  const cfg = { ...prev };
  const t = text.toLowerCase();

  // Заголовок / название
  const titleMatch = text.match(/(?:сайт|компания|называется?|название|бизнес|магазин|студия|агентство|портал|платформа)[:\s«"']?\s*([A-Za-zА-Яа-яёЁ0-9\s&-]{2,40})/i);
  if (titleMatch) cfg.title = titleMatch[1].trim();

  // Hero text
  if (t.includes("приветств") || t.includes("добро пожаловать")) cfg.heroText = "Добро пожаловать";
  if (t.includes("лучший") || t.includes("№1") || t.includes("номер 1")) cfg.heroText = "Лучший выбор на рынке";
  if (t.includes("профессиональн")) cfg.heroText = "Профессиональные решения";
  if (t.includes("инновацион")) cfg.heroText = "Инновации для вашего бизнеса";

  // Hero sub
  if (t.includes("доставк")) cfg.heroSub = "Быстрая и надёжная доставка по всей стране";
  if (t.includes("юридическ")) cfg.heroSub = "Правовая защита вашего бизнеса";
  if (t.includes("строительств") || t.includes("ремонт")) cfg.heroSub = "Строим надёжно и в срок";
  if (t.includes("ресторан") || t.includes("кафе") || t.includes("еда")) cfg.heroSub = "Вкус, который вы запомните";
  if (t.includes("медицин") || t.includes("клиник") || t.includes("здоровь")) cfg.heroSub = "Ваше здоровье — наш приоритет";

  // Цвета
  if (t.includes("синий") || t.includes("blue")) { cfg.primaryColor = "#1e3a5f"; cfg.accentColor = "#3b82f6"; }
  if (t.includes("зелёный") || t.includes("зеленый") || t.includes("green")) { cfg.primaryColor = "#14532d"; cfg.accentColor = "#22c55e"; }
  if (t.includes("красный") || t.includes("red")) { cfg.primaryColor = "#7f1d1d"; cfg.accentColor = "#ef4444"; }
  if (t.includes("фиолетовый") || t.includes("purple")) { cfg.primaryColor = "#3b0764"; cfg.accentColor = "#a855f7"; }
  if (t.includes("чёрный") || t.includes("черный") || t.includes("dark") || t.includes("тёмный")) { cfg.bgColor = "#0a0a0a"; cfg.textColor = "#f5f5f5"; }
  if (t.includes("белый") || t.includes("светлый") || t.includes("light")) { cfg.bgColor = "#ffffff"; cfg.textColor = "#1a1a2e"; }
  if (t.includes("золот") || t.includes("gold")) cfg.accentColor = "#c9a227";
  if (t.includes("оранжев") || t.includes("orange")) cfg.accentColor = "#f97316";

  // Стиль
  if (t.includes("минимал")) cfg.style = "minimal";
  if (t.includes("жирн") || t.includes("bold") || t.includes("яркий")) cfg.style = "bold";
  if (t.includes("элегантн") || t.includes("роскошн") || t.includes("премиум")) cfg.style = "elegant";
  if (t.includes("современн") || t.includes("модерн")) cfg.style = "modern";

  // Шрифт
  if (t.includes("засечк") || t.includes("serif") || t.includes("класси")) cfg.font = "Georgia, serif";
  if (t.includes("моноширин") || t.includes("mono") || t.includes("код")) cfg.font = "monospace";

  // Секции
  const sections: string[] = [];
  if (t.includes("услуг") || t.includes("сервис")) sections.push("services");
  if (t.includes("портфол") || t.includes("работ") || t.includes("проект")) sections.push("portfolio");
  if (t.includes("цен") || t.includes("тариф") || t.includes("стоимост")) sections.push("pricing");
  if (t.includes("команд") || t.includes("сотрудник") || t.includes("о нас")) sections.push("team");
  if (t.includes("контакт") || t.includes("связ") || t.includes("телефон") || t.includes("адрес")) sections.push("contacts");
  if (t.includes("отзыв") || t.includes("клиент")) sections.push("reviews");
  if (t.includes("блог") || t.includes("статьи") || t.includes("новост")) sections.push("blog");
  if (t.includes("faq") || t.includes("вопрос")) sections.push("faq");
  if (sections.length) cfg.sections = sections;

  // CTA
  if (t.includes("заказ")) cfg.ctaText = "Заказать";
  if (t.includes("купить") || t.includes("покупк")) cfg.ctaText = "Купить";
  if (t.includes("записат") || t.includes("запись")) cfg.ctaText = "Записаться";
  if (t.includes("связат") || t.includes("позвонить")) cfg.ctaText = "Связаться";
  if (t.includes("консультац")) cfg.ctaText = "Получить консультацию";
  if (t.includes("попробоват") || t.includes("начат")) cfg.ctaText = "Попробовать бесплатно";

  return cfg;
}

// --- Ответы ИИ-ассистента ---
function generateReply(text: string, cfg: SiteConfig): string {
  const t = text.toLowerCase();
  const replies: string[] = [];

  replies.push(`Отлично! Я обновил сайт «${cfg.title}».`);

  if (cfg.sections.length > 0) {
    const names: Record<string, string> = {
      services: "Услуги", portfolio: "Портфолио", pricing: "Цены",
      team: "Команда", contacts: "Контакты", reviews: "Отзывы",
      blog: "Блог", faq: "FAQ",
    };
    replies.push(`Добавил разделы: ${cfg.sections.map(s => names[s] || s).join(", ")}.`);
  }

  if (t.includes("цвет") || t.includes("color") || t.includes("тёмн") || t.includes("светл")) {
    replies.push("Применил новую цветовую схему.");
  }

  if (t.includes("стиль") || t.includes("минимал") || t.includes("элегант")) {
    replies.push("Настроил стиль оформления.");
  }

  replies.push("Смотрите результат в правой панели. Что ещё добавить?");

  return replies.join(" ");
}

// --- Рендер превью сайта (HTML-строка) ---
function buildSiteHTML(cfg: SiteConfig): string {
  const sectionBlocks: Record<string, string> = {
    services: `
      <section style="padding:60px 40px; background:${lighten(cfg.bgColor)};">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Наши услуги</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
          ${["Консультация", "Разработка", "Поддержка"].map(s => `
            <div style="padding:24px;border:1px solid ${cfg.accentColor}22;border-radius:8px;background:${cfg.bgColor};">
              <div style="width:40px;height:40px;border-radius:8px;background:${cfg.accentColor}22;margin-bottom:12px;display:flex;align-items:center;justify-content:center;font-size:20px;">⚡</div>
              <h3 style="font-family:${cfg.font};color:${cfg.textColor};margin:0 0 8px;font-size:16px;font-weight:600;">${s}</h3>
              <p style="color:${cfg.textColor}99;font-size:14px;margin:0;line-height:1.5;">Профессиональный подход к каждому клиенту</p>
            </div>
          `).join("")}
        </div>
      </section>`,
    pricing: `
      <section style="padding:60px 40px;">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Тарифы</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
          ${[["Базовый","4 990"],["Профи","14 990"],["Бизнес","39 990"]].map(([name, price], i) => `
            <div style="padding:28px;border:${i===1?`2px solid ${cfg.accentColor}`:`1px solid ${cfg.textColor}22`};border-radius:12px;background:${i===1?cfg.accentColor+'11':cfg.bgColor};position:relative;">
              ${i===1?`<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:${cfg.accentColor};color:#fff;font-size:11px;padding:2px 12px;border-radius:20px;font-weight:600;">ПОПУЛЯРНЫЙ</div>`:''}
              <div style="font-family:${cfg.font};font-weight:700;color:${cfg.textColor};font-size:16px;margin-bottom:8px;">${name}</div>
              <div style="font-size:32px;font-weight:800;color:${cfg.accentColor};font-family:${cfg.font};">₽${price}</div>
              <div style="color:${cfg.textColor}77;font-size:13px;margin:4px 0 20px;">/месяц</div>
              <button style="width:100%;padding:10px;border-radius:6px;border:none;background:${i===1?cfg.accentColor:cfg.primaryColor};color:#fff;font-weight:600;cursor:pointer;font-size:14px;">Выбрать</button>
            </div>
          `).join("")}
        </div>
      </section>`,
    reviews: `
      <section style="padding:60px 40px;background:${lighten(cfg.bgColor)};">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Отзывы клиентов</h2>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;">
          ${[["Александр М.","Отличный сервис! Быстро и качественно."],["Елена К.","Рекомендую всем. Профессиональная команда."]].map(([name, text]) => `
            <div style="padding:24px;border:1px solid ${cfg.textColor}15;border-radius:8px;background:${cfg.bgColor};">
              <div style="color:${cfg.accentColor};font-size:18px;margin-bottom:12px;">★★★★★</div>
              <p style="color:${cfg.textColor};font-size:15px;margin:0 0 16px;line-height:1.6;">"${text}"</p>
              <div style="font-weight:600;color:${cfg.textColor};font-size:14px;">${name}</div>
            </div>
          `).join("")}
        </div>
      </section>`,
    contacts: `
      <section style="padding:60px 40px;">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Контакты</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;">
          <div>
            ${[["📞","Телефон","+7 (800) 000-00-00"],["📧","Email","info@example.com"],["📍","Адрес","Москва, ул. Примерная, 1"]].map(([icon,label,val]) => `
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                <span style="font-size:22px;">${icon}</span>
                <div><div style="font-size:12px;color:${cfg.textColor}77;margin-bottom:2px;">${label}</div><div style="color:${cfg.textColor};font-weight:500;">${val}</div></div>
              </div>
            `).join("")}
          </div>
          <div>
            <input placeholder="Ваше имя" style="width:100%;padding:12px;border:1px solid ${cfg.textColor}22;border-radius:6px;margin-bottom:12px;background:${cfg.bgColor};color:${cfg.textColor};font-size:14px;box-sizing:border-box;"/>
            <input placeholder="Email или телефон" style="width:100%;padding:12px;border:1px solid ${cfg.textColor}22;border-radius:6px;margin-bottom:12px;background:${cfg.bgColor};color:${cfg.textColor};font-size:14px;box-sizing:border-box;"/>
            <button style="width:100%;padding:12px;background:${cfg.accentColor};color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Отправить заявку</button>
          </div>
        </div>
      </section>`,
    portfolio: `
      <section style="padding:60px 40px;background:${lighten(cfg.bgColor)};">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Портфолио</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
          ${["Проект A","Проект B","Проект C"].map((p,i) => `
            <div style="border-radius:10px;overflow:hidden;border:1px solid ${cfg.textColor}15;">
              <div style="height:140px;background:linear-gradient(135deg,${cfg.primaryColor},${cfg.accentColor});display:flex;align-items:center;justify-content:center;font-size:32px;">🖼️</div>
              <div style="padding:16px;background:${cfg.bgColor};"><div style="font-weight:600;color:${cfg.textColor};font-size:15px;">${p}</div><div style="color:${cfg.textColor}77;font-size:13px;margin-top:4px;">Кейс ${i+1}</div></div>
            </div>
          `).join("")}
        </div>
      </section>`,
    team: `
      <section style="padding:60px 40px;">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Наша команда</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
          ${[["Иван Иванов","Директор"],["Мария Петрова","Менеджер"],["Алексей Сидоров","Специалист"]].map(([name,role]) => `
            <div style="text-align:center;padding:24px;border:1px solid ${cfg.textColor}12;border-radius:12px;">
              <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,${cfg.primaryColor},${cfg.accentColor});margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px;color:white;font-weight:700;">${name[0]}</div>
              <div style="font-weight:600;color:${cfg.textColor};margin-bottom:4px;">${name}</div>
              <div style="color:${cfg.textColor}77;font-size:13px;">${role}</div>
            </div>
          `).join("")}
        </div>
      </section>`,
    faq: `
      <section style="padding:60px 40px;background:${lighten(cfg.bgColor)};">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Частые вопросы</h2>
        ${[["Как начать работу?","Свяжитесь с нами удобным способом — мы ответим в течение часа."],["Сколько стоит?","Стоимость зависит от объёма работ. Смотрите тарифы выше."],["Есть ли гарантия?","Да, предоставляем гарантию на все выполненные работы."]].map(([q,a]) => `
          <div style="border-bottom:1px solid ${cfg.textColor}15;padding:20px 0;">
            <div style="font-weight:600;color:${cfg.textColor};margin-bottom:8px;">${q}</div>
            <div style="color:${cfg.textColor}77;font-size:14px;line-height:1.6;">${a}</div>
          </div>
        `).join("")}
      </section>`,
    blog: `
      <section style="padding:60px 40px;">
        <h2 style="font-family:${cfg.font};font-size:28px;color:${cfg.textColor};margin:0 0 32px;font-weight:700;">Блог</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
          ${["Тренды 2025","Советы профи","Кейсы клиентов"].map((t,i) => `
            <div style="border:1px solid ${cfg.textColor}15;border-radius:10px;overflow:hidden;">
              <div style="height:120px;background:linear-gradient(135deg,${cfg.primaryColor}dd,${cfg.accentColor}88);display:flex;align-items:center;justify-content:center;font-size:28px;">📝</div>
              <div style="padding:16px;background:${cfg.bgColor};">
                <div style="font-size:11px;color:${cfg.accentColor};margin-bottom:8px;font-weight:600;">СТАТЬЯ</div>
                <div style="font-weight:600;color:${cfg.textColor};font-size:15px;margin-bottom:6px;">${t}</div>
                <div style="color:${cfg.textColor}77;font-size:13px;">Читать →</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>`,
  };

  const heroStyle = {
    modern: `background:linear-gradient(135deg, ${cfg.primaryColor} 0%, ${cfg.primaryColor}cc 50%, ${cfg.accentColor}33 100%);`,
    minimal: `background:${cfg.bgColor}; border-bottom: 3px solid ${cfg.accentColor};`,
    bold: `background:linear-gradient(135deg, ${cfg.accentColor}, ${cfg.primaryColor});`,
    elegant: `background:linear-gradient(160deg, ${cfg.primaryColor}f0, #000 100%);`,
  }[cfg.style];

  const heroTextColor = cfg.style === "minimal" ? cfg.textColor : "#ffffff";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${cfg.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${cfg.font},'IBM Plex Sans',sans-serif; background: ${cfg.bgColor}; color: ${cfg.textColor}; }
    nav { display:flex;align-items:center;justify-content:space-between;padding:16px 40px;background:${cfg.primaryColor};position:sticky;top:0;z-index:100;box-shadow:0 2px 12px #0003; }
    nav .logo { font-weight:800;font-size:20px;color:#fff;letter-spacing:0.5px; }
    nav .links { display:flex;gap:24px; }
    nav .links a { color:#ffffffbb;text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s; }
    nav .links a:hover { color:${cfg.accentColor}; }
    .hero { ${heroStyle} padding:80px 40px;text-align:center; }
    .hero h1 { font-size:48px;font-weight:900;color:${heroTextColor};margin-bottom:16px;line-height:1.1; }
    .hero p { font-size:18px;color:${heroTextColor}cc;max-width:560px;margin:0 auto 32px;line-height:1.6; }
    .hero .cta { display:inline-block;padding:14px 36px;background:${cfg.accentColor};color:#fff;border-radius:6px;font-weight:700;font-size:16px;text-decoration:none;transition:opacity 0.2s;cursor:pointer; }
    .hero .cta:hover { opacity:0.88; }
    footer { padding:32px 40px;background:${cfg.primaryColor};text-align:center;color:#ffffff66;font-size:13px;margin-top:auto; }
    footer span { color:${cfg.accentColor}; }
  </style>
</head>
<body>
  <nav>
    <div class="logo">${cfg.title}</div>
    <div class="links">
      <a href="#">Главная</a>
      ${cfg.sections.includes("services") ? '<a href="#">Услуги</a>' : ""}
      ${cfg.sections.includes("portfolio") ? '<a href="#">Портфолио</a>' : ""}
      ${cfg.sections.includes("pricing") ? '<a href="#">Цены</a>' : ""}
      ${cfg.sections.includes("blog") ? '<a href="#">Блог</a>' : ""}
      ${cfg.sections.includes("contacts") ? '<a href="#">Контакты</a>' : ""}
    </div>
  </nav>
  <section class="hero">
    <h1>${cfg.heroText}</h1>
    <p>${cfg.heroSub}</p>
    <a class="cta">${cfg.ctaText}</a>
  </section>
  ${cfg.sections.map(s => sectionBlocks[s] || "").join("")}
  <footer>© 2025 <span>${cfg.title}</span>. Все права защищены.</footer>
</body>
</html>`;
}

function lighten(hex: string): string {
  if (hex === "#ffffff" || hex === "#fff") return "#f8f9fa";
  if (hex === "#0a0a0a") return "#111111";
  return hex + "0a";
}

// --- Конфиг-секции для Ядра ---
const SECTION_OPTIONS = [
  { key: "services", label: "Услуги", icon: "Briefcase" },
  { key: "portfolio", label: "Портфолио", icon: "Grid3x3" },
  { key: "pricing", label: "Цены", icon: "Tag" },
  { key: "team", label: "Команда", icon: "Users" },
  { key: "contacts", label: "Контакты", icon: "Phone" },
  { key: "reviews", label: "Отзывы", icon: "Star" },
  { key: "blog", label: "Блог", icon: "FileText" },
  { key: "faq", label: "FAQ", icon: "HelpCircle" },
];

// ========== ГЛАВНЫЙ КОМПОНЕНТ ==========
const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: "Привет! Я ваш ИИ-ассистент. Опишите сайт, который хотите создать — название, сфера бизнеса, нужные разделы, цвета, стиль. Я сгенерирую его прямо сейчас! 🚀",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isTyping, setIsTyping] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activePanel, setActivePanel] = useState<"chat" | "core" | "preview">("chat");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [siteKey, setSiteKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateIframe = (cfg: SiteConfig) => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(buildSiteHTML(cfg));
        doc.close();
      }
    }
    setSiteKey(k => k + 1);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const userText = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const newCfg = parseUserIntent(userText, config);
      setConfig(newCfg);
      const reply = generateReply(userText, newCfg);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", text: reply, ts: Date.now() }]);
      setIsTyping(false);
      updateIframe(newCfg);
    }, 900);
  };

  const handlePublish = () => {
    const id = Math.random().toString(36).slice(2, 8);
    const url = `https://sites.webforge.ai/${id}`;
    setPublishedUrl(url);
  };

  const handleCopy = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleSection = (key: string) => {
    setConfig(prev => {
      const next = prev.sections.includes(key)
        ? prev.sections.filter(s => s !== key)
        : [...prev.sections, key];
      const newCfg = { ...prev, sections: next };
      updateIframe(newCfg);
      return newCfg;
    });
  };

  const updateField = (field: keyof SiteConfig, value: string) => {
    setConfig(prev => {
      const newCfg = { ...prev, [field]: value };
      updateIframe(newCfg);
      return newCfg;
    });
  };

  // Обновляем iframe после монтирования
  useEffect(() => {
    setTimeout(() => updateIframe(config), 100);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
            <span className="text-sm font-black text-gray-900">W</span>
          </div>
          <span className="font-display font-bold text-foreground tracking-tight">WebForge</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-medium">ИИ-редактор</span>
        </div>

        {/* Панели-переключатели (мобильные) */}
        <div className="flex items-center gap-1 md:hidden">
          {(["chat", "core", "preview"] as const).map(p => (
            <button
              key={p}
              onClick={() => setActivePanel(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activePanel === p ? "bg-yellow-500 text-gray-900" : "text-muted-foreground hover:bg-secondary"}`}
            >
              {{ chat: "Чат", core: "Ядро", preview: "Сайт" }[p]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {publishedUrl ? (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium max-w-[180px] truncate">{publishedUrl}</span>
              <button onClick={handleCopy} className="text-green-400 hover:text-green-300 transition-colors ml-1">
                <Icon name={copied ? "Check" : "Copy"} size={14} />
              </button>
            </div>
          ) : null}
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all animate-pulse-gold"
            style={{ background: "hsl(43,85%,52%)", color: "#1a1a2e" }}
          >
            <Icon name="Globe" size={15} />
            Опубликовать
          </button>
        </div>
      </header>

      {/* Три панели */}
      <div className="flex flex-1 overflow-hidden">

        {/* === ПАНЕЛЬ 1: ЧАТ === */}
        <div className={`flex flex-col border-r border-border bg-card ${activePanel === "chat" ? "flex" : "hidden"} md:flex`} style={{ width: "320px", minWidth: "320px" }}>
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
              <Icon name="MessageSquare" size={14} className="text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-foreground">ИИ-ассистент</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">онлайн</span>
            </div>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <span className="text-xs font-black text-gray-900">W</span>
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-gray-900 font-medium"
                      : "bg-secondary text-foreground"
                  }`}
                  style={msg.role === "user" ? { background: "hsl(43,85%,52%)", color: "#1a1a2e" } : {}}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-gray-900">W</span>
                </div>
                <div className="bg-secondary px-4 py-3 rounded-xl flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" style={{ animation: `bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Подсказки */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {["Добавь услуги и цены", "Сделай тёмный стиль", "Добавь контакты"].map(hint => (
              <button
                key={hint}
                onClick={() => { setInput(hint); }}
                className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-border transition-colors"
              >
                {hint}
              </button>
            ))}
          </div>

          {/* Ввод */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Опишите ваш сайт..."
                rows={2}
                className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500/50 border border-border"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-3 rounded-lg font-bold text-gray-900 transition-all disabled:opacity-40"
                style={{ background: "hsl(43,85%,52%)" }}
              >
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* === ПАНЕЛЬ 2: ЯДРО === */}
        <div className={`flex flex-col border-r border-border bg-card overflow-y-auto ${activePanel === "core" ? "flex" : "hidden"} md:flex`} style={{ width: "260px", minWidth: "260px" }}>
          <div className="px-4 py-3 border-b border-border flex items-center gap-2 sticky top-0 bg-card z-10">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center">
              <Icon name="Settings2" size={14} className="text-purple-400" />
            </div>
            <span className="text-sm font-semibold text-foreground">Ядро</span>
          </div>

          <div className="p-4 space-y-5">
            {/* Название */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Название сайта</label>
              <input
                value={config.title}
                onChange={e => updateField("title", e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
              />
            </div>

            {/* Hero */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Заголовок</label>
              <input
                value={config.heroText}
                onChange={e => updateField("heroText", e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-yellow-500/50 mb-2"
              />
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Подзаголовок</label>
              <textarea
                value={config.heroSub}
                onChange={e => updateField("heroSub", e.target.value)}
                rows={2}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-yellow-500/50 resize-none"
              />
            </div>

            {/* CTA */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Кнопка CTA</label>
              <input
                value={config.ctaText}
                onChange={e => updateField("ctaText", e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
              />
            </div>

            {/* Стиль */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Стиль</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["modern", "minimal", "bold", "elegant"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => updateField("style", s)}
                    className={`py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${config.style === s ? "text-gray-900" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                    style={config.style === s ? { background: "hsl(43,85%,52%)" } : {}}
                  >
                    {{ modern: "Модерн", minimal: "Минимал", bold: "Яркий", elegant: "Элегант" }[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Цвета */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Цвета</label>
              <div className="space-y-2.5">
                {([
                  ["primaryColor", "Основной"],
                  ["accentColor", "Акцент"],
                  ["bgColor", "Фон"],
                  ["textColor", "Текст"],
                ] as [keyof SiteConfig, string][]).map(([field, label]) => (
                  <div key={field} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{config[field] as string}</span>
                      <input
                        type="color"
                        value={config[field] as string}
                        onChange={e => updateField(field, e.target.value)}
                        className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Разделы */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Разделы сайта</label>
              <div className="space-y-1.5">
                {SECTION_OPTIONS.map(sec => (
                  <label key={sec.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggleSection(sec.key)}
                      className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${config.sections.includes(sec.key) ? "" : "bg-border"}`}
                      style={config.sections.includes(sec.key) ? { background: "hsl(43,85%,52%)" } : {}}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${config.sections.includes(sec.key) ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                    <Icon name={sec.icon} fallback="Circle" size={13} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{sec.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Статистика */}
            <div className="border-t border-border pt-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Статус</label>
              <div className="space-y-2">
                <div className="stat-card">
                  <div className="text-xs text-muted-foreground">Разделов</div>
                  <div className="text-lg font-bold text-foreground">{config.sections.length + 1}</div>
                </div>
                <div className="stat-card">
                  <div className="text-xs text-muted-foreground">Готовность</div>
                  <div className="text-lg font-bold text-gold">{Math.min(100, 40 + config.sections.length * 8)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === ПАНЕЛЬ 3: ПРЕВЬЮ === */}
        <div className={`flex flex-col flex-1 min-w-0 ${activePanel === "preview" ? "flex" : "hidden"} md:flex`}>
          <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-card shrink-0">
            <div className="w-6 h-6 rounded-md bg-green-500/20 flex items-center justify-center">
              <Icon name="Monitor" size={14} className="text-green-400" />
            </div>
            <span className="text-sm font-semibold text-foreground">Превью сайта</span>

            {/* Desktop / Mobile */}
            <div className="flex items-center gap-1 ml-3 bg-secondary rounded-lg p-0.5">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${previewMode === "desktop" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                <Icon name="Monitor" size={12} /> ПК
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${previewMode === "mobile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                <Icon name="Smartphone" size={12} /> Мобильный
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Живой просмотр
              </div>
              {publishedUrl && (
                <a href={publishedUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-secondary hover:bg-border transition-colors text-muted-foreground hover:text-foreground">
                  <Icon name="ExternalLink" size={12} />
                  Открыть
                </a>
              )}
            </div>
          </div>

          {/* Iframe-превью */}
          <div className="flex-1 overflow-auto bg-zinc-950 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
              style={{
                width: previewMode === "mobile" ? "390px" : "100%",
                height: previewMode === "mobile" ? "700px" : "100%",
                maxHeight: "100%",
              }}
            >
              <iframe
                ref={iframeRef}
                title="preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>

          {/* Нижняя панель публикации */}
          {publishedUrl && (
            <div className="border-t border-border bg-card px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Опубликовано:</span>
              <span className="text-xs font-mono text-green-400 flex-1">{publishedUrl}</span>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary hover:bg-border transition-colors text-muted-foreground">
                <Icon name={copied ? "Check" : "Copy"} size={12} />
                {copied ? "Скопировано" : "Копировать"}
              </button>
              <a href={publishedUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors font-semibold text-gray-900"
                style={{ background: "hsl(43,85%,52%)" }}>
                <Icon name="ExternalLink" size={12} />
                Открыть в браузере
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default Index;