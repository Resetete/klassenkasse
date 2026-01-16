// Klassenkasse v1.1+ (static): target per family (global) + reminder batch modal
// + language-aware SEO link + EN/DE visibility blocks
// + EDIT deposits + EDIT expenses
// + Display name = children (supports multiple children / twins)

const STORAGE_KEY = "klassenkasse_familien_v1";

/** ---------- i18n ---------- **/
const I18N = {
  de: {
    appTitle: "Klassenkasse",
    appSubtitle: "Familienkonten, Einzahlungen, Klassen-Ausgaben verteilen, Salden & E-Mail Texte.",
    languageLabel: "Sprache",
    themeLabel: "Theme",
    exportBtn: "Export",
    importBtn: "Import",
    resetBtn: "Reset",
    reminderBtn: "Reminders",

    summaryTitle: "Übersicht",
    totalBalanceLabel: "Gesamtsaldo",
    familiesCountLabel: "Familien",
    txCountLabel: "Buchungen",

    settingsTitle: "Einstellungen",
    targetAmountLabel: "Zielbetrag pro Familie (€)",
    targetHint: "Wenn gesetzt: Jede Familie sollte mindestens diesen Saldo haben. Unter Ziel wird „Fehlt noch …“ angezeigt.",

    addFamilyTitle: "Familie hinzufügen",
    parent1Label: "Elternteil 1",
    parent2Label: "Elternteil 2 (optional)",
    emailLabel: "E-Mail",
    childrenLabel: "Kinder (Komma-getrennt)",
    addFamilyBtn: "Hinzufügen",
    familyHint: "Tipp: Inaktive Familien werden bei Klassen-Ausgaben nicht mehr vorgeschlagen, bleiben aber im Verlauf.",

    depositTitle: "Einzahlung",
    familyLabel: "Familie",
    amountLabel: "Betrag (€)",
    dateLabel: "Datum",
    noteLabel: "Notiz (optional)",
    addDepositBtn: "Einzahlung buchen",

    classExpenseTitle: "Klassen-Ausgabe verteilen",
    expenseTitleLabel: "Titel",
    totalAmountLabel: "Gesamtbetrag (€)",
    expenseWhoLabel: "Wer trägt die Ausgabe?",
    expenseAllActive: "Alle aktiven Familien",
    expenseSelected: "Ausgewählte Familien",
    expenseSelectLabel: "Auswahl",
    addExpenseBtn: "Ausgabe aufteilen",
    roundingHint: "Hinweis: Bei Cent-Rundung wird der Rest fair verteilt und im Verlauf sichtbar.",

    familiesTitle: "Familien",
    filterActive: "Aktiv",
    filterAll: "Alle",
    filterInactive: "Inaktiv",

    ledgerTitle: "Verlauf",
    ledgerAll: "Alle",
    ledgerDeposits: "Einzahlungen",
    ledgerExpenses: "Ausgaben",
    emptyState: "Noch keine Buchungen — füge links die erste hinzu.",

    exportTitle: "Export",
    exportHelp: "Kopiere dieses JSON oder lade es als Datei herunter.",
    copyBtn: "Kopieren",
    downloadBtn: "Download .json",

    resetTitle: "Wirklich zurücksetzen?",
    resetHelp: "Alle Daten werden aus diesem Browser gelöscht. Exportiere vorher, wenn du ein Backup willst.",
    cancelBtn: "Abbrechen",
    confirmBtn: "Zurücksetzen",

    emailTitle: "E-Mail erstellen",
    emailSubjectLabel: "Betreff",
    emailTemplateLabel: "Template",
    emailPreviewLabel: "Vorschau",
    openMailBtn: "Mail-App öffnen",
    emailPlaceholdersHint: "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",

    reportTitle: "Übersicht",
    printBtn: "Drucken / PDF",

    reminderTitle: "Reminder-Batch",
    reminderModeLabel: "Kriterium",
    reminderBelowTarget: "Unter Ziel",
    reminderNegativeOnly: "Nur negativ",
    reminderActiveOnly: "Nur aktive Familien",
    reminderHint: "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
    reminderListLabel: "Empfänger",
    copyAllBtn: "Alle kopieren",
    openNextBtn: "Nächste Mail öffnen",

    // placeholders (used by data-i18n-placeholder)
    phParent1: "z. B. Maria Muster",
    phParent2: "z. B. Alex Muster",
    phEmail: "maria@example.com",
    phChildren: "z. B. Emma, Liam",
    phDepositAmount: "z. B. 10.00",
    phDepositNote: "z. B. September",
    phExpenseTitle: "z. B. Bastelmaterial",
    phExpenseAmount: "z. B. 24.90",
    phSearch: "Suchen…",
    phTargetAmount: "z. B. 10.00",

    labelsExtra: {
      type: "Typ",
      inactiveSuffix: "inaktiv",
      openEmail: "Mail öffnen",
      copyText: "Text kopieren",
    },

    actions: {
      deactivate: "Inaktiv",
      activate: "Aktiv",
      edit: "Bearbeiten",
      delete: "Löschen",
      email: "E-Mail",
      report: "Übersicht",
    },

    labels: {
      active: "Aktiv",
      inactive: "Inaktiv",
      deposit: "Einzahlung",
      expense: "Ausgabe",
      splitAcross: "geteilt auf",
      families: "Familie(n)",
      date: "Datum",
      note: "Notiz",
      email: "E-Mail",
      children: "Kinder",
      parents: "Eltern",
      balance: "Saldo",
      total: "Gesamt",
      due: "Fehlt noch",
      target: "Ziel",
    },

    defaults: {
      emailSubject: "Klassenkasse — Stand",
      emailTemplate:
`Hallo {{parents}},

kurzes Update zur Klassenkasse:

Kinder: {{children}}
Aktueller Saldo: {{balance}}
Ziel: {{target}}
Fehlt noch: {{due}}

Viele Grüße
`,
      reminderSubject: "Klassenkasse — kurzer Hinweis",
      reminderTemplate:
`Hallo {{parents}},

kurzer Hinweis zur Klassenkasse:

Kinder: {{children}}
Aktueller Saldo: {{balance}}
Ziel: {{target}}
Fehlt noch: {{due}}

Viele Grüße
`,
      expenseTitle: "Klassen-Ausgabe",
    },

    errors: {
      parentRequired: "Bitte mindestens Elternteil 1 angeben.",
      emailInvalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
      familyMissing: "Bitte eine Familie auswählen.",
      amountInvalid: "Bitte einen gültigen Betrag > 0 eingeben.",
      expenseNoParticipants: "Bitte mindestens eine aktive Familie auswählen.",
      importFailed: "Import fehlgeschlagen: ungültige Datei.",
      copied: "Kopiert!",
    },
  },

  en: {
    appTitle: "Class Fund",
    appSubtitle: "Family accounts, contributions, split class expenses, balances & email texts.",
    languageLabel: "Language",
    themeLabel: "Theme",
    exportBtn: "Export",
    importBtn: "Import",
    resetBtn: "Reset",
    reminderBtn: "Reminders",

    summaryTitle: "Overview",
    totalBalanceLabel: "Total balance",
    familiesCountLabel: "Families",
    txCountLabel: "Transactions",

    settingsTitle: "Settings",
    targetAmountLabel: "Target amount per family (€)",
    targetHint: "If set: each family should reach at least this balance. Below target shows “Due …”.",

    addFamilyTitle: "Add family",
    parent1Label: "Parent 1",
    parent2Label: "Parent 2 (optional)",
    emailLabel: "Email",
    childrenLabel: "Children (comma-separated)",
    addFamilyBtn: "Add",
    familyHint: "Tip: inactive families are excluded from class-expense selection, but remain in history.",

    depositTitle: "Contribution",
    familyLabel: "Family",
    amountLabel: "Amount (€)",
    dateLabel: "Date",
    noteLabel: "Note (optional)",
    addDepositBtn: "Add contribution",

    classExpenseTitle: "Split class expense",
    expenseTitleLabel: "Title",
    totalAmountLabel: "Total amount (€)",
    expenseWhoLabel: "Who shares this expense?",
    expenseAllActive: "All active families",
    expenseSelected: "Selected families",
    expenseSelectLabel: "Selection",
    addExpenseBtn: "Split expense",
    roundingHint: "Note: rounding cents are distributed fairly and visible in history.",

    familiesTitle: "Families",
    filterActive: "Active",
    filterAll: "All",
    filterInactive: "Inactive",

    ledgerTitle: "History",
    ledgerAll: "All",
    ledgerDeposits: "Contributions",
    ledgerExpenses: "Expenses",
    emptyState: "No transactions yet — add your first one on the left.",

    exportTitle: "Export",
    exportHelp: "Copy this JSON or download it as a file.",
    copyBtn: "Copy",
    downloadBtn: "Download .json",

    resetTitle: "Reset everything?",
    resetHelp: "This deletes all data from this browser. Export first if you want a backup.",
    cancelBtn: "Cancel",
    confirmBtn: "Reset",

    emailTitle: "Create email",
    emailSubjectLabel: "Subject",
    emailTemplateLabel: "Template",
    emailPreviewLabel: "Preview",
    openMailBtn: "Open mail app",
    emailPlaceholdersHint: "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",

    reportTitle: "Overview",
    printBtn: "Print / PDF",

    reminderTitle: "Reminder batch",
    reminderModeLabel: "Criteria",
    reminderBelowTarget: "Below target",
    reminderNegativeOnly: "Negative only",
    reminderActiveOnly: "Active families only",
    reminderHint: "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
    reminderListLabel: "Recipients",
    copyAllBtn: "Copy all",
    openNextBtn: "Open next email",

    // placeholders
    phParent1: "e.g. Maria Example",
    phParent2: "e.g. Alex Example",
    phEmail: "maria@example.com",
    phChildren: "e.g. Emma, Liam",
    phDepositAmount: "e.g. 10.00",
    phDepositNote: "e.g. September",
    phExpenseTitle: "e.g. craft supplies",
    phExpenseAmount: "e.g. 24.90",
    phSearch: "Search…",
    phTargetAmount: "e.g. 10.00",

    labelsExtra: {
      type: "Type",
      inactiveSuffix: "inactive",
      openEmail: "Open email",
      copyText: "Copy text",
    },

    actions: {
      deactivate: "Deactivate",
      activate: "Activate",
      edit: "Edit",
      delete: "Delete",
      email: "Email",
      report: "Overview",
    },

    labels: {
      active: "Active",
      inactive: "Inactive",
      deposit: "Contribution",
      expense: "Expense",
      splitAcross: "split across",
      families: "family(ies)",
      date: "Date",
      note: "Note",
      email: "Email",
      children: "Children",
      parents: "Parents",
      balance: "Balance",
      total: "Total",
      due: "Due",
      target: "Target",
    },

    defaults: {
      emailSubject: "Class fund — status",
      emailTemplate:
`Hi {{parents}},

quick update about the class fund:

Children: {{children}}
Current balance: {{balance}}
Target: {{target}}
Due: {{due}}

Best regards
`,
      reminderSubject: "Class fund — quick note",
      reminderTemplate:
`Hi {{parents}},

quick note about the class fund:

Children: {{children}}
Current balance: {{balance}}
Target: {{target}}
Due: {{due}}

Best regards
`,
      expenseTitle: "Class expense",
    },

    errors: {
      parentRequired: "Please enter at least Parent 1.",
      emailInvalid: "Please enter a valid email address.",
      familyMissing: "Please select a family.",
      amountInvalid: "Please enter a valid amount > 0.",
      expenseNoParticipants: "Please select at least one active family.",
      importFailed: "Import failed: invalid file.",
      copied: "Copied!",
    },
  },
};

