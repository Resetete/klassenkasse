/* =========================================================
   ClassFund / Klassenkasse — app.js (v1.3)
   ---------------------------------------------------------
   ✓ Backward compatible with existing exports
   ✓ Expense mode toggle:
     - "all eligible" (preselect all, allow uncheck)
     - "custom selection" (start empty, user checks)
   ✓ Expense list always filtered by eligibility:
     - manual active=true
     - AND within activeFromISO/activeToISO for expense date
   ✓ Deposit dropdown filtered by date eligibility
   ✓ Add-Family form wired
   ✓ NEW: Family overview popup (reportDialog)
   --------------------------------------------------------- */

const STORAGE_KEY = "klassenkasse_familien_v1";

/** ---------- i18n (minimal + safe) ---------- **/
const I18N = {
  de: {
    text: {
      appTitle: "Klassenkasse",
      appSubtitle: "Familienkonten, Einzahlungen, Klassen-Ausgaben verteilen, Salden & E-Mail Texte.",
      languageLabel: "Sprache",
      themeLabel: "Theme",
      reminderBtn: "Erinnerungen",
      exportBtn: "Export",
      importBtn: "Import",
      downloadBankCsvBtn: "CSV (Bank) Download",
      resetBtn: "Reset",

      summaryTitle: "Übersicht",
      totalBalanceLabel: "Gesamtsaldo",
      familiesCountLabel: "Familien",
      txCountLabel: "Buchungen",
      bankDeposits: "Einzahlungen (Bank)",
      bankExpenses: "Ausgaben (Bank)",
      bankBalance: "Kontostand Bank",

      settingsTitle: "Einstellungen",
      targetAmountLabel: "Zielbetrag pro Familie (€)",
      phTargetAmount: "z. B. 25,00",
      targetHint: "Wenn gesetzt: Jede Familie sollte mindestens diesen Saldo haben.",

      depositTitle: "Einzahlung",
      dateLabel: "Datum",
      familyLabel: "Familie",
      amountLabel: "Betrag (€)",
      phDepositAmount: "z. B. 10,00",
      noteLabel: "Notiz (optional)",
      phDepositNote: "z. B. Januar",
      addDepositBtn: "Einzahlung hinzufügen",

      categoryLabel: "Kategorie",
      categoriesTitle: "Kategorien",
      uncategorized: "Unkategorisiert",

      classExpenseTitle: "Klassen-Ausgabe aufteilen",
      expenseTitleLabel: "Titel",
      phExpenseTitle: "z. B. Ausflug",
      totalAmountLabel: "Gesamtbetrag (€)",
      phExpenseAmount: "z. B. 30,00",
      expenseSelectLabel: "Familien",
      expenseAllHint: "Alle passenden Familien sind vorausgewählt — abwählen, um auszuschließen.",
      addExpenseBtn: "Ausgabe aufteilen",
      roundingHint: "Cent-Reste werden fair verteilt.",

      addFamilyTitle: "Familie hinzufügen",
      familyRareHint: "(selten nötig – neue Familie kommt dazu)",
      parent1Label: "Elternteil 1",
      phParent1: "Name",
      parent2Label: "Elternteil 2 (optional)",
      phParent2: "Name",
      emailLabel: "E-Mail",
      phEmail: "name@mail.de",
      emailOptionalHint: "Optional — ohne E-Mail sind Erinnerungen/Mails deaktiviert.",
      childrenLabel: "Kinder (kommagetrennt)",
      phChildren: "z. B. Mia, Leo",
      activeFromLabel: "In Klasse ab",
      activeToLabel: "In Klasse bis",
      familyNoteLabel: "Kommentar",
      phFamilyNote: "optional",
      addFamilyBtn: "Familie hinzufügen",
      familyHint: "Tipp: Inaktive Familien werden aus Auswahlfeldern ausgeschlossen, bleiben aber in der Historie.",

      familiesTitle: "Familien",
      ledgerTitle: "Historie",
      emptyState: "Noch keine Buchungen.",

      exportTitle: "Export",
      exportHelp: "Kopiere dieses JSON oder lade es als Datei herunter.",
      copyBtn: "Kopieren",
      downloadBtn: "Download .json",

      resetTitle: "Alles zurücksetzen?",
      resetHelp: "Alle Daten werden aus diesem Browser gelöscht. Exportiere vorher, wenn du ein Backup möchtest.",
      cancelBtn: "Abbrechen",
      confirmBtn: "Zurücksetzen",

      emailTitle: "E-Mail erstellen",
      emailSubjectLabel: "Betreff",
      emailTemplateLabel: "Vorlage",
      emailPlaceholdersHint: "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
      openMailBtn: "Mail-App öffnen",
      emailPreviewLabel: "Vorschau",

      reminderTitle: "Erinnerungen (Batch)",
      reminderModeLabel: "Kriterium",
      reminderBelowTarget: "Unter Ziel",
      reminderNegativeOnly: "Nur negativ",
      reminderActiveOnly: "Nur aktive Familien",
      reminderHint: "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
      copyAllBtn: "Alle kopieren",
      openNextBtn: "Nächste Mail öffnen",
      reminderListLabel: "Empfänger:innen",

      reportTitle: "Übersicht",
      printBtn: "Drucken / PDF",
    },
    labels: {
      deposit: "Einzahlung",
      expense: "Ausgabe",
      date: "Datum",
      note: "Notiz",
      balance: "Saldo",
      due: "Fehlt noch",
      target: "Ziel",
      families: "Familien",
      tx: "Buchungen",
      emailMissing: "Keine E-Mail hinterlegt.",
      reportTitleTx: "Buchungen",
      reportNoTx: "Keine Buchungen.",
      typeDeposit: "Einzahlung",
      typeExpense: "Ausgabe",
      typeExpenseWithTitle: "Ausgabe: {title}",
    },
    defaults: {
      expenseTitle: "Klassen-Ausgabe",
    },
    errors: {
      amountInvalid: "Bitte einen gültigen Betrag > 0 eingeben.",
      familyMissing: "Bitte eine Familie auswählen.",
      noParticipants: "Bitte mindestens eine Familie auswählen.",
      emailInvalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
      familyNameRequired: "Bitte mindestens ein Kind oder einen Elternteil angeben.",
      importFailed: "Import fehlgeschlagen: ungültige Datei.",
      confirmReset: "Wirklich zurücksetzen? (Vorher Export machen.)",
    },
    ui: {
      allPreselectedHint: "Alle passenden Familien sind vorausgewählt — abwählen, um auszuschließen.",
      customSelectHint: "Wähle die Familien aus, auf die die Ausgabe verteilt werden soll.",
      noEligibleFamilies: "Keine passenden Familien für dieses Datum.",
      exportFilename: "klassenkasse-export.json",

      expenseModeAll: "Alle aktiven Familien",
      expenseModeCustom: "Nur ausgewählte Familien",
    },
  },
  en: {
    text: {
      appTitle: "Class Fund",
      appSubtitle: "Family accounts, contributions, split class expenses, balances & email texts.",
      languageLabel: "Language",
      themeLabel: "Theme",
      reminderBtn: "Reminders",
      exportBtn: "Export",
      downloadBankCsvBtn: "CSV (Bank) Download",
      downloadAllCsvBtn: "CSV (All) Download",
      importBtn: "Import",
      resetBtn: "Reset",

      summaryTitle: "Overview",
      totalBalanceLabel: "Total balance",
      familiesCountLabel: "Families",
      txCountLabel: "Transactions",
      bankDeposits: "Deposits (bank)",
      bankExpenses: "Expenses (bank)",
      bankBalance: "Bank balance",

      settingsTitle: "Settings",
      targetAmountLabel: "Target amount per family (€)",
      phTargetAmount: "e.g. 25.00",
      targetHint: "If set: each family should have at least this balance.",

      depositTitle: "Contribution",
      dateLabel: "Date",
      familyLabel: "Family",
      amountLabel: "Amount (€)",
      phDepositAmount: "e.g. 10.00",
      noteLabel: "Note (optional)",
      phDepositNote: "e.g. January",
      addDepositBtn: "Add contribution",

      categoryLabel: "Category",
      categoriesTitle: "Categories",
      uncategorized: "Uncategorized",

      classExpenseTitle: "Split class expense",
      expenseTitleLabel: "Title",
      phExpenseTitle: "e.g. Trip",
      totalAmountLabel: "Total amount (€)",
      phExpenseAmount: "e.g. 30.00",
      expenseSelectLabel: "Families",
      expenseAllHint: "All eligible families are preselected — uncheck to exclude.",
      addExpenseBtn: "Split expense",
      roundingHint: "Cent remainders are distributed fairly.",

      addFamilyTitle: "Add family",
      familyRareHint: "(rarely needed – new family joins)",
      parent1Label: "Parent 1",
      phParent1: "Name",
      parent2Label: "Parent 2 (optional)",
      phParent2: "Name",
      emailLabel: "Email",
      phEmail: "name@mail.com",
      emailOptionalHint: "Optional — reminders/emails are disabled without an email.",
      childrenLabel: "Children (comma-separated)",
      phChildren: "e.g. Mia, Leo",
      activeFromLabel: "In class from",
      activeToLabel: "In class until",
      familyNoteLabel: "Comment",
      phFamilyNote: "optional",
      addFamilyBtn: "Add family",
      familyHint: "Tip: inactive families are excluded from selections, but remain in history.",

      familiesTitle: "Families",
      ledgerTitle: "History",
      emptyState: "No transactions yet.",

      exportTitle: "Export",
      exportHelp: "Copy this JSON or download it as a file.",
      copyBtn: "Copy",
      downloadBtn: "Download .json",

      resetTitle: "Reset everything?",
      resetHelp: "All data will be removed from this browser. Export first if you want a backup.",
      cancelBtn: "Cancel",
      confirmBtn: "Reset",

      emailTitle: "Create email",
      emailSubjectLabel: "Subject",
      emailTemplateLabel: "Template",
      emailPlaceholdersHint: "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
      openMailBtn: "Open mail app",
      emailPreviewLabel: "Preview",

      reminderTitle: "Reminder batch",
      reminderModeLabel: "Criteria",
      reminderBelowTarget: "Below target",
      reminderNegativeOnly: "Negative only",
      reminderActiveOnly: "Active families only",
      reminderHint: "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
      copyAllBtn: "Copy all",
      openNextBtn: "Open next email",
      reminderListLabel: "Recipients",

      reportTitle: "Overview",
      printBtn: "Print / PDF",
    },
    labels: {
      deposit: "Contribution",
      expense: "Expense",
      date: "Date",
      note: "Note",
      balance: "Balance",
      due: "Due",
      target: "Target",
      families: "Families",
      tx: "Transactions",
      emailMissing: "No email set.",
      reportTitleTx: "Transactions",
      reportNoTx: "No transactions.",
      typeDeposit: "Contribution",
      typeExpense: "Expense",
      typeExpenseWithTitle: "Expense: {title}",
    },
    defaults: {
      expenseTitle: "Class expense",
    },
    errors: {
      amountInvalid: "Please enter a valid amount > 0.",
      familyMissing: "Please select a family.",
      noParticipants: "Please select at least one family.",
      emailInvalid: "Please enter a valid email address.",
      familyNameRequired: "Please enter at least one child or a parent name.",
      importFailed: "Import failed: invalid file.",
      confirmReset: "Reset everything? (Export first.)",
    },
    ui: {
      allPreselectedHint: "All eligible families are preselected — uncheck to exclude.",
      customSelectHint: "Select the families to split this expense across.",
      noEligibleFamilies: "No eligible families for this date.",
      exportFilename: "classfund-export.json",

      expenseModeAll: "All active families",
      expenseModeCustom: "Selected families only",
    },
  },
};

