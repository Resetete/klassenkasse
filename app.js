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
   ✓ Family overview popup (reportDialog)
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
      familiesCountLabel: "Aktive Familien",
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

      schoolYearTitle: "Schuljahr",
      schoolYearFromLabel: "Schuljahr von",
      schoolYearToLabel: "Schuljahr bis",
      schoolYearHint: "Kategorien-Summen werden nur für diesen Zeitraum berechnet.",

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
      familySelectionRadioTitle: "Auswahl",
      selectAllFamilies: "Alle Familien auswählen",
      selectFamilies: "Nur ausgewählte Familien",
      familyRareHint: "Nutze dies, wenn eine neue Familie dazu kommt",
      parent1Label: "Elternteil 1",
      phParent1: "Name",
      parent2Label: "Elternteil 2 (optional)",
      phParent2: "Name",
      emailLabel: "E-Mail Elternteil 1",
      emailLabel2: "E-Mail Elternteil 2",
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
      showActiveFamilies: "Aktive Familien",
      showInactiveFamilies: 'Inaktive Familien',
      ledgerTitle: "Buchungsverlauf",
      ledgerHistoryHint: "Liste aller Ein- und Ausgaben",
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
      emailPlaceholdersHint: "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{email2}}, {{today}}",
      openMailBtn: "Mail-App öffnen",
      emailPreviewLabel: "Vorschau",

      reminderTitle: "Erinnerungen (Batch)",
      reminderModeLabel: "Kriterium",
      reminderBelowTarget: "Unter Ziel",
      reminderNegativeOnly: "Nur negativ",
      reminderActiveOnly: "Nur aktive Familien",
      reminderHint: "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{email2}}, {{today}}",
      copyAllBtn: "Alle kopieren",
      openNextBtn: "Nächste Mail öffnen",
      reminderListLabel: "Empfänger:innen",

      reportTitle: "Übersicht",
      printBtn: "Drucken / PDF",

      appHeaderSubpage: "Warum Klassenkassen schnell unübersichtlich werden",
      appSubpageExplanation: "Bargeld, WhatsApp-Nachrichten und Tabellen werden schnell chaotisch. Man verliert den Überblick, wer schon gezahlt hat und wofür das Geld ausgegeben wurde. ClassFund hält alles übersichtlich an einem Ort.",
      appSubpageLink: "Lies, wie du eine Klassenkasse ohne Chaos organisierst",
      imprint: "Impressum",
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
      importBtn: "Import",
      resetBtn: "Reset",

      summaryTitle: "Overview",
      totalBalanceLabel: "Total balance",
      familiesCountLabel: "Active Families",
      txCountLabel: "Transactions",
      bankDeposits: "Deposits (bank)",
      bankExpenses: "Expenses (bank)",
      bankBalance: "Bank balance",

      settingsTitle: "Settings",
      targetAmountLabel: "Target amount per family (€)",
      phTargetAmount: "e.g. 25.00",
      targetHint: "If set: each family should have at least this balance.",

      schoolYearTitle: "School year",
      schoolYearFromLabel: "School year from",
      schoolYearToLabel: "School year until",
      schoolYearHint: "Category totals are calculated only within this range.",

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
      familyRareHint: "Use this to add new families when they join the class",
      familySelectionRadioTitle: "Selection",
      selectAllFamilies: "Select all families",
      selectFamilies: "Select specific families",
      parent1Label: "Parent 1",
      phParent1: "Name",
      parent2Label: "Parent 2 (optional)",
      phParent2: "Name",
      emailLabel: "Email Parent 1",
      emailLabel2: "Email Parent 2",
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
      showActiveFamilies: "Active Families",
      showInactiveFamilies: 'Inactive Families',
      ledgerTitle: "History of transactions",
      ledgerHistoryHint: "List of all deposits and expenses",
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
      emailPlaceholdersHint: "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{email2}}, {{today}}",
      openMailBtn: "Open mail app",
      emailPreviewLabel: "Preview",

      reminderTitle: "Reminder batch",
      reminderModeLabel: "Criteria",
      reminderBelowTarget: "Below target",
      reminderNegativeOnly: "Negative only",
      reminderActiveOnly: "Active families only",
      reminderHint: "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{email2}}, {{today}}",
      copyAllBtn: "Copy all",
      openNextBtn: "Open next email",
      reminderListLabel: "Recipients",

      reportTitle: "Overview",
      printBtn: "Print / PDF",

      appHeaderSubpage: "Class funds can quickly become confusing",
      appSubpageExplanation: "Cash payments, WhatsApp messages, and spreadsheets get messy fast. It’s easy to lose track of who has already paid and what the money was spent on. ClassFund keeps everything clearly organized in one place.",
      appSubpageLink: "Read how to organize a class fund without the chaos.",
      imprint: "Imprint",
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