const SUPPORTED_LANGS = ["de", "en"];
function normalizeLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : "en";
}

function dict() {
  return I18N[state.lang] || I18N.en;
}

/** ---------- language switcher helpers ---------- **/
function setLang(lang) {
  state.lang = normalizeLang(lang);
  document.documentElement.lang = state.lang;
  saveState();
  renderAll();
}

/**
 * Optional: update an explainer/SEO link depending on language.
 * Requires: <a id="seoLink" ...> in your HTML (otherwise it does nothing).
 */
function updateSeoLinkForLang(lang) {
  const seoLink = document.getElementById("seoLink");
  if (!seoLink) return;

  const map = {
    en: "/pages/en/class-fund-explainer.html",
    de: "/pages/de/klassenkasse-erklaerung.html",
  };

  seoLink.setAttribute("href", map[lang] || map.en);
}

/** ---------- utils ---------- **/
function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function centsFromInput(v) {
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}
function centsFromPositiveInput(v) {
  const c = centsFromInput(v);
  if (c === null || c <= 0) return null;
  return c;
}
function formatEUR(cents) {
  const n = (cents || 0) / 100;
  try {
    return new Intl.NumberFormat(state.lang === "de" ? "de-DE" : "en-GB", {
      style: "currency",
      currency: "EUR",
    }).format(n);
  } catch {
    return `${n.toFixed(2)} €`;
  }
}
function openDialog(d) {
  if (!d) return;
  if (typeof d.showModal === "function") d.showModal();
  else d.setAttribute("open", "true");
}
function closeDialog(d) {
  if (!d) return;
  if (typeof d.close === "function") d.close();
  else d.removeAttribute("open");
}
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/** ---------- state ---------- **/
function defaultState() {
  return {
    version: 11,
    lang: "en",
    theme: "minimal",
    targetCents: 0, // 0 => disabled
    families: [],
    tx: [],
    expenses: [],
    emailTemplateByLang: {
      de: { subject: I18N.de.defaults.emailSubject, template: I18N.de.defaults.emailTemplate },
      en: { subject: I18N.en.defaults.emailSubject, template: I18N.en.defaults.emailTemplate },
    },
    reminderTemplateByLang: {
      de: { subject: I18N.de.defaults.reminderSubject, template: I18N.de.defaults.reminderTemplate },
      en: { subject: I18N.en.defaults.reminderSubject, template: I18N.en.defaults.reminderTemplate },
    },
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();

    const okLang = normalizeLang(parsed.lang);
    const okTheme = ["minimal", "paper"].includes(parsed.theme) ? parsed.theme : base.theme;
    const targetCents =
      Number.isFinite(parsed.targetCents) && parsed.targetCents >= 0 ? parsed.targetCents : base.targetCents;

    const families = Array.isArray(parsed.families) ? parsed.families : [];
    const tx = Array.isArray(parsed.tx) ? parsed.tx : [];
    const expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];

    const emailTemplateByLang =
      parsed.emailTemplateByLang && typeof parsed.emailTemplateByLang === "object"
        ? parsed.emailTemplateByLang
        : base.emailTemplateByLang;

    const reminderTemplateByLang =
      parsed.reminderTemplateByLang && typeof parsed.reminderTemplateByLang === "object"
        ? parsed.reminderTemplateByLang
        : base.reminderTemplateByLang;

    return {
      ...base,
      ...parsed,
      lang: okLang,
      theme: okTheme,
      targetCents,
      families: families.map((f) => ({
        id: f.id || uid(),
        parent1: typeof f.parent1 === "string" ? f.parent1.slice(0, 60) : "",
        parent2: typeof f.parent2 === "string" ? f.parent2.slice(0, 60) : "",
        email: typeof f.email === "string" ? f.email.slice(0, 120) : "",
        children: Array.isArray(f.children)
          ? f.children.filter(Boolean).map((x) => String(x).slice(0, 60))
          : [],
        active: typeof f.active === "boolean" ? f.active : true,
        createdAt: Number.isFinite(f.createdAt) ? f.createdAt : Date.now(),
      })),
      tx: tx.map((t) => ({
        id: t.id || uid(),
        type: t.type === "allocation" ? "allocation" : "deposit",
        familyId: typeof t.familyId === "string" ? t.familyId : "",
        centsSigned: Number.isFinite(t.centsSigned) ? t.centsSigned : 0,
        dateISO: typeof t.dateISO === "string" ? t.dateISO : todayISO(),
        note: typeof t.note === "string" ? t.note.slice(0, 120) : "",
        createdAt: Number.isFinite(t.createdAt) ? t.createdAt : Date.now(),
        expenseId: typeof t.expenseId === "string" ? t.expenseId : null,
      })),
      expenses: expenses.map((e) => ({
        id: e.id || uid(),
        title: typeof e.title === "string" ? e.title.slice(0, 80) : "",
        totalCents: Number.isFinite(e.totalCents) ? e.totalCents : 0,
        dateISO: typeof e.dateISO === "string" ? e.dateISO : todayISO(),
        participantIds: Array.isArray(e.participantIds) ? e.participantIds.filter(Boolean) : [],
        perFamilyCentsMap: e.perFamilyCentsMap && typeof e.perFamilyCentsMap === "object" ? e.perFamilyCentsMap : {},
        createdAt: Number.isFinite(e.createdAt) ? e.createdAt : Date.now(),
      })),
      emailTemplateByLang: {
        de: {
          subject:
            emailTemplateByLang.de && typeof emailTemplateByLang.de.subject === "string"
              ? emailTemplateByLang.de.subject
              : base.emailTemplateByLang.de.subject,
          template:
            emailTemplateByLang.de && typeof emailTemplateByLang.de.template === "string"
              ? emailTemplateByLang.de.template
              : base.emailTemplateByLang.de.template,
        },
        en: {
          subject:
            emailTemplateByLang.en && typeof emailTemplateByLang.en.subject === "string"
              ? emailTemplateByLang.en.subject
              : base.emailTemplateByLang.en.subject,
          template:
            emailTemplateByLang.en && typeof emailTemplateByLang.en.template === "string"
              ? emailTemplateByLang.en.template
              : base.emailTemplateByLang.en.template,
        },
      },
      reminderTemplateByLang: {
        de: {
          subject:
            reminderTemplateByLang.de && typeof reminderTemplateByLang.de.subject === "string"
              ? reminderTemplateByLang.de.subject
              : base.reminderTemplateByLang.de.subject,
          template:
            reminderTemplateByLang.de && typeof reminderTemplateByLang.de.template === "string"
              ? reminderTemplateByLang.de.template
              : base.reminderTemplateByLang.de.template,
        },
        en: {
          subject:
            reminderTemplateByLang.en && typeof reminderTemplateByLang.en.subject === "string"
              ? reminderTemplateByLang.en.subject
              : base.reminderTemplateByLang.en.subject,
          template:
            reminderTemplateByLang.en && typeof reminderTemplateByLang.en.template === "string"
              ? reminderTemplateByLang.en.template
              : base.reminderTemplateByLang.en.template,
        },
      },
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** ---------- DOM ---------- **/
const els = {
  lang: document.getElementById("lang"),
  theme: document.getElementById("theme"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  resetBtn: document.getElementById("resetBtn"),
  reminderBtn: document.getElementById("reminderBtn"),

  totalBalance: document.getElementById("totalBalance"),
  familiesCount: document.getElementById("familiesCount"),
  txCount: document.getElementById("txCount"),

  targetAmount: document.getElementById("targetAmount"),

  parent1: document.getElementById("parent1"),
  parent2: document.getElementById("parent2"),
  email: document.getElementById("email"),
  children: document.getElementById("children"),
  addFamilyBtn: document.getElementById("addFamilyBtn"),

  depositFamily: document.getElementById("depositFamily"),
  depositAmount: document.getElementById("depositAmount"),
  depositDate: document.getElementById("depositDate"),
  depositNote: document.getElementById("depositNote"),
  addDepositBtn: document.getElementById("addDepositBtn"),

  expenseTitle: document.getElementById("expenseTitle"),
  expenseAmount: document.getElementById("expenseAmount"),
  expenseDate: document.getElementById("expenseDate"),
  expenseSelectedWrap: document.getElementById("expenseSelectedWrap"),
  expenseFamilyChecklist: document.getElementById("expenseFamilyChecklist"),
  addExpenseBtn: document.getElementById("addExpenseBtn"),

  search: document.getElementById("search"),
  statusFilter: document.getElementById("statusFilter"),
  familiesList: document.getElementById("familiesList"),

  ledgerFilter: document.getElementById("ledgerFilter"),
  ledger: document.getElementById("ledger"),
  emptyState: document.getElementById("emptyState"),

  exportDialog: document.getElementById("exportDialog"),
  exportText: document.getElementById("exportText"),
  closeExport: document.getElementById("closeExport"),
  copyExport: document.getElementById("copyExport"),
  downloadExport: document.getElementById("downloadExport"),

  confirmDialog: document.getElementById("confirmDialog"),
  closeConfirm: document.getElementById("closeConfirm"),
  cancelReset: document.getElementById("cancelReset"),
  confirmReset: document.getElementById("confirmReset"),

  emailDialog: document.getElementById("emailDialog"),
  closeEmail: document.getElementById("closeEmail"),
  emailSubject: document.getElementById("emailSubject"),
  emailTemplate: document.getElementById("emailTemplate"),
  emailPreview: document.getElementById("emailPreview"),
  copyEmail: document.getElementById("copyEmail"),
  openMailto: document.getElementById("openMailto"),

  reminderDialog: document.getElementById("reminderDialog"),
  closeReminder: document.getElementById("closeReminder"),
  reminderMode: document.getElementById("reminderMode"),
  reminderActiveOnly: document.getElementById("reminderActiveOnly"),
  reminderSubject: document.getElementById("reminderSubject"),
  reminderTemplate: document.getElementById("reminderTemplate"),
  reminderList: document.getElementById("reminderList"),
  reminderCount: document.getElementById("reminderCount"),
  copyAllReminders: document.getElementById("copyAllReminders"),
  openNextReminder: document.getElementById("openNextReminder"),

  reportDialog: document.getElementById("reportDialog"),
  closeReport: document.getElementById("closeReport"),
  reportContent: document.getElementById("reportContent"),
  copyReport: document.getElementById("copyReport"),
  printReport: document.getElementById("printReport"),
};

/** ---------- derived helpers ---------- **/
function parseChildrenInput(v) {
  const raw = String(v || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function parentsText(f) {
  const p1 = String(f?.parent1 || "").trim();
  const p2 = String(f?.parent2 || "").trim();
  if (p1 && p2) return `${p1} & ${p2}`;
  return p1 || p2 || "—";
}

function childrenText(f) {
  return (f.children || []).join(", ");
}

/**
 * Display name: child-first (supports multiple children / twins).
 * Falls back to parents if no children are set.
 */
function familyDisplayName(f) {
  const kids = (f.children || []).map((s) => String(s || "").trim()).filter(Boolean);

  if (kids.length === 1) return kids[0];
  if (kids.length === 2) return `${kids[0]} & ${kids[1]}`;
  if (kids.length >= 3) return `${kids[0]}, ${kids[1]} +${kids.length - 2}`;

  return parentsText(f);
}

function familyById(id) {
  return state.families.find((f) => f.id === id) || null;
}
function getActiveFamilies() {
  return state.families.filter((f) => f.active);
}

function calcBalances() {
  const byFamily = new Map(state.families.map((f) => [f.id, 0]));
  let total = 0;

  for (const t of state.tx) {
    if (!t.familyId) continue;
    if (!byFamily.has(t.familyId)) continue;
    byFamily.set(t.familyId, byFamily.get(t.familyId) + (t.centsSigned || 0));
    total += t.centsSigned || 0;
  }
  return { byFamily, total };
}

function dueCents(balanceCents) {
  if (!state.targetCents || state.targetCents <= 0) return 0;
  return Math.max(0, state.targetCents - (balanceCents || 0));
}

/** Split total cents equally, distribute remainder cents fairly */
function splitCents(totalCents, participantIds) {
  const n = participantIds.length;
  if (n <= 0) return {};
  const base = Math.floor(totalCents / n);
  let remainder = totalCents - base * n;

  const sorted = participantIds.slice().sort((a, b) => {
    const fa = familyById(a);
    const fb = familyById(b);
    return familyDisplayName(fa || {}).localeCompare(familyDisplayName(fb || {}));
  });

  const map = {};
  for (const id of sorted) {
    map[id] = base + (remainder > 0 ? 1 : 0);
    remainder = Math.max(0, remainder - 1);
  }
  return map;
}

/** ---------- i18n apply ---------- **/
function applyI18n() {
  const d = dict();
  document.documentElement.lang = state.lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (d[key] != null) el.textContent = d[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (d[key] != null) el.setAttribute("placeholder", d[key]);
  });
}

/**
 * Controls EN/DE visibility for SEO + FAQ sections.
 * Requires: <div data-lang="en">...</div> / <div data-lang="de">...</div>
 */
function applyLangVisibility() {
  document.querySelectorAll("[data-lang]").forEach((el) => {
    const lang = el.getAttribute("data-lang");
    el.hidden = lang !== state.lang;
  });
}

/** ---------- render pickers/checklist ---------- **/
function renderFamilyPickers() {
  const d = dict();
  const familiesSorted = state.families.slice().sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));

  els.depositFamily.innerHTML = "";
  for (const f of familiesSorted) {
    const opt = document.createElement("option");
    opt.value = f.id;
    const inactiveSuffix = d.labelsExtra?.inactiveSuffix || (state.lang === "de" ? "inaktiv" : "inactive");
    opt.textContent = `${familyDisplayName(f)}${f.active ? "" : ` (${inactiveSuffix})`}`;
    els.depositFamily.appendChild(opt);
  }

  renderExpenseChecklist();
}

function renderExpenseChecklist() {
  const active = getActiveFamilies().slice().sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));
  els.expenseFamilyChecklist.innerHTML = "";

  if (active.length === 0) {
    const div = document.createElement("div");
    div.className = "muted";
    div.textContent = state.lang === "de" ? "Keine aktiven Familien." : "No active families.";
    els.expenseFamilyChecklist.appendChild(div);
    return;
  }

  for (const f of active) {
    const row = document.createElement("label");
    row.className = "checkItem";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = f.id;

    const main = document.createElement("div");
    main.className = "checkItem__main";

    const t = document.createElement("div");
    t.className = "checkItem__title";
    t.textContent = familyDisplayName(f);

    const s = document.createElement("div");
    s.className = "checkItem__sub";
    const kids = childrenText(f);
    const parents = parentsText(f);
    s.textContent = `${f.email || "—"} · ${kids || (state.lang === "de" ? "Kinder: —" : "Children: —")} · ${
      parents ? (state.lang === "de" ? "Eltern: " : "Parents: ") + parents : ""
    }`.trim();

    main.appendChild(t);
    main.appendChild(s);

    row.appendChild(cb);
    row.appendChild(main);

    els.expenseFamilyChecklist.appendChild(row);
  }
}