const SUPPORTED_LANGS = ["de", "en"];
function normalizeLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : "en";
}
function dict() {
  return I18N[normalizeLang(state?.lang || "en")] || I18N.en;
}

/** ---------- language switcher helpers ---------- **/
function setLang(lang) {
  state.lang = normalizeLang(lang);
  document.documentElement.lang = state.lang;
  saveState();
  renderAll();
}

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
function downloadTextFile(filename, content, mime = "application/octet-stream") {
  const blob = new Blob([content], { type: mime });

  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;   // wichtig
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);

  a.click();

  // Safari/WebKit: später revoke, sonst "Unbenannt"
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 1500);
}

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
function isISODate(v) {
  const s = String(v || "").trim();
  if (!s) return true; // leer ist ok (optional)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
function assertISODateOrEmpty(value, fieldLabel) {
  const s = String(value || "").trim();
  if (!s) return ""; // empty ok
  if (!isISODate(s)) {
    throw new Error(fieldLabel);
  }
  return s;
}
function centsFromInput(v) {
  const n = Number(String(v || "").replace(",", "."));
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
  const lang = normalizeLang(state.lang);
  try {
    return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-GB", {
      style: "currency",
      currency: "EUR",
    }).format(n);
  } catch {
    return `${n.toFixed(2)} €`;
  }
}
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** ---------- state ---------- **/
function defaultState() {
  return {
    version: 13,
    lang: "en",
    theme: "minimal",
    targetCents: 0,
    families: [],
    tx: [],
    expenses: [],
    categories: ["Einzahlung", "Ausflug", "Reise", "Material", "Geschenk", "Veranstaltung", "Sonstiges"],

    // "all" = preselect all eligible, allow uncheck
    // "custom" = start empty, user checks families
    expenseSelectMode: "all",
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();

    const parsed = JSON.parse(raw);
    const base = defaultState();

    const lang = normalizeLang(parsed.lang);
    const theme = ["minimal", "paper"].includes(parsed.theme) ? parsed.theme : base.theme;
    const targetCents =
      Number.isFinite(parsed.targetCents) && parsed.targetCents >= 0 ? parsed.targetCents : base.targetCents;

    const families = Array.isArray(parsed.families) ? parsed.families : [];
    const tx = Array.isArray(parsed.tx) ? parsed.tx : [];
    const expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
    const categories = Array.isArray(parsed.categories) ? parsed.categories.filter(Boolean).map(String) : base.categories;

    const expenseSelectMode = parsed.expenseSelectMode === "custom" ? "custom" : "all";

    return {
      ...base,
      ...parsed,
      lang,
      theme,
      targetCents,
      expenseSelectMode,
      categories,
      families: families.map((f) => ({
        id: f.id || uid(),
        parent1: typeof f.parent1 === "string" ? f.parent1.slice(0, 60) : "",
        parent2: typeof f.parent2 === "string" ? f.parent2.slice(0, 60) : "",
        email: typeof f.email === "string" ? f.email.slice(0, 120) : "",
        children: Array.isArray(f.children) ? f.children.filter(Boolean).map((x) => String(x).slice(0, 60)) : [],
        active: typeof f.active === "boolean" ? f.active : true,
        createdAt: Number.isFinite(f.createdAt) ? f.createdAt : Date.now(),

        comment: typeof f.comment === "string" ? f.comment.slice(0, 160) : "",
        activeFromISO: (typeof f.activeFromISO === "string" && f.activeFromISO && isISODate(f.activeFromISO)) ? f.activeFromISO : null,
        activeToISO: (typeof f.activeToISO === "string" && f.activeToISO && isISODate(f.activeToISO)) ? f.activeToISO : null,
      })),
      tx: tx.map((t) => ({
        id: t.id || uid(),
        type: t.type === "allocation" ? "allocation" : "deposit",
        familyId: typeof t.familyId === "string" ? t.familyId : "",
        centsSigned: Number.isFinite(t.centsSigned) ? t.centsSigned : 0,
        dateISO: typeof t.dateISO === "string" ? t.dateISO : todayISO(),
        note: typeof t.note === "string" ? t.note.slice(0, 120) : "",
        createdAt: Number.isFinite(t.createdAt) ? t.createdAt : Date.now(),
        category: typeof t.category === "string" ? t.category.slice(0, 40) : null,
        expenseId: typeof t.expenseId === "string" ? t.expenseId : null,
      })),
      expenses: expenses.map((e) => ({
        id: e.id || uid(),
        title: typeof e.title === "string" ? e.title.slice(0, 80) : "",
        totalCents: Number.isFinite(e.totalCents) ? e.totalCents : 0,
        dateISO: typeof e.dateISO === "string" ? e.dateISO : todayISO(),
        participantIds: Array.isArray(e.participantIds) ? e.participantIds.filter(Boolean) : [],
        category: typeof e.category === "string" ? e.category.slice(0, 40) : null,
        perFamilyCentsMap: e.perFamilyCentsMap && typeof e.perFamilyCentsMap === "object" ? e.perFamilyCentsMap : {},
        createdAt: Number.isFinite(e.createdAt) ? e.createdAt : Date.now(),
      })),
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
  reminderBtn: document.getElementById("reminderBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  resetBtn: document.getElementById("resetBtn"),
  exportDialog: document.getElementById("exportDialog"),
  exportText: document.getElementById("exportText"),
  copyExport: document.getElementById("copyExport"),
  downloadExport: document.getElementById("downloadExport"),
  closeExport: document.getElementById("closeExport"),
  downloadBankCsvBtn: document.getElementById("downloadBankCsvBtn"),

  totalBalance: document.getElementById("totalBalance"),
  familiesCount: document.getElementById("familiesCount"),
  txCount: document.getElementById("txCount"),

  targetAmount: document.getElementById("targetAmount"),

  depositDate: document.getElementById("depositDate"),
  depositFamily: document.getElementById("depositFamily"),
  depositAmount: document.getElementById("depositAmount"),
  depositNote: document.getElementById("depositNote"),
  addDepositBtn: document.getElementById("addDepositBtn"),

  depositCategory: document.getElementById("depositCategory"),
  expenseCategory: document.getElementById("expenseCategory"),
  categoryOverview: document.getElementById("categoryOverview"),

  expenseDate: document.getElementById("expenseDate"),
  expenseTitle: document.getElementById("expenseTitle"),
  expenseAmount: document.getElementById("expenseAmount"),
  expenseFamilyChecklist: document.getElementById("expenseFamilyChecklist"),
  expenseAllHint: document.getElementById("expenseAllHint"),
  addExpenseBtn: document.getElementById("addExpenseBtn"),

  // mode controls (in HTML)
  expenseModeAll: document.getElementById("expenseModeAll"),
  expenseModeCustom: document.getElementById("expenseModeCustom"),

  familyFormDetails: document.getElementById("familyFormDetails"),
  parent1: document.getElementById("parent1"),
  parent2: document.getElementById("parent2"),
  email: document.getElementById("email"),
  children: document.getElementById("children"),
  activeFrom: document.getElementById("activeFrom"),
  activeTo: document.getElementById("activeTo"),
  familyNote: document.getElementById("familyNote"),
  addFamilyBtn: document.getElementById("addFamilyBtn"),

  familiesList: document.getElementById("familiesList"),
  ledger: document.getElementById("ledger"),
  emptyState: document.getElementById("emptyState"),

  // family report dialog
  reportDialog: document.getElementById("reportDialog"),
  reportContent: document.getElementById("reportContent"),
  closeReport: document.getElementById("closeReport"),
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
  return (f?.children || []).join(", ");
}
function familyDisplayName(f) {
  const kids = (f?.children || []).map((s) => String(s || "").trim()).filter(Boolean);
  if (kids.length === 1) return kids[0];
  if (kids.length === 2) return `${kids[0]} & ${kids[1]}`;
  if (kids.length >= 3) return `${kids[0]}, ${kids[1]} +${kids.length - 2}`;
  return parentsText(f);
}
function familyById(id) {
  return state.families.find((f) => f.id === id) || null;
}
function dueCents(balanceCents) {
  if (!state.targetCents || state.targetCents <= 0) return 0;
  return Math.max(0, state.targetCents - (balanceCents || 0));
}

function uncategorizedLabel() {
  return dict().text.uncategorized || (state.lang === "de" ? "Unkategorisiert" : "Uncategorized");
}

function normalizeCategory(raw) {
  const v = String(raw || "").trim().slice(0, 40);
  return v || uncategorizedLabel();
}

function categoryClass(cat) {
  switch (normalizeCategory(cat).toLowerCase()) {
    case "material":
      return "badge--cat-material";
    case "ausflug":
      return "badge--cat-ausflug";
    case "geschenk":
      return "badge--cat-geschenk";
    case "veranstaltung":
      return "badge--cat-veranstaltung";
    case "essen":
      return "badge--cat-essen";
    case "einzahlung":
      return "badge--cat-einzahlung";
    default:
      return "badge--cat-unkategorisiert";
  }
}

function categoryBadge(cat) {
  const label = escapeHtml(normalizeCategory(cat));
  const cls = categoryClass(cat);
  return `<span class="badge badge--category ${cls}">${label}</span>`;
}

function ensureCategoryExists(cat) {
  const c = normalizeCategory(cat);
  if (!state.categories.includes(c) && c !== uncategorizedLabel()) {
    state.categories.push(c);
    state.categories.sort((a, b) => a.localeCompare(b));
  }
  return c;
}

function renderCategoryPickers() {
  const cats = (state.categories || []).slice();
  const unc = uncategorizedLabel();
  if (!cats.includes(unc)) cats.unshift(unc);

  function fillSelect(sel) {
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = "";
    for (const c of cats) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    }
    // keep selection if possible
    if (cats.includes(current)) sel.value = current;
    else sel.value = unc;
  }

  fillSelect(els.depositCategory);
  fillSelect(els.expenseCategory);
}

/** Only families eligible for a given date are shown/selectable */
function familyEligibleForDate(f, dateISO) {
  if (!f || !f.active) return false;
  const from = f.activeFromISO ? String(f.activeFromISO) : "";
  const to = f.activeToISO ? String(f.activeToISO) : "";
  if (from && dateISO < from) return false;
  if (to && dateISO > to) return false;
  return true;
}

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

function rebuildExpenseAllocations(expenseId, newTitle, newTotalCents, newDateISO, newParticipantIds) {
  // Update expense object
  const e = state.expenses.find((x) => x.id === expenseId);
  if (!e) return false;

  // Remove all allocation tx rows for this expenseId
  state.tx = state.tx.filter((t) => !(t.type === "allocation" && t.expenseId === expenseId));

  // Recompute split
  const perMap = splitCents(newTotalCents, newParticipantIds);

  e.title = newTitle;
  e.totalCents = newTotalCents;
  e.dateISO = newDateISO;
  e.participantIds = newParticipantIds;
  e.perFamilyCentsMap = perMap;

  // Recreate allocation tx rows
  for (const fid of newParticipantIds) {
    const part = perMap[fid] || 0;
    state.tx.push({
      id: uid(),
      type: "allocation",
      familyId: fid,
      centsSigned: -part,
      dateISO: newDateISO,
      note: newTitle,
      createdAt: Date.now(),
      expenseId,
    });
  }

  return true;
}

/** =========================================================
/** ---------- balances ---------- **/
/** =========================================================*/

function calcBalances() {
  // Per-family balances only for families that still exist in state.families
  const byFamily = new Map(state.families.map((f) => [f.id, 0]));

  // Total should reflect *all* tx rows, even if a family was deleted/missing
  let total = 0;

  // Optional diagnostics: tx entries referencing missing families
  let orphanTxCount = 0;
  let orphanCentsTotal = 0;

  for (const t of state.tx) {
    const v = t?.centsSigned || 0;

    // TOTAL: always include every tx
    total += v;

    const fid = t?.familyId;
    if (!fid || !byFamily.has(fid)) {
      orphanTxCount += 1;
      orphanCentsTotal += v;
      continue;
    }

    byFamily.set(fid, byFamily.get(fid) + v);
  }

  return { byFamily, total, orphanTxCount, orphanCentsTotal };
}

function calcBankTotals() {
  let deposits = 0;
  let expenses = 0;

  for (const t of state.tx) {
    if (t.type === "deposit") {
      deposits += t.centsSigned || 0;
    }
  }

  for (const e of state.expenses) {
    expenses += e.totalCents || 0;
  }

  const balance = deposits - expenses;
  return { deposits, expenses, balance };
}

function calcFamilyBalances() {
  const byFamily = new Map(state.families.map((f) => [f.id, 0]));

  for (const t of state.tx) {
    if (!byFamily.has(t.familyId)) continue;
    byFamily.set(t.familyId, byFamily.get(t.familyId) + (t.centsSigned || 0));
  }

  return byFamily;
}

function detectDuplicateBankEntries() {
  const seen = new Set();
  const duplicates = [];

  // Deposits
  for (const t of state.tx.filter(t => t.type === "deposit")) {
    const key = `D|${t.dateISO}|${t.centsSigned}|${t.note || ""}|${t.familyId}`;
    if (seen.has(key)) duplicates.push(key);
    seen.add(key);
  }

  // Expenses
  for (const e of state.expenses) {
    const key = `E|${e.dateISO}|${e.totalCents}|${e.title || ""}`;
    if (seen.has(key)) duplicates.push(key);
    seen.add(key);
  }

  return duplicates;
}

function isDuplicateDeposit(dateISO, cents, note) {
  return state.tx.some(t =>
    t.type === "deposit" &&
    t.dateISO === dateISO &&
    t.centsSigned === cents &&
    (t.note || "") === (note || "")
  );
}

// Duplicates check
let duplicateWarningShown = false;
function warnIfDuplicatesOnce() {
  if (duplicateWarningShown) return;
  const dups = detectDuplicateBankEntries();
  if (dups.length === 0) return;

  duplicateWarningShown = true;
  alert(
    state.lang === "de"
      ? `⚠️ Achtung: ${dups.length} mögliche doppelte Bankbuchungen erkannt.`
      : `⚠️ Warning: ${dups.length} possible duplicate bank entries detected.`
  );
}

function bankReconciliationStatus() {
  const bank = calcBankTotals();
  const status = bank.balance === 0 ? "ok" : "warn";
  return { status, diff: bank.balance };
}

function buildBankCsvRows() {
  // Bank-relevant: deposits (tx deposit) + expenses (expenses list)
  const rows = [];

  // Deposits
  for (const t of state.tx) {
    if (t.type !== "deposit") continue;
    const f = familyById(t.familyId);
    rows.push({
      kind: "DEPOSIT",
      dateISO: t.dateISO,
      amountEUR: eurNumber(t.centsSigned),
      note: t.note || "",
      category: t.category || "",
      family: familyDisplayName(f || {}),
      familyId: t.familyId || "",
      id: t.id || "",
      createdAt: t.createdAt || "",
    });
  }

  // Expenses (as they appear on bank)
  for (const e of state.expenses) {
    rows.push({
      kind: "EXPENSE",
      dateISO: e.dateISO,
      amountEUR: eurNumber(-Math.abs(e.totalCents || 0)), // negative
      note: e.title || "",
      category: e.category || "",
      family: "",     // n/a on bank level
      familyId: "",   // n/a
      id: e.id || "",
      createdAt: e.createdAt || "",
    });
  }

  // Sort by date desc, then createdAt desc
  rows.sort((a, b) => (b.dateISO.localeCompare(a.dateISO) || (Number(b.createdAt) - Number(a.createdAt))));

  return rows;
}

function downloadBankCsv() {
  const rows = buildBankCsvRows();

  const headers = [
    "kind",        // DEPOSIT / EXPENSE
    "dateISO",
    "amountEUR",   // deposits positive, expenses negative
    "note",        // deposit note OR expense title
    "category",
    "family",
    "familyId",
    "id",
    "createdAt",
  ];

  const data = rows.map(r => headers.map(h => r[h] ?? ""));
  const csv = toCsv(data, headers, ";");

  const filename = `classfund-bank-${todayISO()}.csv`;
  downloadTextFile(filename, csv);
}


/** =========================================================
DEBUG: find orphan / suspicious transactions
 ========================================================= */
function debugFindSuspiciousTransactions() {
  const familiesById = new Set(state.families.map(f => f.id));

  const rows = state.tx.map(t => {
    const familyExists = t.familyId && familiesById.has(t.familyId);

    return {
      id: t.id,
      type: t.type,
      date: t.dateISO,
      centsSigned: t.centsSigned,
      amountEUR: formatEUR(t.centsSigned),
      familyId: t.familyId || "—",
      familyExists,
      note: t.note || "",
      expenseId: t.expenseId || null,
    };
  });

  const orphanTx = rows.filter(r => !r.familyExists);
  const orphanSum = orphanTx.reduce((s, r) => s + r.centsSigned, 0);

  console.group("🧪 ClassFund Debug — suspicious transactions");

  console.log("All transactions:", rows.length);
  console.log("Orphan transactions (missing family):", orphanTx.length);
  console.log("Orphan total:", formatEUR(orphanSum));

  if (orphanTx.length > 0) {
    console.table(orphanTx);
  } else {
    console.log("✅ No orphan transactions found.");
  }

  console.groupEnd();

  return {
    orphanTx,
    orphanSum,
    totalTxCount: rows.length,
  };
}


/** =========================================================
  FAMILY OVERVIEW POPUP (reportDialog)
========================================================= */
let currentReportFamilyId = null;

function familyTxItems(familyId) {
  const d = dict();
  const items = [];

  for (const t of state.tx) {
    if (t.familyId !== familyId) continue;

    if (t.type === "deposit") {
      items.push({
        kind: "deposit",
        dateISO: t.dateISO,
        createdAt: t.createdAt || 0,
        title: d.labels.typeDeposit,
        amountCentsSigned: t.centsSigned || 0,
      });
      continue;
    }

    // allocation (expense share)
    let expenseTitle = "";
    if (t.expenseId) {
      const e = state.expenses.find((x) => x.id === t.expenseId);
      if (e) expenseTitle = (e.title || "").trim();
    }

    const title = expenseTitle
      ? String(d.labels.typeExpenseWithTitle || "Expense: {title}").replace("{title}", expenseTitle)
      : d.labels.typeExpense;

    items.push({
      kind: "allocation",
      dateISO: t.dateISO,
      createdAt: t.createdAt || 0,
      title,
      amountCentsSigned: t.centsSigned || 0, // negative
    });
  }

  items.sort((a, b) => b.dateISO.localeCompare(a.dateISO) || (b.createdAt - a.createdAt));
  return items;
}

function calcFamilyTotals(familyId) {
  let deposits = 0;
  let expenses = 0; // positive sum of shares
  let balance = 0;

  for (const t of state.tx) {
    if (t.familyId !== familyId) continue;
    const v = t.centsSigned || 0;
    balance += v;
    if (t.type === "deposit") deposits += v;
    else expenses += Math.abs(v);
  }
  return { deposits, expenses, balance };
}

function reportTextForCopy(familyId) {
  const f = familyById(familyId);
  if (!f) return "";

  const isDE = state.lang === "de";
  const L = {
    balance: isDE ? "Saldo" : "Balance",
    target: isDE ? "Ziel" : "Target",
    due: isDE ? "Fehlt noch" : "Due",
    deposits: isDE ? "Einzahlungen" : "Contributions",
    expenses: isDE ? "Ausgaben (Anteile)" : "Expenses (shares)",
    tx: isDE ? "Buchungen" : "Transactions",
    deposit: isDE ? "Einzahlung" : "Contribution",
    expense: isDE ? "Ausgabe" : "Expense",
  };

  const { deposits, expenses, balance } = calcFamilyTotals(familyId);
  const due = dueCents(balance);

  const lines = [];
  lines.push(`${familyDisplayName(f)}`);
  lines.push(`${L.balance}: ${formatEUR(balance)}`);

  if (state.targetCents > 0) {
    lines.push(`${L.target}: ${formatEUR(state.targetCents)} · ${L.due}: ${formatEUR(due)}`);
  }

  lines.push(`${L.deposits}: ${formatEUR(deposits)}`);
  lines.push(`${L.expenses}: ${formatEUR(expenses)}`);
  lines.push("");
  lines.push(`${L.tx}:`);

  for (const it of familyTxItems(familyId)) {
    // it.title kommt aktuell schon aus state.lang (de/en), passt also
    const sign = it.amountCentsSigned >= 0 ? "+" : "–";
    lines.push(`- ${it.dateISO} · ${it.title} · ${sign}${formatEUR(Math.abs(it.amountCentsSigned))}`);
  }

  return lines.join("\n");
}

function openFamilyReport(familyId) {
  const f = familyById(familyId);
  if (!f || !els.reportDialog || !els.reportContent) return;

  currentReportFamilyId = familyId;

  const { deposits, expenses, balance } = calcFamilyTotals(familyId);
  const due = dueCents(balance);

  const name = familyDisplayName(f);
  const parents = parentsText(f);
  const kids = childrenText(f);
  const period = (f.activeFromISO || f.activeToISO) ? `${f.activeFromISO || "…"} → ${f.activeToISO || "…"} ` : null;

  const rows = familyTxItems(familyId)
    .map((it) => {
      const amt = it.amountCentsSigned;
      const cls = amt < 0 ? "neg" : amt > 0 ? "pos" : "";
      return `
        <tr>
          <td>${escapeHtml(it.dateISO)}</td>
          <td>${escapeHtml(it.title)}</td>
          <td class="${cls}" style="font-weight:900; text-align:right;">
            ${amt < 0 ? "–" : "+"}${escapeHtml(formatEUR(Math.abs(amt)))}
          </td>
        </tr>
      `;
    })
    .join("");

  els.reportContent.innerHTML = `
    <h3 style="margin:0 0 8px;">${escapeHtml(name)}</h3>
    <div class="muted" style="margin-bottom:10px;">
      ${kids ? `<div>${escapeHtml(state.lang === "de" ? "Kinder: " : "Children: ")}${escapeHtml(kids)}</div>` : ""}
      ${parents && parents !== "—" ? `<div>${escapeHtml(state.lang === "de" ? "Eltern: " : "Parents: ")}${escapeHtml(parents)}</div>` : ""}
      ${f.email ? `<div>${escapeHtml(f.email)}</div>` : ""}
      ${f.comment ? `<div>${escapeHtml(f.comment)}</div>` : ""}
      ${period ? `<div>${escapeHtml(period)}</div>` : ""}
    </div>

    <table>
      <tbody>
        <tr><th style="width:42%;">${escapeHtml(state.lang === "de" ? "Saldo" : "Balance")}</th><td style="text-align:right; font-weight:900;">${escapeHtml(formatEUR(balance))}</td></tr>
        ${state.targetCents > 0 ? `<tr><th>${escapeHtml(state.lang === "de" ? "Ziel" : "Target")}</th><td style="text-align:right;">${escapeHtml(formatEUR(state.targetCents))}</td></tr>` : ""}
        ${state.targetCents > 0 ? `<tr><th>${escapeHtml(state.lang === "de" ? "Fehlt noch" : "Due")}</th><td style="text-align:right; font-weight:900;">${escapeHtml(formatEUR(due))}</td></tr>` : ""}
        <tr><th>${escapeHtml(state.lang === "de" ? "Einzahlungen" : "Contributions")}</th><td style="text-align:right;">${escapeHtml(formatEUR(deposits))}</td></tr>
        <tr><th>${escapeHtml(state.lang === "de" ? "Ausgaben (Anteile)" : "Expenses (shares)")}</th><td style="text-align:right;">${escapeHtml(formatEUR(expenses))}</td></tr>
      </tbody>
    </table>

    <h3 style="margin:14px 0 8px;">${escapeHtml(state.lang === "de" ? "Buchungen" : "Transactions")}</h3>
    <table>
      <thead>
        <tr>
          <th style="width:110px;">${escapeHtml(state.lang === "de" ? "Datum" : "Date")}</th>
          <th>${escapeHtml(state.lang === "de" ? "Typ" : "Type")}</th>
          <th style="text-align:right;">${escapeHtml(state.lang === "de" ? "Betrag" : "Amount")}</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="3" class="muted">${escapeHtml(dict().labels.reportNoTx)}</td></tr>`}
      </tbody>
    </table>
  `;

  els.reportDialog.showModal();
}

function closeFamilyReport() {
  if (els.reportDialog?.open) els.reportDialog.close();
  currentReportFamilyId = null;
}

/** =========================================================
    EXPENSE SELECTION MODES
    ========================================================= */
let expenseSelection = new Set();
let lastExpenseDateISO = null;

function currentExpenseDateISO() {
  return (els.expenseDate?.value || "").trim() || todayISO();
}

function eligibleFamiliesForExpenseDate(dateISO) {
  return state.families
    .filter((f) => familyEligibleForDate(f, dateISO))
    .slice()
    .sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));
}

function setExpenseMode(mode) {
  state.expenseSelectMode = mode === "custom" ? "custom" : "all";
  saveState();

  lastExpenseDateISO = null;
  expenseSelection.clear();
  renderExpenseChecklist();
}

function ensureExpenseSelection(dateISO) {
  const eligible = eligibleFamiliesForExpenseDate(dateISO);
  const eligibleIds = new Set(eligible.map((f) => f.id));

  if (lastExpenseDateISO !== dateISO) {
    if (state.expenseSelectMode === "all") {
      expenseSelection = new Set(eligible.map((f) => f.id));
    } else {
      expenseSelection = new Set();
    }
    lastExpenseDateISO = dateISO;
    return;
  }

  expenseSelection.forEach((id) => {
    if (!eligibleIds.has(id)) expenseSelection.delete(id);
  });

  if (state.expenseSelectMode === "all") {
    eligibleIds.forEach((id) => expenseSelection.add(id));
  }
}

function renderCategoryOverview() {
  if (!els.categoryOverview) return;

  const unc = uncategorizedLabel();
  const map = new Map(); // cat -> {inCents, outCents}

  function bump(cat, key, cents) {
    const c = normalizeCategory(cat);
    if (!map.has(c)) map.set(c, { inCents: 0, outCents: 0 });
    map.get(c)[key] += cents;
  }

  // deposits (income)
  for (const t of state.tx) {
    if (t.type !== "deposit") continue;
    bump(t.category || unc, "inCents", Math.max(0, t.centsSigned || 0));
  }

  // expenses (outgoing) -> use expense objects (totalCents)
  for (const e of state.expenses) {
    bump(e.category || unc, "outCents", Math.max(0, e.totalCents || 0));
  }

  const rows = Array.from(map.entries())
    .map(([cat, v]) => ({ cat, ...v, net: v.inCents - v.outCents }))
    .sort((a, b) => (b.outCents - a.outCents) || a.cat.localeCompare(b.cat));

  if (rows.length === 0) {
    els.categoryOverview.innerHTML = `<div class="muted">${escapeHtml(dict().labels.reportNoTx || "No transactions.")}</div>`;
    return;
  }

  const htmlRows = rows.map(r => {
    const netCls = r.net < 0 ? "neg" : r.net > 0 ? "pos" : "";
    return `
      <tr>
        <td>${escapeHtml(r.cat)}</td>
        <td style="text-align:right;">${escapeHtml(formatEUR(r.inCents))}</td>
        <td style="text-align:right;">${escapeHtml(formatEUR(r.outCents))}</td>
        <td class="${netCls}" style="text-align:right; font-weight:900;">${escapeHtml(formatEUR(r.net))}</td>
      </tr>
    `;
  }).join("");

  els.categoryOverview.innerHTML = `
    <table class="catTable">
      <thead>
        <tr>
          <th>${escapeHtml(state.lang === "de" ? "Kategorie" : "Category")}</th>
          <th style="text-align:right;">${escapeHtml(state.lang === "de" ? "Ein" : "In")}</th>
          <th style="text-align:right;">${escapeHtml(state.lang === "de" ? "Aus" : "Out")}</th>
          <th style="text-align:right;">${escapeHtml(state.lang === "de" ? "Saldo" : "Net")}</th>
        </tr>
      </thead>
      <tbody>${htmlRows}</tbody>
    </table>
  `;
}

function renderExpenseChecklist() {
  if (!els.expenseFamilyChecklist) return;
  const d = dict();
  const dateISO = currentExpenseDateISO();

  ensureExpenseSelection(dateISO);
  const fams = eligibleFamiliesForExpenseDate(dateISO);

  if (els.expenseAllHint) {
    els.expenseAllHint.hidden = fams.length === 0;
    els.expenseAllHint.textContent =
      state.expenseSelectMode === "all" ? d.ui.allPreselectedHint : d.ui.customSelectHint;
  }

  els.expenseFamilyChecklist.innerHTML = "";

  if (fams.length === 0) {
    const div = document.createElement("div");
    div.className = "muted";
    div.textContent = d.ui.noEligibleFamilies;
    els.expenseFamilyChecklist.appendChild(div);
    return;
  }

  for (const f of fams) {
    const row = document.createElement("label");
    row.className = "checkItem";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = expenseSelection.has(f.id);
    cb.addEventListener("change", () => {
      if (cb.checked) expenseSelection.add(f.id);
      else expenseSelection.delete(f.id);
    });

    const main = document.createElement("div");
    main.className = "checkItem__main";

    const t = document.createElement("div");
    t.className = "checkItem__title";
    t.textContent = familyDisplayName(f);

    const s = document.createElement("div");
    s.className = "checkItem__sub";
    const bits = [];
    if (f.comment) bits.push(f.comment);
    const from = f.activeFromISO ? f.activeFromISO : "";
    const to = f.activeToISO ? f.activeToISO : "";
    if (from || to) bits.push(`${from || "…"} → ${to || "…"} `);
    s.textContent = bits.join(" · ");

    main.appendChild(t);
    if (s.textContent) main.appendChild(s);

    row.appendChild(cb);
    row.appendChild(main);

    els.expenseFamilyChecklist.appendChild(row);
  }

  if (els.expenseModeAll) els.expenseModeAll.checked = state.expenseSelectMode === "all";
  if (els.expenseModeCustom) els.expenseModeCustom.checked = state.expenseSelectMode === "custom";
}

/** ---------- Pickers filtered by date ---------- **/
function renderDepositFamilyPicker() {
  if (!els.depositFamily) return;

  const dateISO = (els.depositDate?.value || "").trim() || todayISO();

  const fams = state.families
    .filter((f) => familyEligibleForDate(f, dateISO))
    .slice()
    .sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));

  els.depositFamily.innerHTML = "";
  for (const f of fams) {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = familyDisplayName(f);
    els.depositFamily.appendChild(opt);
  }
}

/** ---------- Summary render ---------- **/
function renderSummary() {
  const bank = calcBankTotals();                 // deposits - expenses
  const { total, orphanTxCount, orphanCentsTotal } = calcBalances(); // sum(tx)

  // show BANK truth as main number
  if (els.totalBalance) {
    els.totalBalance.textContent = formatEUR(bank.balance);
    els.totalBalance.style.color =
      bank.balance < 0 ? "var(--neg)" :
      bank.balance > 0 ? "var(--pos)" :
      "var(--text)";
  }

  if (els.familiesCount) els.familiesCount.textContent = String(state.families.length);
  if (els.txCount) els.txCount.textContent = String(state.tx.length);

  // Tooltip diagnostics
  if (els.totalBalance) {
    const hints = [];

    // orphan warning (transactions referencing missing families)
    if (orphanTxCount > 0) {
      hints.push(
        state.lang === "de"
          ? `Hinweis: ${orphanTxCount} Buchung(en) referenzieren keine vorhandene Familie (Summe: ${formatEUR(orphanCentsTotal)}).`
          : `Note: ${orphanTxCount} transaction(s) reference a missing family (sum: ${formatEUR(orphanCentsTotal)}).`
      );
    }

    // consistency check: bank.balance should equal total tx sum
    const diff = bank.balance - total;
    if (diff !== 0) {
      hints.push(
        state.lang === "de"
          ? `⚠️ Abweichung: Bank-Saldo (${formatEUR(bank.balance)}) ≠ TX-Summe (${formatEUR(total)}). Diff: ${formatEUR(diff)}.`
          : `⚠️ Mismatch: Bank balance (${formatEUR(bank.balance)}) ≠ TX sum (${formatEUR(total)}). Diff: ${formatEUR(diff)}.`
      );
    }

    els.totalBalance.title = hints.join("\n");
  }
}

function renderBankSummary() {
  const bank = calcBankTotals();

  document.getElementById("bankDeposits").textContent = formatEUR(bank.deposits);
  document.getElementById("bankExpenses").textContent = formatEUR(bank.expenses);
  document.getElementById("bankBalance").textContent = formatEUR(bank.balance);
}

/** ---------- Families list (minimal) ---------- **/
function renderFamilies() {
  if (!els.familiesList) return;
  const { byFamily } = calcBalances();

  const fams = state.families.slice().sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));
  els.familiesList.innerHTML = "";

  if (fams.length === 0) {
    const div = document.createElement("div");
    div.className = "muted";
    div.textContent = dict().ui.noEligibleFamilies;
    els.familiesList.appendChild(div);
    return;
  }

  for (const f of fams) {
    const bal = byFamily.get(f.id) || 0;

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
    const bits = [];
    const kids = childrenText(f);
    const parents = parentsText(f);
    if (kids) bits.push((state.lang === "de" ? "Kinder: " : "Children: ") + kids);
    if (parents && parents !== "—") bits.push((state.lang === "de" ? "Eltern: " : "Parents: ") + parents);
    if (f.email) bits.push(f.email);
    if (f.comment) bits.push(f.comment);
    if (f.activeFromISO || f.activeToISO) bits.push(`${f.activeFromISO || "…"} → ${f.activeToISO || "…"} `);
    if (!f.active) bits.push(state.lang === "de" ? "inaktiv" : "inactive");
    small.textContent = bits.join(" · ");

    meta.appendChild(name);
    meta.appendChild(small);

    // NEW: click on family -> open report popup
    meta.style.cursor = "pointer";
    meta.addEventListener("click", () => openFamilyReport(f.id));

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
    toggle.textContent = f.active
      ? state.lang === "de"
        ? "Inaktiv"
        : "Deactivate"
      : state.lang === "de"
      ? "Aktiv"
      : "Activate";
    toggle.addEventListener("click", () => {
      f.active = !f.active;
      saveState();
      lastExpenseDateISO = null;
      renderAll();
    });

    const edit = document.createElement("button");
    edit.className = "btn";
    edit.type = "button";
    edit.textContent = state.lang === "de" ? "Bearbeiten" : "Edit";
    edit.addEventListener("click", () => editFamilyPrompt(f.id));

    const del = document.createElement("button");
    del.className = "btn btn--danger";
    del.type = "button";
    del.textContent = state.lang === "de" ? "Löschen" : "Delete";
    del.addEventListener("click", () => deleteFamilyIfPossible(f.id));

    actions.appendChild(toggle);
    actions.appendChild(edit);
    actions.appendChild(del);

    card.appendChild(top);
    card.appendChild(actions);

    els.familiesList.appendChild(card);
  }
}

/** ---------- Ledger (minimal) ---------- **/
function renderLedger() {
  if (!els.ledger) return;
  const d = dict();

  const items = [];
  for (const t of state.tx) {
    if (t.type === "deposit") items.push({ kind: "deposit", dateISO: t.dateISO, createdAt: t.createdAt, tx: t });
  }
  for (const e of state.expenses) {
    items.push({ kind: "expense", dateISO: e.dateISO, createdAt: e.createdAt, expense: e });
  }
  items.sort((a, b) => b.dateISO.localeCompare(a.dateISO) || (b.createdAt || 0) - (a.createdAt || 0));

  els.ledger.innerHTML = "";
  if (els.emptyState) els.emptyState.hidden = items.length !== 0;

  for (const it of items) {
    const row = document.createElement("div");
    row.className = "txRow";

    const left = document.createElement("div");

    const title = document.createElement("div");
    title.className = "txTitle";

    const meta = document.createElement("div");
    meta.className = "txMeta";

    const actions = document.createElement("div");
    actions.className = "txActions";

    if (it.kind === "deposit") {
      const t = it.tx;
      const f = familyById(t.familyId);

      title.innerHTML = `
        ${escapeHtml(d.labels.deposit)}: ${escapeHtml(formatEUR(t.centsSigned))}
        · ${escapeHtml(familyDisplayName(f || {}))}
        ${categoryBadge(t.category)}
      `;

      const noteStr = (typeof t.note === "string" ? t.note : "").trim();
      meta.textContent = `${d.labels.date}: ${t.dateISO}${noteStr ? " · " + d.labels.note + ": " + noteStr : ""}`;

      const editBtn = document.createElement("button");
      editBtn.className = "btn";
      editBtn.type = "button";
      editBtn.textContent = state.lang === "de" ? "Bearbeiten" : "Edit";
      editBtn.addEventListener("click", () => editDepositPrompt(t.id));

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn--danger";
      delBtn.type = "button";
      delBtn.textContent = state.lang === "de" ? "Löschen" : "Delete";
      delBtn.addEventListener("click", () => deleteDeposit(t.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
    } else {
      const e = it.expense;
      const famCount = (e.participantIds || []).length;

      title.innerHTML = `
        ${escapeHtml(d.labels.expense)}: ${escapeHtml(formatEUR(-e.totalCents))}
        · ${escapeHtml(e.title || d.defaults.expenseTitle)}
        ${categoryBadge(e.category)}
      `;

      meta.textContent = `${d.labels.date}: ${e.dateISO} · ${state.lang === "de" ? "geteilt auf" : "split across"} ${famCount} ${
        state.lang === "de" ? "Familien" : "families"
      }`;

      const editBtn = document.createElement("button");
      editBtn.className = "btn";
      editBtn.type = "button";
      editBtn.textContent = state.lang === "de" ? "Bearbeiten" : "Edit";
      editBtn.addEventListener("click", () => editExpensePrompt(e.id));

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn--danger";
      delBtn.type = "button";
      delBtn.textContent = state.lang === "de" ? "Löschen" : "Delete";
      delBtn.addEventListener("click", () => deleteExpense(e.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
    }

    left.appendChild(title);
    left.appendChild(meta);

    row.appendChild(left);
    row.appendChild(actions);

    els.ledger.appendChild(row);
  }
}

/** ---------- Settings (target) ---------- **/
function renderTargetInput() {
  if (!els.targetAmount) return;
  els.targetAmount.value = state.targetCents ? String((state.targetCents / 100).toFixed(2)) : "";
}
function updateTargetFromInput() {
  const c = centsFromInput(els.targetAmount.value);
  state.targetCents = c === null ? 0 : c;
  saveState();
  renderAll();
}

/** ---------- Family Edit / Delete ---------- **/
function editFamilyPrompt(familyId) {
  const f = familyById(familyId);
  if (!f) return;
  const d = dict();

  const kids = prompt(state.lang === "de" ? "Kinder (Komma-getrennt)" : "Children (comma-separated)", (f.children || []).join(", "));
  if (kids === null) return;

  const p1 = prompt(state.lang === "de" ? "Elternteil 1" : "Parent 1", f.parent1 || "");
  if (p1 === null) return;

  const p2 = prompt(state.lang === "de" ? "Elternteil 2 (optional)" : "Parent 2 (optional)", f.parent2 || "");
  if (p2 === null) return;

  const em = prompt(state.lang === "de" ? "E-Mail (optional)" : "Email (optional)", f.email || "");
  if (em === null) return;
  if (em && !isValidEmail(em)) {
    alert(d.errors.emailInvalid);
    return;
  }

  const from = prompt(state.lang === "de" ? "In Klasse ab (YYYY-MM-DD, optional)" : "In class from (YYYY-MM-DD, optional)", f.activeFromISO || "");
  if (from === null) return;

  const to = prompt(state.lang === "de" ? "In Klasse bis (YYYY-MM-DD, optional)" : "In class until (YYYY-MM-DD, optional)", f.activeToISO || "");
  if (to === null) return;

  const newFromRaw = String(from).trim();
  const newToRaw = String(to).trim();

  if (newFromRaw && !isISODate(newFromRaw)) {
    alert(state.lang === "de"
      ? "Ungültiges Datum bei Aktiv-ab. Bitte YYYY-MM-DD (z. B. 2025-09-01)."
      : "Invalid date in Active from. Use YYYY-MM-DD (e.g. 2025-09-01).");
    return;
  }
  if (newToRaw && !isISODate(newToRaw)) {
    alert(state.lang === "de"
      ? "Ungültiges Datum bei Aktiv-bis. Bitte YYYY-MM-DD (z. B. 2025-09-01)."
      : "Invalid date in Active until. Use YYYY-MM-DD (e.g. 2025-09-01).");
    return;
  }
  if (newFromRaw && newToRaw && newToRaw < newFromRaw) {
    alert(state.lang === "de" ? "Aktiv-bis muss nach Aktiv-ab liegen." : "Active until must be after active from.");
    return;
  }
  f.activeFromISO = newFromRaw ? newFromRaw : null;
  f.activeToISO = newToRaw ? newToRaw : null;

  const note = prompt(state.lang === "de" ? "Kommentar (optional)" : "Comment (optional)", f.comment || "");
  if (note === null) return;

  const newChildren = parseChildrenInput(kids);
  const newP1 = String(p1).trim().slice(0, 60);
  const newP2 = String(p2).trim().slice(0, 60);

  if (newChildren.length === 0 && !newP1 && !newP2) {
    alert(d.errors.familyNameRequired);
    return;
  }

  f.children = newChildren;
  f.parent1 = newP1;
  f.parent2 = newP2;
  f.email = String(em).trim().slice(0, 120);
  f.comment = String(note).trim().slice(0, 160);

  saveState();
  lastExpenseDateISO = null;
  expenseSelection.clear();

  renderAll();
}

function deleteFamilyIfPossible(familyId) {
  const hasTx = state.tx.some((t) => t.familyId === familyId);
  const isInExpense = state.expenses.some((e) => (e.participantIds || []).includes(familyId));

  if (hasTx || isInExpense) {
    const ok = confirm(
      state.lang === "de"
        ? "Diese Familie hat bereits Buchungen. Statt Löschen wird sie jetzt deaktiviert. OK?"
        : "This family has transactions. Instead of deleting, it will be deactivated. OK?"
    );
    if (!ok) return;

    const f = familyById(familyId);
    if (f) f.active = false;

    saveState();
    lastExpenseDateISO = null;
    expenseSelection.clear();
    renderAll();
    return;
  }

  const ok = confirm(state.lang === "de" ? "Familie wirklich löschen?" : "Delete this family?");
  if (!ok) return;

  state.families = state.families.filter((f) => f.id !== familyId);

  saveState();
  lastExpenseDateISO = null;
  expenseSelection.clear();
  renderAll();
}

/** ---------- Add Family (form) ---------- **/
function addFamilyFromForm() {
  const d = dict();

  const p1 = String(els.parent1?.value || "").trim().slice(0, 60);
  const p2 = String(els.parent2?.value || "").trim().slice(0, 60);
  const email = String(els.email?.value || "").trim().slice(0, 120);
  const children = parseChildrenInput(els.children?.value || "");
  const comment = String(els.familyNote?.value || "").trim().slice(0, 160);

  let from = "";
  let to = "";
  try {
    from = assertISODateOrEmpty(els.activeFrom?.value, state.lang === "de" ? "Aktiv ab" : "Active from");
    to = assertISODateOrEmpty(els.activeTo?.value, state.lang === "de" ? "Aktiv bis" : "Active until");
  } catch (fieldLabel) {
    alert(
      (state.lang === "de"
        ? `Ungültiges Datumsformat bei "${fieldLabel}". Bitte im Format YYYY-MM-DD eingeben (z. B. 2025-09-01).`
        : `Invalid date format in "${fieldLabel}". Please use YYYY-MM-DD (e.g. 2025-09-01).`)
    );
    return;
  }

  if (email && !isValidEmail(email)) {
    alert(d.errors.emailInvalid);
    return;
  }
  if (children.length === 0 && !p1 && !p2) {
    alert(d.errors.familyNameRequired);
    return;
  }
  if (from && to && to < from) {
    alert(state.lang === "de" ? "Aktiv-bis muss nach Aktiv-ab liegen." : "Active until must be after active from.");
    return;
  }

  const fam = {
    id: uid(),
    parent1: p1,
    parent2: p2,
    email,
    children,
    active: true,
    createdAt: Date.now(),
    comment,
    activeFromISO: from ? from : null,
    activeToISO: to ? to : null,
  };

  state.families.push(fam);

  if (els.parent1) els.parent1.value = "";
  if (els.parent2) els.parent2.value = "";
  if (els.email) els.email.value = "";
  if (els.children) els.children.value = "";
  if (els.familyNote) els.familyNote.value = "";
  if (els.activeFrom) els.activeFrom.value = "";
  if (els.activeTo) els.activeTo.value = "";

  if (els.familyFormDetails) els.familyFormDetails.open = false;

  saveState();
  lastExpenseDateISO = null;
  expenseSelection.clear();

  renderAll();
}

/** ---------- Deposits ---------- **/
function addDeposit() {
  const d = dict();

  const dateISO = (els.depositDate?.value || "").trim() || todayISO();
  const familyId = String(els.depositFamily?.value || "");
  if (!familyId) return alert(d.errors.familyMissing);

  const f = familyById(familyId);
  if (!f || !familyEligibleForDate(f, dateISO)) {
    return alert(state.lang === "de" ? "Familie ist für dieses Datum nicht aktiv." : "Family is not active for this date.");
  }

  const cents = centsFromPositiveInput(els.depositAmount?.value);
  if (!cents) return alert(d.errors.amountInvalid);

  const note = String(els.depositNote?.value || "").trim().slice(0, 120);
  const category = ensureCategoryExists(els.depositCategory?.value);

  if (isDuplicateDeposit(dateISO, cents, note)) {
    const ok = confirm(
      state.lang === "de"
        ? "Diese Einzahlung sieht identisch zu einer bestehenden aus. Trotzdem speichern?"
        : "This deposit looks identical to an existing one. Save anyway?"
    );
    if (!ok) return;
  }

  state.tx.push({
    id: uid(),
    type: "deposit",
    familyId,
    centsSigned: cents,
    dateISO,
    note,
    category,
    createdAt: Date.now(),
    expenseId: null,
  });

  if (els.depositAmount) els.depositAmount.value = "";
  if (els.depositNote) els.depositNote.value = "";

  saveState();
  renderAll();
}

/** ---------- Expenses ---------- **/
function addExpenseSplit() {
  const d = dict();

  const dateISO = currentExpenseDateISO();
  const title = String(els.expenseTitle?.value || "").trim().slice(0, 80) || d.defaults.expenseTitle;
  const category = ensureCategoryExists(els.expenseCategory?.value);
  const totalCents = centsFromPositiveInput(els.expenseAmount?.value);
  if (!totalCents) return alert(d.errors.amountInvalid);

  const eligibleIds = new Set(eligibleFamiliesForExpenseDate(dateISO).map((f) => f.id));
  const participantIds = Array.from(expenseSelection).filter((id) => eligibleIds.has(id));

  if (participantIds.length === 0) return alert(d.errors.noParticipants);

  const perMap = splitCents(totalCents, participantIds);
  const expenseId = uid();

  state.expenses.push({
    id: expenseId,
    title,
    totalCents,
    dateISO,
    category,
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

  lastExpenseDateISO = null;
  expenseSelection.clear();

  if (els.expenseTitle) els.expenseTitle.value = "";
  if (els.expenseAmount) els.expenseAmount.value = "";

  saveState();
  renderAll();
}

function editDepositPrompt(txId) {
  const d = dict();
  const t = state.tx.find((x) => x.id === txId);
  if (!t || t.type !== "deposit") return;

  const dateISO = prompt(d.labels.date, t.dateISO || todayISO());
  if (dateISO === null) return;
  if (!isISODate(String(dateISO).trim())) {
    alert(state.lang === "de" ? "Ungültiges Datum." : "Invalid date.");
    return;
  }
  const date = String(dateISO).trim();

  const f = familyById(t.familyId);
  const famName = familyDisplayName(f || {});
  const familyOk = confirm(
    (state.lang === "de"
      ? `Familie beibehalten? (${famName})\n(OK = ja, Abbrechen = Auswahl per Dropdown in UI nicht möglich)`
      : `Keep family? (${famName})\n(OK = yes, Cancel = no)`)
  );
  if (!familyOk) return;

  if (f && !familyEligibleForDate(f, date)) {
    const ok = confirm(
      state.lang === "de"
        ? "Achtung: Familie ist für dieses Datum nicht aktiv. Trotzdem speichern?"
        : "Warning: Family is not active for this date. Save anyway?"
    );
    if (!ok) return;
  }

  const amtStr = prompt(state.lang === "de" ? "Betrag (€)" : "Amount (€)", String((t.centsSigned / 100).toFixed(2)));
  if (amtStr === null) return;
  const cents = centsFromPositiveInput(amtStr);
  if (!cents) return alert(d.errors.amountInvalid);

  const currentNote = typeof t.note === "string" ? t.note : "";
  const note = prompt(d.labels.note, currentNote);
  if (note === null) return;
  const trimmedNote = String(note).trim();
  if (trimmedNote !== currentNote) {
    t.note = trimmedNote.slice(0, 120);
  }

  const cat = prompt(state.lang === "de" ? "Kategorie" : "Category", t.category || uncategorizedLabel());
  if (cat === null) return;
  t.category = ensureCategoryExists(cat);

  t.dateISO = date;
  t.centsSigned = cents;

  saveState();
  renderAll();
}

function deleteDeposit(txId) {
  const t = state.tx.find((x) => x.id === txId);
  if (!t || t.type !== "deposit") return;

  const ok = confirm(state.lang === "de" ? "Einzahlung wirklich löschen?" : "Delete this contribution?");
  if (!ok) return;

  state.tx = state.tx.filter((x) => x.id !== txId);
  saveState();
  renderAll();
}

function editExpensePrompt(expenseId) {
  const d = dict();
  const e = state.expenses.find((x) => x.id === expenseId);
  if (!e) return;

  const newDateISO = prompt(d.labels.date, e.dateISO || todayISO());
  if (newDateISO === null) return;
  if (!isISODate(String(newDateISO).trim())) {
    alert(state.lang === "de" ? "Ungültiges Datum." : "Invalid date.");
    return;
  }
  const dateISO = String(newDateISO).trim();

  const newTitleRaw = prompt(state.lang === "de" ? "Titel" : "Title", e.title || d.defaults.expenseTitle);
  if (newTitleRaw === null) return;
  const title = String(newTitleRaw).trim().slice(0, 80) || d.defaults.expenseTitle;

  const cat = prompt(state.lang === "de" ? "Kategorie" : "Category", e.category || uncategorizedLabel());
  if (cat === null) return;
  const category = ensureCategoryExists(cat);

  const amtStr = prompt(state.lang === "de" ? "Gesamtbetrag (€)" : "Total amount (€)", String((e.totalCents / 100).toFixed(2)));
  if (amtStr === null) return;
  const totalCents = centsFromPositiveInput(amtStr);
  if (!totalCents) return alert(d.errors.amountInvalid);

  // Participants bleiben wie sie sind, aber bei neuem Datum filtern wir un-eligible raus (mit Warnung).
  const oldIds = Array.isArray(e.participantIds) ? e.participantIds.slice() : [];
  const eligibleSet = new Set(eligibleFamiliesForExpenseDate(dateISO).map((f) => f.id));
  const newParticipantIds = oldIds.filter((id) => eligibleSet.has(id));

  if (newParticipantIds.length === 0) {
    alert(state.lang === "de"
      ? "Für dieses Datum ist keine der bisherigen Familien aktiv. Bitte Datum ändern oder Ausgabe neu erfassen."
      : "None of the previous families are eligible for this date. Change date or re-create the expense.");
    return;
  }
  if (newParticipantIds.length !== oldIds.length) {
    alert(state.lang === "de"
      ? "Hinweis: Einige Familien sind für das neue Datum nicht aktiv und wurden automatisch entfernt."
      : "Note: Some families are not eligible for the new date and were removed.");
  }

  const ok = rebuildExpenseAllocations(expenseId, title, totalCents, dateISO, newParticipantIds);
  if (!ok) return;
  e.category = category;

  saveState();
  renderAll();
}

function deleteExpense(expenseId) {
  const e = state.expenses.find((x) => x.id === expenseId);
  if (!e) return;

  const ok = confirm(state.lang === "de" ? "Ausgabe wirklich löschen?" : "Delete this expense?");
  if (!ok) return;

  // remove expense
  state.expenses = state.expenses.filter((x) => x.id !== expenseId);
  // remove allocations linked to it
  state.tx = state.tx.filter((t) => !(t.type === "allocation" && t.expenseId === expenseId));

  saveState();
  renderAll();
}

/** ---------- Export / Import / Reset ---------- **/
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

      const cleaned = { ...parsed };
      delete cleaned.exportedAt;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));

      state = loadState();
      lastExpenseDateISO = null;
      expenseSelection.clear();
      renderAll();

    } catch {
      alert(d.errors.importFailed);
    } finally {
      if (els.importInput) els.importInput.value = "";
    }
  };
  reader.readAsText(file);
}

function resetAll() {
  const d = dict();
  const ok = confirm(d.errors.confirmReset);
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  saveState();

  lastExpenseDateISO = null;
  expenseSelection.clear();

  renderAll();
}

/** ---------- Render all ---------- **/
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
}
function applyLang() {
  document.documentElement.lang = state.lang;
}

function applyLangVisibility() {
  const lang = normalizeLang(state.lang);
  document.querySelectorAll("[data-lang]").forEach((el) => {
    el.hidden = el.getAttribute("data-lang") !== lang;
  });
}

function t(key) {
  const d = dict();
  return (d.text && d.text[key]) || key;
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });
}

function renderAll() {
  applyLang();
  applyI18n();
  updateSeoLinkForLang(state.lang); // language-aware explainer link (if #seoLink exists)
  applyLangVisibility(); // controls SEO+FAQ blocks
  applyTheme();

  if (els.lang) els.lang.value = state.lang;
  if (els.theme) els.theme.value = state.theme;

  if (els.depositDate && !els.depositDate.value) els.depositDate.value = todayISO();
  if (els.expenseDate && !els.expenseDate.value) els.expenseDate.value = todayISO();

  renderTargetInput();
  renderDepositFamilyPicker();
  renderCategoryPickers();
  renderExpenseChecklist();

  renderSummary();
  renderBankSummary();
  renderFamilies();
  renderLedger();
  renderCategoryOverview();

  warnIfDuplicatesOnce();
}

/** ---------- Bindings ---------- **/
if (els.lang) {
  els.lang.addEventListener("change", () => {
    setLang(els.lang.value);
  });
}
if (els.theme) {
  els.theme.addEventListener("change", () => {
    state.theme = els.theme.value;
    saveState();
    renderAll();
  });
}

if (els.targetAmount) {
  els.targetAmount.addEventListener("change", updateTargetFromInput);
  els.targetAmount.addEventListener("keydown", (e) => {
    if (e.key === "Enter") updateTargetFromInput();
  });
}

if (els.depositDate) {
  els.depositDate.addEventListener("change", () => renderDepositFamilyPicker());
}
if (els.addDepositBtn) {
  els.addDepositBtn.addEventListener("click", addDeposit);
}
if (els.depositAmount) {
  els.depositAmount.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addDeposit();
  });
}

if (els.expenseDate) {
  els.expenseDate.addEventListener("change", () => {
    lastExpenseDateISO = null;
    expenseSelection.clear();
    renderExpenseChecklist();
  });
}
if (els.addExpenseBtn) {
  els.addExpenseBtn.addEventListener("click", addExpenseSplit);
}
if (els.expenseAmount) {
  els.expenseAmount.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addExpenseSplit();
  });
}

/** Add Family wiring (FIX) */
if (els.addFamilyBtn) {
  els.addFamilyBtn.addEventListener("click", addFamilyFromForm);
}
if (els.parent1) {
  els.parent1.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addFamilyFromForm();
  });
}
if (els.children) {
  els.children.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addFamilyFromForm();
  });
}

if (els.downloadBankCsvBtn) {
  els.downloadBankCsvBtn.addEventListener("click", downloadBankCsv);
}

/** mode toggles */
if (els.expenseModeAll) {
  els.expenseModeAll.addEventListener("change", () => {
    if (els.expenseModeAll.checked) setExpenseMode("all");
  });
}
if (els.expenseModeCustom) {
  els.expenseModeCustom.addEventListener("change", () => {
    if (els.expenseModeCustom.checked) setExpenseMode("custom");
  });
}

/** report dialog wiring */
if (els.closeReport) els.closeReport.addEventListener("click", closeFamilyReport);

if (els.reportDialog) {
  // click on backdrop closes (safe + simple)
  els.reportDialog.addEventListener("click", (e) => {
    if (e.target === els.reportDialog) closeFamilyReport();
  });
}

if (els.copyReport) {
  els.copyReport.addEventListener("click", async () => {
    if (!currentReportFamilyId) return;
    const txt = reportTextForCopy(currentReportFamilyId);
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  });
}

if (els.printReport) {
  els.printReport.addEventListener("click", () => {
    if (!els.reportContent) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Family Report</title>
          <style>
            body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; }
            table{ width:100%; border-collapse: collapse; font-size: 13px; margin: 10px 0 18px; }
            th, td{ padding: 8px 6px; border-bottom: 1px solid #ddd; vertical-align: top; }
            th{ text-align:left; color:#444; }
            .neg{ color:#b91c1c; }
            .pos{ color:#166534; }
          </style>
        </head>
        <body>
          ${els.reportContent.innerHTML}
          <script>window.print();<\/script>
        </body>
      </html>
    `);
    w.document.close();
  });
}