const CATEGORY_DEFS = {
  deposit: {
    de: "Einzahlung",
    en: "Deposit",
    class: "badge--cat-einzahlung",
  },
  trip: {
    de: "Ausflug",
    en: "Trip",
    class: "badge--cat-ausflug",
  },
  travel: {
    de: "Reise",
    en: "Travel",
    class: "badge--cat-reise",
  },
  material: {
    de: "Material",
    en: "Material",
    class: "badge--cat-material",
  },
  gift: {
    de: "Geschenk",
    en: "Gift",
    class: "badge--cat-geschenk",
  },
  fees: {
    de: "Bankgebühren",
    en: "Bank fees",
    class: "badge--cat-bank-fees",
  },
  event: {
    de: "Veranstaltung",
    en: "Event",
    class: "badge--cat-veranstaltung",
  },
  other: {
    de: "Sonstiges",
    en: "Other",
    class: "badge--cat-unkategorisiert",
  },
};

function mapLegacyCategoryToKey(raw) {
  if (!raw) return "other";

  const value = String(raw).trim();

  // already a valid key?
  if (CATEGORY_DEFS[value]) return value;

  // match DE / EN labels
  for (const [key, def] of Object.entries(CATEGORY_DEFS)) {
    if (def.de === value || def.en === value) {
      return key;
    }
  }

  // fallback
  return "other";
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
    categories: Object.keys(CATEGORY_DEFS),
    // "all" = preselect all eligible, allow uncheck
    // "custom" = start empty, user checks families
    expenseSelectMode: "all",
    // needed to filter or group categories by school year
    schoolYearFromISO: null,
    schoolYearToISO: null,
    familyListFilter: {
      showActive: true,
      showInactive: false,
    },
  };
}

function isWithinSchoolYear(dateISO) {
  if (!dateISO) return true;
  const from = state.schoolYearFromISO;
  const to = state.schoolYearToISO;
  if (!from && !to) return true;
  if (from && dateISO < from) return false;
  if (to && dateISO > to) return false;
  return true;
}