/** ---------- render summary + families ---------- **/
function renderSummary() {
  const { total } = calcBalances();

  els.totalBalance.textContent = formatEUR(total);
  els.familiesCount.textContent = String(state.families.length);
  els.txCount.textContent = String(state.tx.length);

  els.totalBalance.style.color = total < 0 ? "var(--neg)" : total > 0 ? "var(--pos)" : "var(--text)";
}

function renderFamilies() {
  const d = dict();
  const q = (els.search.value || "").toLowerCase().trim();
  const status = els.statusFilter.value || "active";

  const { byFamily } = calcBalances();

  let families = state.families.slice();
  if (status === "active") families = families.filter((f) => f.active);
  if (status === "inactive") families = families.filter((f) => !f.active);

  if (q) {
    families = families.filter((f) => {
      const hay = [familyDisplayName(f), parentsText(f), f.email || "", childrenText(f)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  families.sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));

  els.familiesList.innerHTML = "";

  if (families.length === 0) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = state.lang === "de" ? "Keine passenden Familien." : "No matching families.";
    els.familiesList.appendChild(empty);
    return;
  }

  for (const f of families) {
    const bal = byFamily.get(f.id) || 0;
    const due = dueCents(bal);

    const card = document.createElement("div");
    card.className = "familyCard";

    const top = document.createElement("div");
    top.className = "familyTop";

    const meta = document.createElement("div");
    meta.className = "familyMeta";

    const name = document.createElement("div");
    name.className = "familyName";
    name.textContent = familyDisplayName(f);

    const small = document.createElement("div");
    small.className = "familySmall";

    // Show useful context (parents + email) in smaller line
    const kids = childrenText(f);
    const parents = parentsText(f);
    small.textContent = [
      kids ? (state.lang === "de" ? "Kinder: " : "Children: ") + kids : null,
      parents ? (state.lang === "de" ? "Eltern: " : "Parents: ") + parents : null,
      f.email || null,
    ]
      .filter(Boolean)
      .join(" · ");

    const badges = document.createElement("div");
    badges.className = "badges";

    const badgeStatus = document.createElement("span");
    badgeStatus.className = "badge" + (f.active ? "" : " badge--inactive");
    badgeStatus.textContent = f.active ? d.labels.active : d.labels.inactive;
    badges.appendChild(badgeStatus);

    if (state.targetCents > 0) {
      const badgeTarget = document.createElement("span");
      badgeTarget.className = "badge";
      badgeTarget.textContent = `${d.labels.target}: ${formatEUR(state.targetCents)}`;
      badges.appendChild(badgeTarget);
    }

    if (state.targetCents > 0 && due > 0) {
      const badgeDue = document.createElement("span");
      badgeDue.className = "badge badge--due";
      badgeDue.textContent = `${d.labels.due}: ${formatEUR(due)}`;
      badges.appendChild(badgeDue);
    }

    meta.appendChild(name);
    meta.appendChild(small);
    meta.appendChild(badges);

    const right = document.createElement("div");
    const amt = document.createElement("div");
    amt.className = "amount " + (bal < 0 ? "neg" : bal > 0 ? "pos" : "");
    amt.textContent = formatEUR(bal);
    right.appendChild(amt);

    top.appendChild(meta);
    top.appendChild(right);

    const actions = document.createElement("div");
    actions.className = "familyActions";

    const toggle = document.createElement("button");
    toggle.className = "btn";
    toggle.type = "button";
    toggle.textContent = f.active ? d.actions.deactivate : d.actions.activate;
    toggle.addEventListener("click", () => {
      f.active = !f.active;
      saveState();
      renderAll();
    });

    const edit = document.createElement("button");
    edit.className = "btn";
    edit.type = "button";
    edit.textContent = d.actions.edit;
    edit.addEventListener("click", () => editFamily(f.id));

    const emailBtn = document.createElement("button");
    emailBtn.className = "btn btn--primary";
    emailBtn.type = "button";
    emailBtn.textContent = d.actions.email;
    emailBtn.addEventListener("click", () => openEmailForFamily(f.id));

    const reportBtn = document.createElement("button");
    reportBtn.className = "btn";
    reportBtn.type = "button";
    reportBtn.textContent = d.actions.report;
    reportBtn.addEventListener("click", () => openReportForFamily(f.id));

    const del = document.createElement("button");
    del.className = "btn btn--danger";
    del.type = "button";
    del.textContent = d.actions.delete;
    del.addEventListener("click", () => deleteFamilyIfPossible(f.id));

    actions.appendChild(toggle);
    actions.appendChild(edit);
    actions.appendChild(emailBtn);
    actions.appendChild(reportBtn);
    actions.appendChild(del);

    card.appendChild(top);
    card.appendChild(actions);

    els.familiesList.appendChild(card);
  }
}

/** ---------- render ledger ---------- **/
function renderLedger() {
  const d = dict();
  const filter = els.ledgerFilter.value || "all";

  const items = [];
  for (const t of state.tx) {
    if (t.type === "deposit") items.push({ kind: "deposit", dateISO: t.dateISO, createdAt: t.createdAt, tx: t });
  }
  for (const e of state.expenses) {
    items.push({ kind: "expense", dateISO: e.dateISO, createdAt: e.createdAt, expense: e });
  }

  items.sort((a, b) => b.dateISO.localeCompare(a.dateISO) || b.createdAt - a.createdAt);

  const visible = items.filter((it) => {
    if (filter === "all") return true;
    if (filter === "deposit") return it.kind === "deposit";
    if (filter === "expense") return it.kind === "expense";
    return true;
  });

  els.ledger.innerHTML = "";
  els.emptyState.hidden = items.length !== 0;

  for (const it of visible) {
    const row = document.createElement("div");
    row.className = "txRow";

    const top = document.createElement("div");
    top.className = "txTop";

    const title = document.createElement("div");
    title.className = "txTitle";

    const actions = document.createElement("div");
    actions.className = "txActions";

    const meta = document.createElement("div");
    meta.className = "txMeta";

    if (it.kind === "deposit") {
      const t = it.tx;
      const f = familyById(t.familyId);

      title.textContent = `${d.labels.deposit}: ${formatEUR(t.centsSigned)} · ${familyDisplayName(f || {})}`;
      meta.textContent = `${d.labels.date}: ${t.dateISO}${t.note ? " · " + d.labels.note + ": " + t.note : ""}`;

      // Edit deposit
      const edit = document.createElement("button");
      edit.className = "btn";
      edit.type = "button";
      edit.textContent = d.actions.edit;
      edit.addEventListener("click", () => editDepositTx(t.id));
      actions.appendChild(edit);

      // Delete
      const del = document.createElement("button");
      del.className = "btn btn--danger";
      del.type = "button";
      del.textContent = d.actions.delete;
      del.addEventListener("click", () => {
        state.tx = state.tx.filter((x) => x.id !== t.id);
        saveState();
        renderAll();
      });
      actions.appendChild(del);
    } else {
      const e = it.expense;
      const famCount = (e.participantIds || []).length;

      title.textContent = `${d.labels.expense}: ${formatEUR(-e.totalCents)} · ${e.title || d.defaults.expenseTitle}`;
      meta.textContent = `${d.labels.date}: ${e.dateISO} · ${d.labels.splitAcross} ${famCount} ${d.labels.families}`;

      const preview = [];
      const ids = (e.participantIds || []).slice();
      for (const id of ids.slice(0, 4)) {
        const f = familyById(id);
        const part = e.perFamilyCentsMap?.[id];
        preview.push(`${familyDisplayName(f || {})} (${formatEUR(-(part || 0))})`);
      }
      if (ids.length > 0) meta.textContent += `\n${preview.join(" · ")}${ids.length > 4 ? " · …" : ""}`;

      // Edit expense (recomputes allocations)
      const edit = document.createElement("button");
      edit.className = "btn";
      edit.type = "button";
      edit.textContent = d.actions.edit;
      edit.addEventListener("click", () => editExpense(e.id));
      actions.appendChild(edit);

      const del = document.createElement("button");
      del.className = "btn btn--danger";
      del.type = "button";
      del.textContent = d.actions.delete;
      del.addEventListener("click", () => deleteExpense(e.id));
      actions.appendChild(del);
    }

    top.appendChild(title);
    top.appendChild(actions);

    row.appendChild(top);
    row.appendChild(meta);

    els.ledger.appendChild(row);
  }
}

/** ---------- actions: family CRUD ---------- **/
function addFamily() {
  const d = dict();

  const p1 = String(els.parent1.value || "").trim().slice(0, 60);
  const p2 = String(els.parent2.value || "").trim().slice(0, 60);
  const email = String(els.email.value || "").trim().slice(0, 120);
  const children = parseChildrenInput(els.children.value);

  // allow child-only families (or parent-only) but require at least one of them
  if (children.length === 0 && !p1 && !p2) {
    alert(state.lang === "de" ? "Bitte mindestens ein Kind oder einen Elternteil angeben." : "Please enter at least one child or a parent name.");
    return;
  }
  if (!isValidEmail(email)) {
    alert(d.errors.emailInvalid);
    return;
  }

  state.families.push({
    id: uid(),
    parent1: p1,
    parent2: p2,
    email,
    children,
    active: true,
    createdAt: Date.now(),
  });

  els.parent1.value = "";
  els.parent2.value = "";
  els.email.value = "";
  els.children.value = "";

  saveState();
  renderAll();
}

function editFamily(familyId) {
  const f = familyById(familyId);
  if (!f) return;

  const d = dict();

  const kids = prompt(d.childrenLabel || "Children (comma-separated)", (f.children || []).join(", "));
  if (kids === null) return;

  const p1 = prompt(d.parent1Label || "Parent 1", f.parent1 || "");
  if (p1 === null) return;

  const p2 = prompt(d.parent2Label || "Parent 2 (optional)", f.parent2 || "");
  if (p2 === null) return;

  const em = prompt(d.emailLabel || "Email", f.email || "");
  if (em === null) return;
  if (!isValidEmail(em)) {
    alert(d.errors.emailInvalid);
    return;
  }

  const newChildren = parseChildrenInput(kids);
  const newP1 = String(p1).trim().slice(0, 60);
  const newP2 = String(p2).trim().slice(0, 60);

  if (newChildren.length === 0 && !newP1 && !newP2) {
    alert(state.lang === "de" ? "Bitte mindestens ein Kind oder einen Elternteil angeben." : "Please enter at least one child or a parent name.");
    return;
  }

  f.children = newChildren;
  f.parent1 = newP1;
  f.parent2 = newP2;
  f.email = String(em).trim().slice(0, 120);

  saveState();
  renderAll();
}

function deleteFamilyIfPossible(familyId) {
  const hasTx = state.tx.some((t) => t.familyId === familyId);
  const isInExpense = state.expenses.some((e) => (e.participantIds || []).includes(familyId));

  if (hasTx || isInExpense) {
    const ok = confirm(
      state.lang === "de"
        ? "Diese Familie hat bereits Buchungen/Teilnahmen. Statt Löschen wird sie jetzt deaktiviert. OK?"
        : "This family has transactions/participations. Instead of deleting, it will be deactivated. OK?"
    );
    if (!ok) return;
    const f = familyById(familyId);
    if (f) f.active = false;
    saveState();
    renderAll();
    return;
  }

  const ok = confirm(state.lang === "de" ? "Familie wirklich löschen?" : "Delete this family?");
  if (!ok) return;

  state.families = state.families.filter((f) => f.id !== familyId);
  saveState();
  renderAll();
}

/** ---------- actions: deposits ---------- **/
function addDeposit() {
  const d = dict();

  const familyId = els.depositFamily.value || "";
  if (!familyId) {
    alert(d.errors.familyMissing);
    return;
  }

  const cents = centsFromPositiveInput(els.depositAmount.value);
  if (!cents) {
    alert(d.errors.amountInvalid);
    return;
  }

  const dateISO = els.depositDate.value || todayISO();
  const note = String(els.depositNote.value || "").trim().slice(0, 120);

  state.tx.push({
    id: uid(),
    type: "deposit",
    familyId,
    centsSigned: cents,
    dateISO,
    note,
    createdAt: Date.now(),
    expenseId: null,
  });

  els.depositAmount.value = "";
  els.depositNote.value = "";
  els.depositDate.value = dateISO;

  saveState();
  renderAll();
}

function editDepositTx(txId) {
  const t = state.tx.find((x) => x.id === txId);
  if (!t || t.type !== "deposit") return;

  const d = dict();

  const newDate = prompt(d.dateLabel || "Date", t.dateISO || todayISO());
  if (newDate === null) return;

  const currentAmount = ((t.centsSigned || 0) / 100).toFixed(2);
  const newAmountStr = prompt(d.amountLabel || "Amount (€)", currentAmount);
  if (newAmountStr === null) return;
  const newCents = centsFromPositiveInput(newAmountStr);
  if (!newCents) {
    alert(d.errors.amountInvalid);
    return;
  }

  const newNote = prompt(d.noteLabel || "Note (optional)", t.note || "");
  if (newNote === null) return;

  t.dateISO = String(newDate).trim() || todayISO();
  t.centsSigned = newCents;
  t.note = String(newNote).trim().slice(0, 120);

  saveState();
  renderAll();
}

/** ---------- actions: class expense split ---------- **/
function expenseWho() {
  const el = document.querySelector('input[name="expenseWho"]:checked');
  return el ? el.value : "all";
}
function selectedExpenseFamilies() {
  const checked = Array.from(els.expenseFamilyChecklist.querySelectorAll("input[type=checkbox]:checked"));
  return checked.map((x) => x.value).filter(Boolean);
}
function addExpenseSplit() {
  const d = dict();

  const title = String(els.expenseTitle.value || "").trim().slice(0, 80) || d.defaults.expenseTitle;
  const totalCents = centsFromPositiveInput(els.expenseAmount.value);
  if (!totalCents) {
    alert(d.errors.amountInvalid);
    return;
  }

  const dateISO = els.expenseDate.value || todayISO();

  let participantIds = [];
  if (expenseWho() === "all") participantIds = getActiveFamilies().map((f) => f.id);
  else participantIds = selectedExpenseFamilies();

  const activeSet = new Set(getActiveFamilies().map((f) => f.id));
  participantIds = participantIds.filter((id) => activeSet.has(id));

  if (participantIds.length === 0) {
    alert(d.errors.expenseNoParticipants);
    return;
  }

  const perMap = splitCents(totalCents, participantIds);
  const expenseId = uid();

  state.expenses.push({
    id: expenseId,
    title,
    totalCents,
    dateISO,
    participantIds,
    perFamilyCentsMap: perMap,
    createdAt: Date.now(),
  });

  for (const fid of participantIds) {
    const part = perMap[fid] || 0;
    state.tx.push({
      id: uid(),
      type: "allocation",
      familyId: fid,
      centsSigned: -part,
      dateISO,
      note: title,
      createdAt: Date.now(),
      expenseId,
    });
  }

  els.expenseTitle.value = "";
  els.expenseAmount.value = "";
  els.expenseDate.value = dateISO;
  Array.from(els.expenseFamilyChecklist.querySelectorAll("input[type=checkbox]")).forEach((cb) => (cb.checked = false));

  saveState();
  renderAll();
}

function deleteExpense(expenseId) {
  const ok = confirm(
    state.lang === "de"
      ? "Diese Ausgabe löschen? (Alle zugehörigen Anteile werden entfernt.)"
      : "Delete this expense? (All related allocations will be removed.)"
  );
  if (!ok) return;

  state.expenses = state.expenses.filter((e) => e.id !== expenseId);
  state.tx = state.tx.filter((t) => t.expenseId !== expenseId);
  saveState();
  renderAll();
}

/**
 * Edit expense: edit date, title, total amount.
 * Recomputes per-family allocations and updates linked allocation tx rows.
 */
function editExpense(expenseId) {
  const e = state.expenses.find((x) => x.id === expenseId);
  if (!e) return;

  const d = dict();

  const newTitle = prompt(d.expenseTitleLabel || "Title", e.title || d.defaults.expenseTitle);
  if (newTitle === null) return;

  const newDate = prompt(d.dateLabel || "Date", e.dateISO || todayISO());
  if (newDate === null) return;

  const currentAmount = ((e.totalCents || 0) / 100).toFixed(2);
  const newAmountStr = prompt(d.totalAmountLabel || "Total amount (€)", currentAmount);
  if (newAmountStr === null) return;

  const newTotalCents = centsFromPositiveInput(newAmountStr);
  if (!newTotalCents) {
    alert(d.errors.amountInvalid);
    return;
  }

  // Keep same participants as before, but filter to families that still exist
  let participantIds = Array.isArray(e.participantIds) ? e.participantIds.slice() : [];
  const familySet = new Set(state.families.map((f) => f.id));
  participantIds = participantIds.filter((id) => familySet.has(id));

  if (participantIds.length === 0) {
    alert(state.lang === "de" ? "Keine gültigen Teilnehmer mehr für diese Ausgabe." : "No valid participants left for this expense.");
    return;
  }

  const perMap = splitCents(newTotalCents, participantIds);

  // Update expense
  e.title = String(newTitle).trim().slice(0, 80) || d.defaults.expenseTitle;
  e.dateISO = String(newDate).trim() || todayISO();
  e.totalCents = newTotalCents;
  e.participantIds = participantIds;
  e.perFamilyCentsMap = perMap;

  // Update linked allocation tx rows
  for (const t of state.tx) {
    if (t.type !== "allocation") continue;
    if (t.expenseId !== expenseId) continue;

    const part = perMap[t.familyId] || 0;
    t.centsSigned = -part;
    t.dateISO = e.dateISO;
    t.note = e.title;
  }

  // Remove orphan allocations (families no longer participating)
  state.tx = state.tx.filter((t) => !(t.type === "allocation" && t.expenseId === expenseId && !participantIds.includes(t.familyId)));

  // Add missing allocation tx rows (participant exists but tx missing)
  const existingAllocFamIds = new Set(state.tx.filter((t) => t.type === "allocation" && t.expenseId === expenseId).map((t) => t.familyId));
  for (const fid of participantIds) {
    if (existingAllocFamIds.has(fid)) continue;
    const part = perMap[fid] || 0;
    state.tx.push({
      id: uid(),
      type: "allocation",
      familyId: fid,
      centsSigned: -part,
      dateISO: e.dateISO,
      note: e.title,
      createdAt: Date.now(),
      expenseId,
    });
  }

  saveState();
  renderAll();
}

/** ---------- templates ---------- **/
function fillTemplatePlaceholders(template, f, balanceCents) {
  const parents = parentsText(f);
  const kids = childrenText(f) || "—";
  const balance = formatEUR(balanceCents);
  const target = state.targetCents > 0 ? formatEUR(state.targetCents) : "—";
  const due = state.targetCents > 0 ? formatEUR(dueCents(balanceCents)) : "—";
  const today = todayISO();

  return String(template || "")
    .replaceAll("{{parents}}", parents)
    .replaceAll("{{children}}", kids)
    .replaceAll("{{balance}}", balance)
    .replaceAll("{{target}}", target)
    .replaceAll("{{due}}", due)
    .replaceAll("{{email}}", f.email || "")
    .replaceAll("{{today}}", today);
}

async function copyTextToClipboard(text, buttonEl) {
  const d = dict();
  try {
    await navigator.clipboard.writeText(text);
    if (buttonEl) {
      const old = buttonEl.textContent;
      buttonEl.textContent = d.errors.copied;
      setTimeout(() => (buttonEl.textContent = old), 900);
    }
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

/** ---------- Email modal ---------- **/
let emailFamilyId = null;

function openEmailForFamily(familyId) {
  const f = familyById(familyId);
  if (!f) return;

  emailFamilyId = familyId;
  const { byFamily } = calcBalances();
  const bal = byFamily.get(familyId) || 0;

  const tmpl = state.emailTemplateByLang?.[state.lang] || dict().defaults;
  els.emailSubject.value = tmpl.subject || dict().defaults.emailSubject;
  els.emailTemplate.value = tmpl.template || dict().defaults.emailTemplate;

  els.emailPreview.textContent = fillTemplatePlaceholders(els.emailTemplate.value, f, bal);

  openDialog(els.emailDialog);
}

function updateEmailPreview() {
  if (!emailFamilyId) return;
  const f = familyById(emailFamilyId);
  if (!f) return;

  const { byFamily } = calcBalances();
  const bal = byFamily.get(emailFamilyId) || 0;

  els.emailPreview.textContent = fillTemplatePlaceholders(els.emailTemplate.value, f, bal);
}

function openMailClient() {
  if (!emailFamilyId) return;
  const f = familyById(emailFamilyId);
  if (!f) return;

  state.emailTemplateByLang[state.lang] = {
    subject: String(els.emailSubject.value || "").slice(0, 120),
    template: String(els.emailTemplate.value || ""),
  };
  saveState();

  const subject = String(els.emailSubject.value || "");
  const body = String(els.emailPreview.textContent || "");
  const url = `mailto:${encodeURIComponent(f.email || "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

/** ---------- Reminder batch ---------- **/
let reminderQueue = [];
let reminderIndex = 0;

function reminderEligibleFamilies() {
  const { byFamily } = calcBalances();

  const mode = els.reminderMode.value || "below_target";
  const activeOnly = !!els.reminderActiveOnly.checked;

  let fams = state.families.slice();
  if (activeOnly) fams = fams.filter((f) => f.active);

  const res = [];
  for (const f of fams) {
    const bal = byFamily.get(f.id) || 0;
    const due = dueCents(bal);

    if (mode === "negative_only") {
      if (bal < 0) res.push({ f, bal, due });
      continue;
    }

    if (state.targetCents > 0 && due > 0) res.push({ f, bal, due });
  }

  res.sort((a, b) => familyDisplayName(a.f).localeCompare(familyDisplayName(b.f)));
  return res;
}

function buildReminderQueue() {
  const d = dict();
  const list = reminderEligibleFamilies();

  const subj = String(els.reminderSubject.value || "").trim() || d.defaults.reminderSubject;
  const tmpl = String(els.reminderTemplate.value || "").trim() || d.defaults.reminderTemplate;

  reminderQueue = list.map(({ f, bal }) => ({
    familyId: f.id,
    email: f.email || "",
    subject: subj,
    body: fillTemplatePlaceholders(tmpl, f, bal),
  }));
  reminderIndex = 0;
}

function renderReminderList() {
  const list = reminderEligibleFamilies();
  const d = dict();

  els.reminderList.innerHTML = "";

  if (els.reminderMode.value === "below_target" && (!state.targetCents || state.targetCents <= 0)) {
    const div = document.createElement("div");
    div.className = "muted";
    div.textContent =
      state.lang === "de"
        ? "Bitte zuerst einen Zielbetrag pro Familie setzen (links unter Einstellungen)."
        : "Please set a target amount per family first (left under Settings).";
    els.reminderList.appendChild(div);
    els.reminderCount.textContent = "";
    return;
  }

  if (list.length === 0) {
    const div = document.createElement("div");
    div.className = "muted";
    div.textContent = state.lang === "de" ? "Keine passenden Familien für dieses Kriterium." : "No matching families for this criteria.";
    els.reminderList.appendChild(div);
    els.reminderCount.textContent = "";
    return;
  }

  for (const { f, bal } of list) {
    const due = dueCents(bal);

    const item = document.createElement("div");
    item.className = "remItem";

    const top = document.createElement("div");
    top.className = "remItem__top";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "remItem__name";
    name.textContent = familyDisplayName(f);

    const meta = document.createElement("div");
    meta.className = "remItem__meta";
    meta.textContent = `${f.email || "—"} · ${childrenText(f) || "—"} · ${parentsText(f) || "—"}`;

    left.appendChild(name);
    left.appendChild(meta);

    const right = document.createElement("div");
    right.className = "remItem__due";

    if (els.reminderMode.value === "negative_only") {
      right.textContent = `${d.labels.balance}: ${formatEUR(bal)}`;
    } else {
      right.textContent = `${d.labels.due}: ${formatEUR(due)}`;
    }

    top.appendChild(left);
    top.appendChild(right);

    item.appendChild(top);

    const actions = document.createElement("div");
    actions.className = "familyActions";

    const openBtn = document.createElement("button");
    openBtn.className = "btn btn--primary";
    openBtn.type = "button";
    openBtn.textContent = d.labelsExtra?.openEmail || (state.lang === "de" ? "Mail öffnen" : "Open email");
    openBtn.addEventListener("click", () => openReminderMailForFamily(f.id));

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn";
    copyBtn.type = "button";
    copyBtn.textContent = d.labelsExtra?.copyText || (state.lang === "de" ? "Text kopieren" : "Copy text");
    copyBtn.addEventListener("click", async () => {
      const subj = String(els.reminderSubject.value || "").trim() || dict().defaults.reminderSubject;
      const tmpl = String(els.reminderTemplate.value || "").trim() || dict().defaults.reminderTemplate;
      const body = fillTemplatePlaceholders(tmpl, f, bal);
      await copyTextToClipboard(body, copyBtn);
    });

    actions.appendChild(openBtn);
    actions.appendChild(copyBtn);
    item.appendChild(actions);

    els.reminderList.appendChild(item);
  }

  els.reminderCount.textContent = state.lang === "de" ? `${list.length} Empfänger` : `${list.length} recipients`;
}

function openReminderMailForFamily(familyId) {
  const f = familyById(familyId);
  if (!f) return;

  const { byFamily } = calcBalances();
  const bal = byFamily.get(familyId) || 0;

  state.reminderTemplateByLang[state.lang] = {
    subject: String(els.reminderSubject.value || "").slice(0, 120),
    template: String(els.reminderTemplate.value || ""),
  };
  saveState();

  const subject = String(els.reminderSubject.value || "").trim() || dict().defaults.reminderSubject;
  const tmpl = String(els.reminderTemplate.value || "").trim() || dict().defaults.reminderTemplate;
  const body = fillTemplatePlaceholders(tmpl, f, bal);

  const url = `mailto:${encodeURIComponent(f.email || "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

function copyAllReminderTexts() {
  buildReminderQueue();

  if (reminderQueue.length === 0) {
    const msg = state.lang === "de" ? "Keine Empfänger." : "No recipients.";
    copyTextToClipboard(msg, els.copyAllReminders);
    return;
  }

  const blocks = reminderQueue.map((r) =>
    ["----", `TO: ${r.email}`, `SUBJECT: ${r.subject}`, "", r.body.trim(), ""].join("\n")
  );

  copyTextToClipboard(blocks.join("\n"), els.copyAllReminders);
}

function openNextReminderEmail() {
  buildReminderQueue();
  if (reminderQueue.length === 0) return;

  const r = reminderQueue[Math.min(reminderIndex, reminderQueue.length - 1)];
  reminderIndex = Math.min(reminderIndex + 1, reminderQueue.length);

  const url = `mailto:${encodeURIComponent(r.email || "")}?subject=${encodeURIComponent(r.subject)}&body=${encodeURIComponent(r.body)}`;
  window.location.href = url;
}

function openReminderDialog() {
  const d = dict();
  const tmpl = state.reminderTemplateByLang?.[state.lang] || d.defaults;

  els.reminderSubject.value = tmpl.subject || d.defaults.reminderSubject;
  els.reminderTemplate.value = tmpl.template || d.defaults.reminderTemplate;

  if (!els.reminderMode.value) els.reminderMode.value = "below_target";
  if (typeof els.reminderActiveOnly.checked !== "boolean") els.reminderActiveOnly.checked = true;

  renderReminderList();
  openDialog(els.reminderDialog);
}

/** ---------- Report modal ---------- **/
let reportFamilyId = null;

function familyTxRows(familyId) {
  return state.tx
    .filter((t) => t.familyId === familyId)
    .slice()
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO) || b.createdAt - a.createdAt);
}

function openReportForFamily(familyId) {
  const d = dict();
  const f = familyById(familyId);
  if (!f) return;

  reportFamilyId = familyId;

  const { byFamily } = calcBalances();
  const bal = byFamily.get(familyId) || 0;
  const due = dueCents(bal);

  const rows = familyTxRows(familyId);

  const header = `
    <h3>${familyDisplayName(f)}</h3>
    <div class="muted">${d.labels.email}: ${f.email || "—"} · ${d.labels.children}: ${childrenText(f) || "—"} · ${d.labels.parents}: ${parentsText(f) || "—"}</div>
    <div style="margin-top:10px; font-weight:900;">
      ${d.labels.balance}: <span style="color:${bal < 0 ? "var(--neg)" : bal > 0 ? "var(--pos)" : "inherit"}">${formatEUR(bal)}</span>
    </div>
    ${
      state.targetCents > 0
        ? `<div class="muted" style="margin-top:6px;">${d.labels.target}: ${formatEUR(state.targetCents)} · ${d.labels.due}: <span style="color:${
            due > 0 ? "var(--neg)" : "inherit"
          }">${formatEUR(due)}</span></div>`
        : ""
    }
  `;

  let running = 0;
  const chrono = rows.slice().sort((a, b) => a.dateISO.localeCompare(b.dateISO) || a.createdAt - b.createdAt);
  const runMap = new Map();
  for (const t of chrono) {
    running += t.centsSigned || 0;
    runMap.set(t.id, running);
  }

  const tableRows = rows
    .map((t) => {
      const kind = t.type === "deposit" ? d.labels.deposit : d.labels.expense;
      const amt = formatEUR(t.centsSigned);
      const run = formatEUR(runMap.get(t.id) || 0);
      const note = t.note ? String(t.note).replaceAll("<", "&lt;").replaceAll(">", "&gt;") : "";
      return `
      <tr>
        <td>${t.dateISO}</td>
        <td>${kind}</td>
        <td>${note || "—"}</td>
        <td style="text-align:right; font-weight:900;">${amt}</td>
        <td style="text-align:right; color:${
          (runMap.get(t.id) || 0) < 0 ? "var(--neg)" : (runMap.get(t.id) || 0) > 0 ? "var(--pos)" : "inherit"
        }">${run}</td>
      </tr>
    `;
    })
    .join("");

  const typeLabel = d.labelsExtra?.type || (state.lang === "de" ? "Typ" : "Type");

  const table = `
    <div style="margin-top:12px;"></div>
    <table>
      <thead>
        <tr>
          <th>${d.labels.date}</th>
          <th>${typeLabel}</th>
          <th>${d.labels.note}</th>
          <th style="text-align:right;">€</th>
          <th style="text-align:right;">${d.labels.balance}</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || `<tr><td colspan="5" class="muted">${state.lang === "de" ? "Keine Buchungen." : "No transactions."}</td></tr>`}
      </tbody>
    </table>
  `;

  els.reportContent.innerHTML = header + table;
  openDialog(els.reportDialog);
}

function copyReportText() {
  if (!reportFamilyId) return;
  const f = familyById(reportFamilyId);
  if (!f) return;

  const { byFamily } = calcBalances();
  const bal = byFamily.get(reportFamilyId) || 0;
  const due = dueCents(bal);

  const lines = [];
  lines.push(`${familyDisplayName(f)} (${f.email || "—"})`);
  lines.push(`${state.lang === "de" ? "Kinder" : "Children"}: ${childrenText(f) || "—"}`);
  lines.push(`${state.lang === "de" ? "Eltern" : "Parents"}: ${parentsText(f) || "—"}`);
  lines.push(`${state.lang === "de" ? "Saldo" : "Balance"}: ${formatEUR(bal)}`);
  if (state.targetCents > 0) {
    lines.push(
      `${state.lang === "de" ? "Ziel" : "Target"}: ${formatEUR(state.targetCents)} · ${state.lang === "de" ? "Fehlt" : "Due"}: ${formatEUR(due)}`
    );
  }
  lines.push("");
  lines.push(state.lang === "de" ? "Buchungen:" : "Transactions:");

  const rows = familyTxRows(reportFamilyId).slice().sort((a, b) => a.dateISO.localeCompare(b.dateISO) || a.createdAt - b.createdAt);
  let running = 0;
  for (const t of rows) {
    running += t.centsSigned || 0;
    const kind = t.type === "deposit" ? (state.lang === "de" ? "Einzahlung" : "Contribution") : state.lang === "de" ? "Ausgabe" : "Expense";
    lines.push(`${t.dateISO} · ${kind} · ${formatEUR(t.centsSigned)} · ${t.note || "—"} · ${formatEUR(running)}`);
  }

  return lines.join("\n");
}

function printReport() {
  if (!reportFamilyId) return;
  const content = els.reportContent.innerHTML;

  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;

  w.document.open();
  w.document.write(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Class Fund — Report</title>
  <style>
    body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 18px; }
    h3{ margin: 0 0 6px; }
    .muted{ color: #555; }
    table{ width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
    th, td{ border-bottom: 1px solid #ddd; padding: 8px 6px; vertical-align: top; }
    th{ text-align: left; color:#333; }
  </style>
</head>
<body>
  ${content}
  <script>
    window.onload = function(){ window.print(); };
  </script>
</body>
</html>
  `);
  w.document.close();
}