if (els.importInput) {
  els.importInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importJsonFile(file);
  });
}
if (els.resetBtn) els.resetBtn.addEventListener("click", resetAll);
if (els.exportBtn) {
  els.exportBtn.addEventListener("click", openExportDialog);
}


// Export Entries Data
function openExportDialog() {
  if (!els.exportDialog || !els.exportText) return;

  const payload = { ...state, exportedAt: new Date().toISOString() };
  els.exportText.value = JSON.stringify(payload, null, 2);
  els.exportDialog.showModal();
}

if (els.copyExport) {
  els.copyExport.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(els.exportText.value);
    } catch {
      els.exportText.focus();
      els.exportText.select();
      document.execCommand("copy");
    }
  });
}

if (els.downloadExport) {
  els.downloadExport.addEventListener("click", (e) => {
    e.preventDefault(); // wichtig, falls Button in <form>
    const d = dict();
    const json = String(els.exportText?.value || "");
    if (!json.trim()) return alert(state.lang === "de" ? "Export ist leer – bitte erst Export öffnen." : "Export is empty – open export first.");

    const filename = (d?.ui?.exportFilename || "klassenkasse-export.json");
    downloadTextFile(filename, json, "application/json;charset=utf-8");
  });
}

if (els.closeExport) {
  els.closeExport.addEventListener("click", () => {
    els.exportDialog.close();
  });
}

// Export Transaction history
function csvEscape(value) {
  const s = String(value ?? "");
  return `"${s.replaceAll('"', '""')}"`;
}

function toCsv(rows, headers, separator = ";") {
  const head = headers.map(csvEscape).join(separator);
  const body = rows.map(r => r.map(csvEscape).join(separator)).join("\n");
  // UTF-8 BOM helps Excel (DE) to read umlauts correctly
  return "\ufeff" + head + "\n" + body + "\n";
}

function eurNumber(cents) {
  // for CSV: numeric string without currency symbol; DE uses comma, but Excel usually handles either.
  return ((cents || 0) / 100).toFixed(2);
}

/** ---------- init ---------- **/
(function initLangFromUrl(){
  const urlLang = new URLSearchParams(location.search).get("lang");
  if (urlLang) state.lang = normalizeLang(urlLang);
})();

renderAll();