function categoryLabel(key) {
  const def = CATEGORY_DEFS[key];
  if (!def) return key;
  return def[state.lang] || def.en || key;
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

    const categories = Array.isArray(parsed.categories)
      ? Array.from(new Set(parsed.categories.filter(Boolean).map(mapLegacyCategoryToKey)))
      : base.categories;

    const expenseSelectMode = parsed.expenseSelectMode === "custom" ? "custom" : "all";

    const familyListFilter = parsed.familyListFilter && typeof parsed.familyListFilter === "object"
      ? {
          showActive: parsed.familyListFilter.showActive !== false, // default true
          showInactive: !!parsed.familyListFilter.showInactive,     // default false
        }
      : { showActive: true, showInactive: false };

    return {
      ...base,
      ...parsed,
      lang,
      theme,
      targetCents,
      expenseSelectMode,
      categories,
      familyListFilter,
      families: families.map((f) => ({
        id: f.id || uid(),
        parent1: typeof f.parent1 === "string" ? f.parent1.slice(0, 60) : "",
        parent2: typeof f.parent2 === "string" ? f.parent2.slice(0, 60) : "",
        email: typeof f.email === "string" ? f.email.slice(0, 120) : "",
        email2: typeof f.email2 === "string" ? f.email2.slice(0, 120) : "",
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
        category: mapLegacyCategoryToKey(t.category),
        expenseId: typeof t.expenseId === "string" ? t.expenseId : null,
      })),
      expenses: expenses.map((e) => ({
        id: e.id || uid(),
        title: typeof e.title === "string" ? e.title.slice(0, 80) : "",
        totalCents: Number.isFinite(e.totalCents) ? e.totalCents : 0,
        dateISO: typeof e.dateISO === "string" ? e.dateISO : todayISO(),
        participantIds: Array.isArray(e.participantIds) ? e.participantIds.filter(Boolean) : [],
        category: mapLegacyCategoryToKey(e.category),
        perFamilyCentsMap: e.perFamilyCentsMap && typeof e.perFamilyCentsMap === "object" ? e.perFamilyCentsMap : {},
        createdAt: Number.isFinite(e.createdAt) ? e.createdAt : Date.now(),
      })),
      schoolYearFromISO:
        (typeof parsed.schoolYearFromISO === "string" && isISODate(parsed.schoolYearFromISO))
          ? parsed.schoolYearFromISO
          : null,
      schoolYearToISO:
        (typeof parsed.schoolYearToISO === "string" && isISODate(parsed.schoolYearToISO))
          ? parsed.schoolYearToISO
          : null,
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

  // Family overview cards
  showActiveFamilies: document.getElementById("showActiveFamilies"),
  showInactiveFamilies: document.getElementById("showInactiveFamilies"),

  // settings
  targetAmount: document.getElementById("targetAmount"),
  schoolYearFrom: document.getElementById("schoolYearFrom"),
  schoolYearTo: document.getElementById("schoolYearTo"),

  // reminder dialog
  reminderDialog: document.getElementById("reminderDialog"),
  closeReminder: document.getElementById("closeReminder"),
  reminderMode: document.getElementById("reminderMode"),
  reminderActiveOnly: document.getElementById("reminderActiveOnly"),
  reminderSubject: document.getElementById("reminderSubject"),
  reminderTemplate: document.getElementById("reminderTemplate"),
  copyAllReminders: document.getElementById("copyAllReminders"),
  openNextReminder: document.getElementById("openNextReminder"),
  reminderList: document.getElementById("reminderList"),
  reminderCount: document.getElementById("reminderCount"),
  reminderTemplateKind: document.getElementById("reminderTemplateKind"),
  reminderIncludeInactive: document.getElementById("reminderIncludeInactive"),


  // import dialog UX
  importDialog: document.getElementById("importDialog"),
  closeImport: document.getElementById("closeImport"),
  importDropzone: document.getElementById("importDropzone"),
  importDialogFile: document.getElementById("importDialogFile"),
  confirmImportBtn: document.getElementById("confirmImportBtn"),
  importStatus: document.getElementById("importStatus"),
  importBackupExport: document.getElementById("importBackupExport"),
  importBtn: document.getElementById("importBtn"),

  // Reset confirm modal (UI)
  confirmDialog: document.getElementById("confirmDialog"),
  closeConfirm: document.getElementById("closeConfirm"),
  cancelReset: document.getElementById("cancelReset"),
  confirmReset: document.getElementById("confirmReset"),

  // deposits
  depositDate: document.getElementById("depositDate"),
  depositFamily: document.getElementById("depositFamily"),
  depositAmount: document.getElementById("depositAmount"),
  depositNote: document.getElementById("depositNote"),
  addDepositBtn: document.getElementById("addDepositBtn"),

  depositCategory: document.getElementById("depositCategory"),
  expenseCategory: document.getElementById("expenseCategory"),
  categoryOverview: document.getElementById("categoryOverview"),

  // expenses
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
  email2: document.getElementById("email2"),
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

function categoryBadge(catKey) {
  const def = CATEGORY_DEFS[catKey] || CATEGORY_DEFS.other;
  const label = escapeHtml(categoryLabel(catKey));
  const cls = def.class || "badge--cat-unkategorisiert";
  return `<span class="badge badge--category ${cls}">${label}</span>`;
}

function ensureCategoryExists(raw) {
  const key = mapLegacyCategoryToKey(raw);

  if (!state.categories.includes(key)) {
    state.categories.push(key);
    state.categories.sort();
  }
  return key;
}

function renderCategoryPickers() {
  const cats = (state.categories || []).slice();
  if (!cats.includes("other")) cats.unshift("other");

  function fillSelect(sel) {
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = "";

    for (const key of cats) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = categoryLabel(key);
      sel.appendChild(opt);
    }

    sel.value = cats.includes(current) ? current : "other";
  }

  fillSelect(els.depositCategory);
  fillSelect(els.expenseCategory);
}

// School years
function renderSchoolYearInputs() {
  if (els.schoolYearFrom) els.schoolYearFrom.value = state.schoolYearFromISO || "";
  if (els.schoolYearTo) els.schoolYearTo.value = state.schoolYearToISO || "";
}

function updateSchoolYearFromInputs() {
  const from = els.schoolYearFrom?.value || "";
  const to = els.schoolYearTo?.value || "";

  if (from && !isISODate(from)) {
    alert(state.lang === "de" ? "Ungültiges Startdatum." : "Invalid start date.");
    return;
  }
  if (to && !isISODate(to)) {
    alert(state.lang === "de" ? "Ungültiges Enddatum." : "Invalid end date.");
    return;
  }
  if (from && to && to < from) {
    alert(state.lang === "de"
      ? "Schuljahr bis muss nach Schuljahr von liegen."
      : "School year end must be after start.");
    return;
  }

  state.schoolYearFromISO = from || null;
  state.schoolYearToISO = to || null;

  saveState();
  renderAll();
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
    ------- balances ----------
=========================================================*/

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
        note: (t.note || "").trim(),
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
    const note = it.note ? ` · ${it.note}` : "";
    lines.push(`- ${it.dateISO} · ${it.title}${note} · ${sign}${formatEUR(Math.abs(it.amountCentsSigned))}`);
  }

  return lines.join("\n");
}