/** ---------- export/import ---------- **/
function openExport() {
  const payload = { exportedAt: new Date().toISOString(), ...state };
  els.exportText.value = JSON.stringify(payload, null, 2);
  openDialog(els.exportDialog);
}
function downloadJson() {
  const blob = new Blob([els.exportText.value], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "klassenkasse-export.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}
function importJsonFile(file) {
  const d = dict();
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!parsed || typeof parsed !== "object") throw new Error("bad");
      if (!Array.isArray(parsed.families) || !Array.isArray(parsed.tx) || !Array.isArray(parsed.expenses)) {
        throw new Error("bad format");
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      state = loadState();
      renderAll();
    } catch {
      alert(d.errors.importFailed);
    } finally {
      els.importInput.value = "";
    }
  };
  reader.readAsText(file);
}

/** ---------- reset ---------- **/
function openResetConfirm() {
  openDialog(els.confirmDialog);
}
function doReset() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  saveState();
  renderAll();
  closeDialog(els.confirmDialog);
}

/** ---------- UI toggles ---------- **/
function updateExpenseUI() {
  const who = expenseWho();
  els.expenseSelectedWrap.hidden = who !== "selected";
}

/** ---------- target setting ---------- **/
function renderTargetInput() {
  els.targetAmount.value = state.targetCents ? String((state.targetCents / 100).toFixed(2)) : "";
}
function updateTargetFromInput() {
  const c = centsFromInput(els.targetAmount.value);
  state.targetCents = c === null ? 0 : c;
  saveState();
  renderAll();
}