// Renders the report for each family - deposits and expenses
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
      const note = it.note ? ` · ${escapeHtml(it.note)}` : "";

      return `
        <tr>
          <td>${escapeHtml(it.dateISO)}</td>
          <td>${escapeHtml(it.title)}${note}</td>
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
      ${f.email2 ? `<div>${escapeHtml(f.email2)}</div>` : ""}
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
  IMPORT DIALOG UX
========================================================= */
let pendingImportFile = null;

function setImportStatus(msg, kind = "warn") {
  if (!els.importStatus) return;
  els.importStatus.textContent = msg || "";
  els.importStatus.className = "importStatus " + (kind ? `importStatus--${kind}` : "");
}

function openImportDialog() {
  if (!els.importDialog) return;

  pendingImportFile = null;
  if (els.confirmImportBtn) els.confirmImportBtn.disabled = true;

  // language-friendly hints (simple, no full i18n yet)
  if (document.getElementById("importHelpText")) {
    document.getElementById("importHelpText").textContent =
      state.lang === "de"
        ? "Importiere einen früheren Export (.json). Die aktuellen Daten in diesem Browser werden ersetzt."
        : "Import a previous export (.json). Your current data will be replaced in this browser.";
  }

  if (els.importDropzone) {
    els.importDropzone.querySelector(".dropzone__title").textContent =
      state.lang === "de" ? "JSON hier ablegen" : "Drop JSON here";
    els.importDropzone.querySelector(".dropzone__sub").textContent =
      state.lang === "de" ? "…oder Datei auswählen" : "…or choose a file";
  }

  setImportStatus(
    state.lang === "de"
      ? "Tipp: Exportiere vorher ein Backup, falls du zurück willst."
      : "Tip: Export a backup first, if you want to be able to revert.",
    "warn"
  );

  els.importDialog.showModal();
}

function closeImportDialog() {
  if (els.importDialog?.open) els.importDialog.close();
  pendingImportFile = null;
}

function setPendingImportFile(file) {
  pendingImportFile = null;

  if (!file) {
    if (els.confirmImportBtn) els.confirmImportBtn.disabled = true;
    setImportStatus(state.lang === "de" ? "Keine Datei ausgewählt." : "No file selected.", "warn");
    return;
  }

  const isJson =
    file.type === "application/json" ||
    file.name.toLowerCase().endsWith(".json");

  if (!isJson) {
    if (els.confirmImportBtn) els.confirmImportBtn.disabled = true;
    setImportStatus(
      state.lang === "de" ? "Bitte eine .json Export-Datei auswählen." : "Please select a .json export file.",
      "err"
    );
    return;
  }

  pendingImportFile = file;
  if (els.confirmImportBtn) els.confirmImportBtn.disabled = false;

  setImportStatus(
    state.lang === "de"
      ? `Ausgewählt: ${file.name} (${Math.round(file.size / 1024)} KB)`
      : `Selected: ${file.name} (${Math.round(file.size / 1024)} KB)`,
    "warn"
  );
}

function doImportFromPendingFile() {
  const d = dict();
  if (!pendingImportFile) return;

  setImportStatus(state.lang === "de" ? "Import läuft…" : "Importing…", "warn");

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!parsed || typeof parsed !== "object") throw new Error("bad");

      // accept older shapes
      const candidate = { ...parsed };
      delete candidate.exportedAt;

      if (!candidate.tx && Array.isArray(candidate.transactions)) candidate.tx = candidate.transactions;
      if (!Array.isArray(candidate.families)) candidate.families = [];
      if (!Array.isArray(candidate.tx)) candidate.tx = [];
      if (!Array.isArray(candidate.expenses)) candidate.expenses = [];
      if (!Array.isArray(candidate.categories)) candidate.categories = defaultState().categories;

      if (!candidate.lang) candidate.lang = state.lang || "en";
      if (!candidate.theme) candidate.theme = state.theme || "minimal";

      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidate));

      state = loadState();
      lastExpenseDateISO = null;
      expenseSelection.clear();
      renderAll();

      setImportStatus(state.lang === "de" ? "Import erfolgreich." : "Import successful.", "ok");

      // auto-close after short delay (UX-friendly)
      setTimeout(() => closeImportDialog(), 500);

    } catch (e) {
      console.error("Import failed:", e);
      setImportStatus(d.errors.importFailed || "Import failed.", "err");
    } finally {
      if (els.importDialogFile) els.importDialogFile.value = "";
      pendingImportFile = null;
      if (els.confirmImportBtn) els.confirmImportBtn.disabled = true;
    }
  };
  reader.readAsText(pendingImportFile);
}

/** =========================================================
  REMINDER DIALOG (batch)
========================================================= */
let reminderRecipients = [];
let reminderCursor = 0;

function currentReminderTemplateKind() {
  const v = (els.reminderTemplateKind?.value || "reminder").trim();
  return (v === "overview") ? "overview" : "reminder";
}

function defaultSubjectForKind(kind) {
  return kind === "overview" ? defaultOverviewSubject() : defaultReminderSubject();
}

function defaultTemplateForKind(kind) {
  return kind === "overview" ? defaultOverviewTemplate() : defaultReminderTemplate();
}

function defaultReminderSubject() {
  return state.lang === "de" ? "Erinnerung: Klassenkasse" : "Reminder: Class fund";
}

function defaultOverviewSubject() {
  return state.lang === "de" ? "Klassenkasse – Kontostandsübersicht" : "Class fund – account overview";
}

function defaultOverviewTemplate() {
  if (state.lang === "de") {
    return [
      "Liebe {{parents}},",
      "",
      "hier ist eine kurze Kontostandsübersicht zur Klassenkasse:",
      "Aktueller Saldo: {{balance}}",
      state.targetCents > 0 ? "Ziel: {{target}} · Fehlt noch: {{due}}" : "",
      "",
      "Im Anhang ist eine ausführliche Buchungsübersicht als PDF.",
      "",
      "Liebe Grüße",
    ].filter(Boolean).join("\n");
  }

  return [
    "Dear {{parents}},",
    "",
    "Please find below a short overview of the class fund account:",
    "Current balance: {{balance}}",
    state.targetCents > 0 ? "Target: {{target}} · Outstanding amount: {{due}}" : "",
    "",
    "A detailed transaction overview is attached as a PDF.",
    "",
    "Kind regards",
  ].filter(Boolean).join("\n");
}

function defaultReminderTemplate() {
  if (state.lang === "de") {
    return [
      "Liebe {{parents}},",
      "",
      "eine kleine Erinnerung zur Klassenkasse",
      "",
      "Aktueller Kontostand: {{balance}}",
      state.targetCents > 0
        ? "Wir streben als gemeinsames Klassenguthaben {{target}} an. Aktuell fehlen noch {{due}}."
        : "",
      "",
      "Die Klassenkasse hilft uns, Ausflüge, Materialien und gemeinsame Aktivitäten unkompliziert zu finanzieren.",
      "Vielen Dank für die Unterstützung!",
      "",
      "Liebe Grüße",
    ].filter(Boolean).join("\n");
  }
  return [
   "Dear {{parents}},",
    "",
    "Just a quick reminder about the class fund.",
    "",
    "Current balance: {{balance}}",
    state.targetCents > 0
      ? "Our goal for the class fund is {{target}}. Currently, {{due}} is still missing."
      : "",
    "",
    "The class fund helps us cover trips, materials and shared activities easily.",
    "Thanks a lot for your support!",
    "",
    "Kind regards",
  ].filter(Boolean).join("\n");
}

function applyTemplate(template, family, balanceCents) {
  const parents = parentsText(family);
  const kids = childrenText(family);
  const due = dueCents(balanceCents);
  const target = state.targetCents || 0;

  return String(template || "")
    .replaceAll("{{parents}}", parents || "—")
    .replaceAll("{{children}}", kids || "")
    .replaceAll("{{balance}}", formatEUR(balanceCents))
    .replaceAll("{{due}}", formatEUR(due))
    .replaceAll("{{target}}", formatEUR(target))
    .replaceAll("{{email}}", String(family?.email || ""))
    .replaceAll("{{email2}}", String(family?.email2 || ""))
    .replaceAll("{{today}}", todayISO());
}

function buildReminderRecipients() {
  const kind = currentReminderTemplateKind(); // "reminder" | "overview"
  const mode = els.reminderMode?.value || "below_target"; // "below_target" | "negative_only"
  const activeOnly = !!els.reminderActiveOnly?.checked;
  const includeInactive = !!els.reminderIncludeInactive?.checked;

  const balances = calcFamilyBalances();
  const fams = state.families.slice();

  const list = [];

  for (const f of fams) {
    // --- Active/inactive filter (UI flags) ---
    // If user wants "only active", exclude inactive (unless includeInactive explicitly)
    if (!includeInactive && activeOnly && !f.active) continue;

    const bal = balances.get(f.id) || 0;
    const due = dueCents(bal);

    // only families with email make sense for mailto
    const emails = [f.email, f.email2].map(e => String(e || "").trim()).filter(isValidEmail);
    if (emails.length === 0) continue;

    // =========================================================
    // ✅ KEY CHANGE: filter depends on template kind
    // =========================================================

    if (kind === "overview") {
      // "Budget/Overview" email: show ALL families (with email), regardless of due/balance
      list.push({ f, bal });
      continue;
    }

    // kind === "reminder": only families who are under target OR negative (depending on mode)
    if (mode === "negative_only") {
      if (bal < 0) list.push({ f, bal });
      continue;
    }

    // below_target (default)
    if (state.targetCents > 0) {
      if (due > 0) list.push({ f, bal });
    } else {
      // if no target set, fallback: remind only negative
      if (bal < 0) list.push({ f, bal });
    }
  }

  // sort
  list.sort((a, b) => {
    // For overview: sort by name
    if (kind === "overview") {
      return familyDisplayName(a.f).localeCompare(familyDisplayName(b.f));
    }

    // For reminder: biggest due/most negative first
    const aScore = state.targetCents > 0 ? dueCents(a.bal) : Math.abs(Math.min(0, a.bal));
    const bScore = state.targetCents > 0 ? dueCents(b.bal) : Math.abs(Math.min(0, b.bal));
    return (bScore - aScore) || familyDisplayName(a.f).localeCompare(familyDisplayName(b.f));
  });

  return list;
}

function renderReminderList() {
  if (!els.reminderList) return;

  const kind = currentReminderTemplateKind();
  const template =
    (els.reminderTemplate?.value || "").trim() || defaultTemplateForKind(kind);
  const subject =
    (els.reminderSubject?.value || "").trim() || defaultSubjectForKind(kind);

  els.reminderList.innerHTML = "";

  reminderRecipients.forEach((it, idx) => {
    const row = document.createElement("div");
    row.className = "reminderRow";

    const left = document.createElement("div");
    left.className = "reminderRow__left";

    const title = document.createElement("div");
    title.className = "reminderRow__title";
    title.style.fontWeight = "800";
    title.textContent = familyDisplayName(it.f);

    const emailsTooltip = [it.f.email, it.f.email2]
      .map(e => String(e || "").trim())
      .filter(Boolean)
      .join(" · ");
    if (emailsTooltip) title.title = emailsTooltip;

    const meta = document.createElement("div");
    meta.className = "muted small";
    const due = dueCents(it.bal);
    meta.textContent =
      state.targetCents > 0
        ? `${state.lang === "de" ? "Saldo" : "Balance"}: ${formatEUR(it.bal)} · ${
            state.lang === "de" ? "Fehlt" : "Due"
          }: ${formatEUR(due)}`
        : `${state.lang === "de" ? "Saldo" : "Balance"}: ${formatEUR(it.bal)}`;

    left.appendChild(title);
    left.appendChild(meta);

    const btnWrap = document.createElement("div");
    btnWrap.className = "reminderRow__buttons";

    const openBtn = document.createElement("button");
    openBtn.className = "btn btn--primary";
    openBtn.type = "button";
    openBtn.textContent = state.lang === "de" ? "Mail öffnen" : "Open mail";
    openBtn.addEventListener("click", () => {
      reminderCursor = idx;
      openCurrentReminder(subject, template);
      renderReminderList();
    });

    const reportBtn = document.createElement("button");
    reportBtn.className = "btn";
    reportBtn.type = "button";
    reportBtn.textContent = state.lang === "de" ? "Report / PDF" : "Report / PDF";
    reportBtn.addEventListener("click", () => {
      openFamilyReport(it.f.id);
    });

    btnWrap.appendChild(openBtn);
    btnWrap.appendChild(reportBtn);

    if (idx === reminderCursor) {
      row.style.outline = "2px solid var(--stroke)";
      row.style.borderRadius = "12px";
      row.style.padding = "10px";
    } else {
      row.style.padding = "10px";
    }

    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.gap = "12px";
    row.appendChild(left);
    row.appendChild(btnWrap);

    els.reminderList.appendChild(row);
  });

  if (els.reminderCount) {
    els.reminderCount.textContent =
      state.lang === "de"
        ? `${reminderRecipients.length} Empfänger:innen`
        : `${reminderRecipients.length} recipients`;
  }
}


function openCurrentReminder(subject, template) {
  const it = reminderRecipients[reminderCursor];
  if (!it) return;

  const body = applyTemplate(template, it.f, it.bal);
  const recipients = [it.f.email, it.f.email2]
    .map(e => String(e || "").trim())
    .filter(isValidEmail)
    .map(encodeURIComponent)
    .join(",");

  const mailto =
    `mailto:${recipients}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
}

function openReminderDialog() {
  if (!els.reminderDialog) return;

  const kind = currentReminderTemplateKind();

  // Defaults if empty
  if (els.reminderSubject && !String(els.reminderSubject.value || "").trim()) {
    els.reminderSubject.value = defaultSubjectForKind(kind);
  }
  if (els.reminderTemplate && !String(els.reminderTemplate.value || "").trim()) {
    els.reminderTemplate.value = defaultTemplateForKind(kind);
  }

  reminderRecipients = buildReminderRecipients();
  reminderCursor = 0;

  renderReminderList();
  els.reminderDialog.showModal();
}

function refreshReminderDialog() {
  reminderRecipients = buildReminderRecipients();
  reminderCursor = Math.min(reminderCursor, Math.max(0, reminderRecipients.length - 1));
  renderReminderList();
}

function closeReminderDialog() {
  if (els.reminderDialog?.open) els.reminderDialog.close();
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

  const map = new Map(); // key -> {inCents,outCents}

  function ensureRow(k) {
    if (!map.has(k)) map.set(k, { inCents: 0, outCents: 0 });
    return map.get(k);
  }

  function bump(catKeyRaw, field, cents) {
    const k = mapLegacyCategoryToKey(catKeyRaw);
    const row = ensureRow(k);
    row[field] += cents;
  }

  // Deposits -> In
  for (const t of state.tx) {
    if (t.type !== "deposit") continue;
    if (!isWithinSchoolYear(t.dateISO)) continue;
    bump(t.category || "other", "inCents", Math.max(0, t.centsSigned || 0));
  }

  // Expenses -> Out
  for (const e of state.expenses) {
    if (!isWithinSchoolYear(e.dateISO)) continue;
    bump(e.category || "other", "outCents", Math.max(0, e.totalCents || 0));
  }

  const rows = Array.from(map.entries())
    .map(([key, v]) => ({ key, ...v, net: v.inCents - v.outCents }))
    .sort((a, b) => (b.outCents - a.outCents) || categoryLabel(a.key).localeCompare(categoryLabel(b.key)));

  if (rows.length === 0) {
    els.categoryOverview.innerHTML = `<div class="muted">${escapeHtml(dict().labels.reportNoTx || "No transactions.")}</div>`;
    return;
  }

  const rangeLabel =
    (state.schoolYearFromISO || state.schoolYearToISO)
      ? `<div class="muted small" style="margin-bottom:8px;">
          ${state.lang === "de" ? "Zeitraum:" : "Range:"}
          ${state.schoolYearFromISO || "…"} → ${state.schoolYearToISO || "…"}
        </div>`
      : "";

  els.categoryOverview.innerHTML = `
    ${rangeLabel}
    <table class="catTable">
      <thead>
        <tr>
          <th>${escapeHtml(state.lang === "de" ? "Kategorie" : "Category")}</th>
          <th style="text-align:right;">${escapeHtml(state.lang === "de" ? "Ein" : "In")}</th>
          <th style="text-align:right;">${escapeHtml(state.lang === "de" ? "Aus" : "Out")}</th>
          <th style="text-align:right;">${escapeHtml(state.lang === "de" ? "Netto" : "Net")}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${escapeHtml(categoryLabel(r.key))}</td>
            <td style="text-align:right;">${escapeHtml(formatEUR(r.inCents))}</td>
            <td style="text-align:right;">${escapeHtml(formatEUR(r.outCents))}</td>
            <td style="text-align:right; font-weight:900;">${escapeHtml(formatEUR(r.net))}</td>
          </tr>
        `).join("")}
      </tbody>
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

  const activeCount = state.families.filter(f => f.active).length;
  if (els.familiesCount) els.familiesCount.textContent = String(activeCount);
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

  const filter = state.familyListFilter || { showActive: true, showInactive: false };

  const fams = state.families
    .filter((f) => (f.active && filter.showActive) || (!f.active && filter.showInactive))
    .slice()
    .sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));

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
    card.className = "familyCard" + (f.active ? "" : " isInactive");
    card.setAttribute("aria-disabled", f.active ? "false" : "true");

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
    if (f.email2) bits.push(f.email2);
    if (f.comment) bits.push(f.comment);
    if (f.activeFromISO || f.activeToISO) bits.push(`${f.activeFromISO || "…"} → ${f.activeToISO || "…"} `);
    if (!f.active) bits.push(state.lang === "de" ? "inaktiv" : "inactive");
    small.textContent = bits.join(" · ");

    meta.appendChild(name);
    meta.appendChild(small);

    // click on family -> open report popup
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
    toggle.className = "btn toggleActiveBtn " + (f.active ? "isDeactivate" : "isActivate");
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

  // Email Parent 1
  const em = prompt(state.lang === "de" ? "E-Mail (optional)" : "Email (optional)", f.email || "");
  if (em === null) return;
  if (em && !isValidEmail(em)) {
    alert(d.errors.emailInvalid);
    return;
  }

  // Email Parent 2
  const em2 = prompt(state.lang === "de" ? "E-Mail (optional)" : "Email (optional)", f.email2 || "");
  if (em2 === null) return;
  if (em2 && !isValidEmail(em2)) {
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
  f.email2 = String(em2).trim().slice(0, 120);
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
  const email2 = String(els.email2?.value || "").trim().slice(0, 120);
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
  if (email2 && !isValidEmail(email2)) {
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
    email2,
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
  if (els.email2) els.email2.value = "";
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
function resetAllNow() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  saveState();

  lastExpenseDateISO = null;
  expenseSelection.clear();

  renderAll();
}

function openResetConfirmDialog() {
  if (!els.confirmDialog) return;

  // optional: i18n text im Dialog aktualisieren (falls du data-i18n nutzt, ist das eh drin)
  // aber falls du "hardcoded" Text drin hast, bleibt es so ok.

  els.confirmDialog.showModal();
}

function closeResetConfirmDialog() {
  if (els.confirmDialog?.open) els.confirmDialog.close();
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

(function initLangFromUrl(){
  const urlLang = new URLSearchParams(location.search).get("lang");
  if (urlLang) state.lang = normalizeLang(urlLang);
})();

(function normalizePrefsOnBoot() {
  // lang
  state.lang = normalizeLang(state.lang);

  // theme
  const allowedThemes = ["minimal", "paper"];
  if (!allowedThemes.includes(state.theme)) state.theme = "minimal";

  // school year dates
  if (state.schoolYearFromISO && !isISODate(state.schoolYearFromISO)) state.schoolYearFromISO = null;
  if (state.schoolYearToISO && !isISODate(state.schoolYearToISO)) state.schoolYearToISO = null;
  if (state.schoolYearFromISO && state.schoolYearToISO && state.schoolYearToISO < state.schoolYearFromISO) {
    // if corrupted, reset both
    state.schoolYearFromISO = null;
    state.schoolYearToISO = null;
  }

  saveState(); // persist cleaned values
})();


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

  const filter = state.familyListFilter || { showActive: true, showInactive: false };
  if (els.showActiveFamilies) els.showActiveFamilies.checked = !!filter.showActive;
  if (els.showInactiveFamilies) els.showInactiveFamilies.checked = !!filter.showInactive;

  if (els.lang) els.lang.value = state.lang;
  if (els.theme) els.theme.value = state.theme;

  if (els.depositDate && !els.depositDate.value) els.depositDate.value = todayISO();
  if (els.expenseDate && !els.expenseDate.value) els.expenseDate.value = todayISO();

  renderTargetInput();
  renderSchoolYearInputs();
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

if (els.schoolYearFrom) els.schoolYearFrom.addEventListener("change", updateSchoolYearFromInputs);
if (els.schoolYearTo) els.schoolYearTo.addEventListener("change", updateSchoolYearFromInputs);

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

/** Add Family wiring */
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

// family overview list
if (els.showActiveFamilies) {
  els.showActiveFamilies.addEventListener("change", (e) => {
    state.familyListFilter = state.familyListFilter || { showActive: true, showInactive: false };
    state.familyListFilter.showActive = !!e.target.checked;
    saveState();
    renderFamilies();
  });
}
if (els.showInactiveFamilies) {
  els.showInactiveFamilies.addEventListener("change", (e) => {
    state.familyListFilter = state.familyListFilter || { showActive: true, showInactive: false };
    state.familyListFilter.showInactive = !!e.target.checked;
    saveState();
    renderFamilies();
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
if (els.importBtn) els.importBtn.addEventListener("click", openImportDialog);
// Import dialog bindings
if (els.closeImport) els.closeImport.addEventListener("click", closeImportDialog);

if (els.importDialog) {
  els.importDialog.addEventListener("click", (e) => {
    if (e.target === els.importDialog) closeImportDialog();
  });
}

// Reminder dialog open/close
if (els.reminderBtn) els.reminderBtn.addEventListener("click", openReminderDialog);
if (els.closeReminder) els.closeReminder.addEventListener("click", closeReminderDialog);

if (els.reminderDialog) {
  els.reminderDialog.addEventListener("click", (e) => {
    if (e.target === els.reminderDialog) closeReminderDialog();
  });
}

if (els.reminderTemplateKind) {
  els.reminderTemplateKind.addEventListener("change", () => {
    const kind = currentReminderTemplateKind();
    els.reminderSubject.value = defaultSubjectForKind(kind);
    els.reminderTemplate.value = defaultTemplateForKind(kind);
    refreshReminderDialog();
  });
}
if (els.reminderIncludeInactive) {
  els.reminderIncludeInactive.addEventListener("change", refreshReminderDialog);
}

// Refresh list when criteria changes
if (els.reminderMode) els.reminderMode.addEventListener("change", refreshReminderDialog);
if (els.reminderActiveOnly) els.reminderActiveOnly.addEventListener("change", refreshReminderDialog);

// Keep list up-to-date when user edits subject/template
if (els.reminderSubject) els.reminderSubject.addEventListener("input", renderReminderList);
if (els.reminderTemplate) els.reminderTemplate.addEventListener("input", renderReminderList);

// Open next email
if (els.openNextReminder) {
  els.openNextReminder.addEventListener("click", () => {
    if (!reminderRecipients.length) return;
    const subject = els.reminderSubject?.value || defaultReminderSubject();
    const template = els.reminderTemplate?.value || defaultReminderTemplate();

    openCurrentReminder(subject, template);

    // advance cursor (wrap)
    reminderCursor = (reminderCursor + 1) % reminderRecipients.length;
    renderReminderList();
  });
}

// Copy all reminders as text blocks
if (els.copyAllReminders) {
  els.copyAllReminders.addEventListener("click", async () => {
    if (!reminderRecipients.length) return;

    const subject = els.reminderSubject?.value || defaultReminderSubject();
    const template = els.reminderTemplate?.value || defaultReminderTemplate();

    const blocks = reminderRecipients.map((it) => {
      const body = applyTemplate(template, it.f, it.bal);
      const recipients = [
        it.f.email,
        it.f.email2
      ].filter(e => e && e.trim()); // only valid email addresses

      return [
        `---`,
        `TO: ${recipients.join(", ")}`,
        `SUBJECT: ${subject}`,
        ``,
        body,
        ``,
      ].join("\n");
    }).join("\n");

    try {
      await navigator.clipboard.writeText(blocks);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = blocks;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  });
}

if (els.importBackupExport) {
  els.importBackupExport.addEventListener("click", () => {
    // reuse export dialog flow
    openExportDialog();
    setImportStatus(
      state.lang === "de"
        ? "Backup-Export geöffnet. Danach kannst du hier importieren."
        : "Backup export opened. You can import here afterwards.",
      "warn"
    );
  });
}

if (els.importDialogFile) {
  els.importDialogFile.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    setPendingImportFile(file);
  });
}

if (els.confirmImportBtn) {
  els.confirmImportBtn.addEventListener("click", doImportFromPendingFile);
}

if (els.importDropzone) {
  // click -> open file chooser
  els.importDropzone.addEventListener("click", () => els.importDialogFile?.click());

  // keyboard accessibility
  els.importDropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") els.importDialogFile?.click();
  });

  // drag/drop
  ["dragenter", "dragover"].forEach((ev) => {
    els.importDropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      els.importDropzone.classList.add("dropzone--dragover");
    });
  });

  ["dragleave", "drop"].forEach((ev) => {
    els.importDropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      els.importDropzone.classList.remove("dropzone--dragover");
    });
  });

  els.importDropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;
    setPendingImportFile(file);
  });
}

if (els.resetBtn) els.resetBtn.addEventListener("click", openResetConfirmDialog);
if (els.exportBtn) {
  els.exportBtn.addEventListener("click", openExportDialog);
}

// Reset confirm dialog wiring (UI modal)
if (els.closeConfirm) els.closeConfirm.addEventListener("click", closeResetConfirmDialog);
if (els.cancelReset) els.cancelReset.addEventListener("click", closeResetConfirmDialog);

if (els.confirmReset) {
  els.confirmReset.addEventListener("click", () => {
    resetAllNow();
    closeResetConfirmDialog();
  });
}

if (els.confirmDialog) {
  // click on backdrop closes (same pattern as other dialogs)
  els.confirmDialog.addEventListener("click", (e) => {
    if (e.target === els.confirmDialog) closeResetConfirmDialog();
  });
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

renderAll();