/** ---------- render all ---------- **/
function renderAll() {
  applyI18n();
  updateSeoLinkForLang(state.lang);
  applyLangVisibility();

  els.lang.value = state.lang;
  els.theme.value = state.theme;
  setTheme(state.theme);

  if (!els.depositDate.value) els.depositDate.value = todayISO();
  if (!els.expenseDate.value) els.expenseDate.value = todayISO();

  renderTargetInput();
  renderFamilyPickers();
  renderSummary();
  renderFamilies();
  renderLedger();
  updateExpenseUI();
  updateEmailPreview();

  if (els.reminderDialog?.open) renderReminderList();
}

/** ---------- bindings ---------- **/
els.lang.addEventListener("change", () => setLang(els.lang.value));

els.theme.addEventListener("change", () => {
  state.theme = els.theme.value;
  setTheme(state.theme);
  saveState();
});

els.targetAmount.addEventListener("change", updateTargetFromInput);
els.targetAmount.addEventListener("keydown", (e) => {
  if (e.key === "Enter") updateTargetFromInput();
});

els.addFamilyBtn.addEventListener("click", addFamily);
els.addDepositBtn.addEventListener("click", addDeposit);

document.querySelectorAll('input[name="expenseWho"]').forEach((r) => r.addEventListener("change", updateExpenseUI));
els.addExpenseBtn.addEventListener("click", addExpenseSplit);

els.search.addEventListener("input", renderFamilies);
els.statusFilter.addEventListener("change", renderFamilies);
els.ledgerFilter.addEventListener("change", renderLedger);

els.exportBtn.addEventListener("click", openExport);
els.closeExport.addEventListener("click", () => closeDialog(els.exportDialog));
els.copyExport.addEventListener("click", () => copyTextToClipboard(els.exportText.value, els.copyExport));
els.downloadExport.addEventListener("click", downloadJson);

els.importInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) importJsonFile(file);
});

els.resetBtn.addEventListener("click", openResetConfirm);
els.closeConfirm.addEventListener("click", () => closeDialog(els.confirmDialog));
els.cancelReset.addEventListener("click", () => closeDialog(els.confirmDialog));
els.confirmReset.addEventListener("click", doReset);

// Email dialog
els.closeEmail.addEventListener("click", () => {
  emailFamilyId = null;
  closeDialog(els.emailDialog);
});
els.emailTemplate.addEventListener("input", updateEmailPreview);
els.copyEmail.addEventListener("click", () => {
  state.emailTemplateByLang[state.lang] = {
    subject: String(els.emailSubject.value || "").slice(0, 120),
    template: String(els.emailTemplate.value || ""),
  };
  saveState();
  copyTextToClipboard(els.emailPreview.textContent || "", els.copyEmail);
});
els.openMailto.addEventListener("click", openMailClient);

// Reminder dialog
els.reminderBtn.addEventListener("click", openReminderDialog);
els.closeReminder.addEventListener("click", () => closeDialog(els.reminderDialog));
els.reminderMode.addEventListener("change", renderReminderList);
els.reminderActiveOnly.addEventListener("change", renderReminderList);
els.reminderTemplate.addEventListener("input", () => {
  state.reminderTemplateByLang[state.lang] = {
    subject: String(els.reminderSubject.value || "").slice(0, 120),
    template: String(els.reminderTemplate.value || ""),
  };
  saveState();
});
els.reminderSubject.addEventListener("input", () => {
  state.reminderTemplateByLang[state.lang] = {
    subject: String(els.reminderSubject.value || "").slice(0, 120),
    template: String(els.reminderTemplate.value || ""),
  };
  saveState();
});
els.copyAllReminders.addEventListener("click", copyAllReminderTexts);
els.openNextReminder.addEventListener("click", openNextReminderEmail);

// Report dialog
els.closeReport.addEventListener("click", () => {
  reportFamilyId = null;
  closeDialog(els.reportDialog);
});
els.copyReport.addEventListener("click", () => {
  const text = copyReportText();
  if (text) copyTextToClipboard(text, els.copyReport);
});
els.printReport.addEventListener("click", printReport);

/** ---------- init ---------- **/
(function initLangFromUrl() {
  const urlLang = new URLSearchParams(location.search).get("lang");
  if (urlLang) state.lang = normalizeLang(urlLang);
})();

renderAll();
