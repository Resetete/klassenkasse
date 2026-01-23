/* =========================================================
   ClassFund / Klassenkasse — app.js (v1.3)
   ---------------------------------------------------------
   ✓ Matches your current index.html (modals + data-i18n)
   ✓ Backward compatible imports (older exports still work)
   ✓ Expense: all eligible families preselected, can uncheck
   ✓ Family active period (from/to) + comment
   ✓ Family appears in dropdowns only if active for tx date
   ✓ Export/Import/Reset via dialogs (as in your HTML)
   ✓ Email + Reminder batch + Report modal wired
   ========================================================= */

const STORAGE_KEY = "klassenkasse_familien_v1";

/* ---------------- i18n ---------------- */
const I18N = {
  en: {
    appTitle: "Class Fund",
    appSubtitle: "Family accounts, contributions, split class expenses, balances & email texts.",
    languageLabel: "Language",
    themeLabel: "Theme",
    reminderBtn: "Reminders",
    exportBtn: "Export",
    importBtn: "Import",
    resetBtn: "Reset",

    summaryTitle: "Overview",
    totalBalanceLabel: "Total balance",
    familiesCountLabel: "Families",
    txCountLabel: "Transactions",

    settingsTitle: "Settings",
    targetAmountLabel: "Target amount per family (€)",
    targetHint: "If set: each family should have at least this balance.",
    phTargetAmount: "e.g. 25.00",

    depositTitle: "Contribution",
    dateLabel: "Date",
    familyLabel: "Family",
    amountLabel: "Amount (€)",
    noteLabel: "Note (optional)",
    addDepositBtn: "Add contribution",
    phDepositAmount: "e.g. 10.00",
    phDepositNote: "e.g. January contribution",

    classExpenseTitle: "Split class expense",
    expenseTitleLabel: "Title",
    totalAmountLabel: "Total amount (€)",
    expenseSelectLabel: "Families",
    expenseAllHint: "All eligible families are preselected — uncheck to exclude.",
    addExpenseBtn: "Split expense",
    roundingHint: "Cent remainders are distributed fairly.",
    phExpenseTitle: "e.g. Museum trip",
    phExpenseAmount: "e.g. 120.00",

    addFamilyTitle: "Add family",
    familyRareHint: "That's only needed if a new family joins",
    parent1Label: "Parent 1",
    parent2Label: "Parent 2 (optional)",
    emailLabel: "Email",
    emailOptionalHint: "Optional — reminders/emails are disabled without an email.",
    childrenLabel: "Children (comma-separated)",
    activeFromLabel: "In class from",
    activeToLabel: "In class until",
    familyNoteLabel: "Comment",
    addFamilyBtn: "Add family",
    familyHint: "Tip: inactive families are excluded from selections, but remain in history.",
    phParent1: "e.g. Alex",
    phParent2: "e.g. Sam",
    phEmail: "name@example.com",
    phChildren: "e.g. Yuna, Kristoff",
    phFamilyNote: "e.g. joined mid-year",

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
    emailPlaceholdersHint:
      "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
    openMailBtn: "Open mail app",
    emailPreviewLabel: "Preview",

    reminderTitle: "Reminder batch",
    reminderModeLabel: "Criteria",
    reminderBelowTarget: "Below target",
    reminderNegativeOnly: "Negative only",
    reminderActiveOnly: "Active families only",
    reminderHint:
      "Placeholders: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
    copyAllBtn: "Copy all",
    openNextBtn: "Open next email",
    reminderListLabel: "Recipients",

    reportTitle: "Overview",
    printBtn: "Print / PDF",

    /* buttons inside family cards */
    btnEdit: "Edit",
    btnDelete: "Delete",
    btnDeactivate: "Deactivate",
    btnActivate: "Activate",
    btnEmail: "Email",
    btnReport: "Report",

    /* validations / alerts */
    errAmountInvalid: "Please enter a valid amount > 0.",
    errFamilyMissing: "Please select a family.",
    errNoParticipants: "Please select at least one family.",
    errEmailInvalid: "Please enter a valid email address.",
    errFamilyNameRequired: "Please enter at least one child or a parent name.",
    errImportFailed: "Import failed: invalid file.",
    errEmailMissing: "No email set for this family.",
    errTargetMissing: "Please set a target amount first.",
    errFamilyNotActiveForDate: "Family is not active for this date.",
    confirmDeleteFamily: "Delete this family?",
    confirmDeactivateInstead:
      "This family has transactions. Instead of deleting, it will be deactivated. OK?",
    uiNoEligibleFamilies: "No eligible families for this date.",
    uiExportFilename: "classfund-export.json",

    emailDefaultSubject: "Class fund — quick note",
    emailDefaultTemplate:
      "Hi {{parents}},\n\nquick note about the class fund:\n\nChildren: {{children}}\nCurrent balance: {{balance}}\nTarget: {{target}}\nDue: {{due}}\n\nBest regards\n",
  },

  de: {
    appTitle: "Klassenkasse",
    appSubtitle: "Familienkonten, Einzahlungen, Klassen-Ausgaben verteilen, Salden & E-Mail Texte.",
    languageLabel: "Sprache",
    themeLabel: "Theme",
    reminderBtn: "Erinnerungen",
    exportBtn: "Export",
    importBtn: "Import",
    resetBtn: "Reset",

    summaryTitle: "Übersicht",
    totalBalanceLabel: "Gesamtsaldo",
    familiesCountLabel: "Familien",
    txCountLabel: "Buchungen",

    settingsTitle: "Einstellungen",
    targetAmountLabel: "Zielbetrag pro Familie (€)",
    targetHint: "Wenn gesetzt: Jede Familie sollte mindestens diesen Saldo haben.",
    phTargetAmount: "z. B. 25,00",

    depositTitle: "Einzahlung",
    dateLabel: "Datum",
    familyLabel: "Familie",
    amountLabel: "Betrag (€)",
    noteLabel: "Notiz (optional)",
    addDepositBtn: "Einzahlung hinzufügen",
    phDepositAmount: "z. B. 10,00",
    phDepositNote: "z. B. Januar-Beitrag",

    classExpenseTitle: "Klassen-Ausgabe verteilen",
    expenseTitleLabel: "Titel",
    totalAmountLabel: "Gesamtbetrag (€)",
    expenseSelectLabel: "Familien",
    expenseAllHint: "Alle passenden Familien sind vorausgewählt — abwählen, um auszuschließen.",
    addExpenseBtn: "Ausgabe aufteilen",
    roundingHint: "Cent-Reste werden fair verteilt.",
    phExpenseTitle: "z. B. Museum",
    phExpenseAmount: "z. B. 120,00",

    addFamilyTitle: "Familie hinzufügen",
    familyRareHint: "Dies ist nur notwendig, wenn eine neue Familie hinzukommt",
    parent1Label: "Elternteil 1",
    parent2Label: "Elternteil 2 (optional)",
    emailLabel: "E-Mail",
    emailOptionalHint: "Optional — ohne E-Mail sind Erinnerungen/E-Mails deaktiviert.",
    childrenLabel: "Kinder (kommagetrennt)",
    activeFromLabel: "In Klasse ab",
    activeToLabel: "In Klasse bis",
    familyNoteLabel: "Kommentar",
    addFamilyBtn: "Familie hinzufügen",
    familyHint: "Tipp: Inaktive Familien sind aus Auswahlen raus, bleiben aber in der Historie.",
    phParent1: "z. B. Alex",
    phParent2: "z. B. Sam",
    phEmail: "name@example.com",
    phChildren: "z. B. Yuna, Kristoff",
    phFamilyNote: "z. B. Einstieg Mitte Jahr",

    familiesTitle: "Familien",
    ledgerTitle: "Historie",
    emptyState: "Noch keine Buchungen.",

    exportTitle: "Export",
    exportHelp: "JSON kopieren oder als Datei herunterladen.",
    copyBtn: "Kopieren",
    downloadBtn: "Download .json",

    resetTitle: "Alles zurücksetzen?",
    resetHelp:
      "Alle Daten werden aus diesem Browser gelöscht. Vorher exportieren, wenn du ein Backup willst.",
    cancelBtn: "Abbrechen",
    confirmBtn: "Zurücksetzen",

    emailTitle: "E-Mail erstellen",
    emailSubjectLabel: "Betreff",
    emailTemplateLabel: "Vorlage",
    emailPlaceholdersHint:
      "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
    openMailBtn: "Mail-App öffnen",
    emailPreviewLabel: "Vorschau",

    reminderTitle: "Erinnerungen (Batch)",
    reminderModeLabel: "Kriterium",
    reminderBelowTarget: "Unter Ziel",
    reminderNegativeOnly: "Nur negativ",
    reminderActiveOnly: "Nur aktive Familien",
    reminderHint:
      "Platzhalter: {{parents}}, {{children}}, {{balance}}, {{due}}, {{target}}, {{email}}, {{today}}",
    copyAllBtn: "Alle kopieren",
    openNextBtn: "Nächste E-Mail öffnen",
    reminderListLabel: "Empfänger:innen",

    reportTitle: "Übersicht",
    printBtn: "Drucken / PDF",

    btnEdit: "Bearbeiten",
    btnDelete: "Löschen",
    btnDeactivate: "Inaktiv",
    btnActivate: "Aktiv",
    btnEmail: "E-Mail",
    btnReport: "Report",

    errAmountInvalid: "Bitte einen gültigen Betrag > 0 eingeben.",
    errFamilyMissing: "Bitte eine Familie auswählen.",
    errNoParticipants: "Bitte mindestens eine Familie auswählen.",
    errEmailInvalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
    errFamilyNameRequired: "Bitte mindestens ein Kind oder einen Elternteil angeben.",
    errImportFailed: "Import fehlgeschlagen: ungültige Datei.",
    errEmailMissing: "Keine E-Mail-Adresse hinterlegt.",
    errTargetMissing: "Bitte zuerst einen Zielbetrag setzen.",
    errFamilyNotActiveForDate: "Familie ist für dieses Datum nicht aktiv.",
    confirmDeleteFamily: "Familie wirklich löschen?",
    confirmDeactivateInstead:
      "Diese Familie hat bereits Buchungen. Statt Löschen wird sie deaktiviert. OK?",
    uiNoEligibleFamilies: "Keine passenden Familien für dieses Datum.",
    uiExportFilename: "klassenkasse-export.json",

    emailDefaultSubject: "Klassenkasse — kurzer Hinweis",
    emailDefaultTemplate:
      "Hallo {{parents}},\n\nkurzer Hinweis zur Klassenkasse:\n\nKinder: {{children}}\nAktueller Saldo: {{balance}}\nZiel: {{target}}\nFehlt noch: {{due}}\n\nViele Grüße\n",
  },
};

function normalizeLang(v) {
  return v === "de" ? "de" : "en";
}
function t(key) {
  const lang = normalizeLang(state.lang);
  return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || key;
}

/* ---------------- utils ---------------- */
const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

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
  const lang = normalizeLang(state.lang);
  return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format((cents || 0) / 100);
}
function isValidEmail(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function clampStr(s, n) {
  return String(s || "").slice(0, n);
}
function parseChildrenInput(v) {
  const raw = String(v || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);
}

/* ---------------- state ---------------- */
function defaultState() {
  return {
    version: 13,
    lang: "de",
    theme: "minimal",
    targetCents: 0,
    families: [],
    tx: [],
    expenses: [],
    // optional template storage (kept for compatibility / future)
    emailTemplateByLang: undefined,
    reminderTemplateByLang: undefined,
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

    return {
      ...base,
      ...parsed,
      lang,
      theme,
      targetCents,
      families: families.map((f) => ({
        id: f.id || uid(),
        parent1: clampStr(f.parent1, 60),
        parent2: clampStr(f.parent2, 60),
        email: clampStr(f.email, 120),
        children: Array.isArray(f.children) ? f.children.filter(Boolean).map((x) => clampStr(x, 60)) : [],
        active: typeof f.active === "boolean" ? f.active : true,
        createdAt: Number.isFinite(f.createdAt) ? f.createdAt : Date.now(),

        // NEW fields (backward compatible defaults)
        comment: clampStr(f.comment, 160),
        activeFromISO: typeof f.activeFromISO === "string" && f.activeFromISO ? f.activeFromISO : null,
        activeToISO: typeof f.activeToISO === "string" && f.activeToISO ? f.activeToISO : null,
      })),
      tx: tx.map((t) => ({
        id: t.id || uid(),
        type: t.type === "allocation" ? "allocation" : "deposit",
        familyId: typeof t.familyId === "string" ? t.familyId : "",
        centsSigned: Number.isFinite(t.centsSigned) ? t.centsSigned : 0,
        dateISO: typeof t.dateISO === "string" ? t.dateISO : todayISO(),
        note: clampStr(t.note, 120),
        createdAt: Number.isFinite(t.createdAt) ? t.createdAt : Date.now(),
        expenseId: typeof t.expenseId === "string" ? t.expenseId : null,
      })),
      expenses: expenses.map((e) => ({
        id: e.id || uid(),
        title: clampStr(e.title, 80),
        totalCents: Number.isFinite(e.totalCents) ? e.totalCents : 0,
        dateISO: typeof e.dateISO === "string" ? e.dateISO : todayISO(),
        participantIds: Array.isArray(e.participantIds) ? e.participantIds.filter(Boolean) : [],
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

/* ---------------- DOM ---------------- */
const el = (id) => document.getElementById(id);

const els = {
  // header
  lang: el("lang"),
  theme: el("theme"),
  reminderBtn: el("reminderBtn"),
  exportBtn: el("exportBtn"),
  importInput: el("importInput"),
  resetBtn: el("resetBtn"),

  // summary
  totalBalance: el("totalBalance"),
  familiesCount: el("familiesCount"),
  txCount: el("txCount"),

  // settings
  targetAmount: el("targetAmount"),

  // deposit
  depositDate: el("depositDate"),
  depositFamily: el("depositFamily"),
  depositAmount: el("depositAmount"),
  depositNote: el("depositNote"),
  addDepositBtn: el("addDepositBtn"),

  // expense
  expenseDate: el("expenseDate"),
  expenseTitle: el("expenseTitle"),
  expenseAmount: el("expenseAmount"),
  expenseFamilyChecklist: el("expenseFamilyChecklist"),
  expenseAllHint: el("expenseAllHint"),
  addExpenseBtn: el("addExpenseBtn"),

  // family form
  familyFormDetails: el("familyFormDetails"),
  parent1: el("parent1"),
  parent2: el("parent2"),
  email: el("email"),
  children: el("children"),
  activeFrom: el("activeFrom"),
  activeTo: el("activeTo"),
  familyNote: el("familyNote"),
  addFamilyBtn: el("addFamilyBtn"),

  // lists
  familiesList: el("familiesList"),
  ledger: el("ledger"),
  emptyState: el("emptyState"),

  // dialogs
  exportDialog: el("exportDialog"),
  exportText: el("exportText"),
  closeExport: el("closeExport"),
  copyExport: el("copyExport"),
  downloadExport: el("downloadExport"),

  confirmDialog: el("confirmDialog"),
  closeConfirm: el("closeConfirm"),
  cancelReset: el("cancelReset"),
  confirmReset: el("confirmReset"),

  emailDialog: el("emailDialog"),
  closeEmail: el("closeEmail"),
  emailSubject: el("emailSubject"),
  emailTemplate: el("emailTemplate"),
  emailPreview: el("emailPreview"),
  copyEmail: el("copyEmail"),
  openMailto: el("openMailto"),

  reminderDialog: el("reminderDialog"),
  closeReminder: el("closeReminder"),
  reminderMode: el("reminderMode"),
  reminderActiveOnly: el("reminderActiveOnly"),
  reminderSubject: el("reminderSubject"),
  reminderTemplate: el("reminderTemplate"),
  copyAllReminders: el("copyAllReminders"),
  openNextReminder: el("openNextReminder"),
  reminderCount: el("reminderCount"),
  reminderList: el("reminderList"),

  reportDialog: el("reportDialog"),
  closeReport: el("closeReport"),
  reportContent: el("reportContent"),
  copyReport: el("copyReport"),
  printReport: el("printReport"),
};

/* ---------------- i18n apply ---------------- */
function applyI18nToDOM() {
  const lang = normalizeLang(state.lang);
  document.documentElement.lang = lang;

  // text nodes
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const val = t(key);
    if (val && typeof val === "string") node.textContent = val;
  });

  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    const val = t(key);
    if (val && typeof val === "string") node.setAttribute("placeholder", val);
  });
}

/* ---------------- family helpers ---------------- */
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
function familyEligibleForDate(f, dateISO) {
  if (!f || !f.active) return false;
  if (f.activeFromISO && dateISO < f.activeFromISO) return false;
  if (f.activeToISO && dateISO > f.activeToISO) return false;
  return true;
}

/* ---------------- balances ---------------- */
function calcBalances() {
  const byFamily = new Map(state.families.map((f) => [f.id, 0]));
  let total = 0;
  for (const tx of state.tx) {
    if (!tx.familyId) continue;
    if (!byFamily.has(tx.familyId)) continue;
    const next = (byFamily.get(tx.familyId) || 0) + (tx.centsSigned || 0);
    byFamily.set(tx.familyId, next);
    total += tx.centsSigned || 0;
  }
  return { byFamily, total };
}
function dueCents(balanceCents) {
  if (!state.targetCents || state.targetCents <= 0) return 0;
  return Math.max(0, state.targetCents - (balanceCents || 0));
}

/* ---------------- selection: expense checklist ---------------- */
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
function ensureExpensePreselectAll(dateISO) {
  if (lastExpenseDateISO !== dateISO) {
    expenseSelection = new Set(eligibleFamiliesForExpenseDate(dateISO).map((f) => f.id));
    lastExpenseDateISO = dateISO;
  } else {
    const eligibleIds = new Set(eligibleFamiliesForExpenseDate(dateISO).map((f) => f.id));
    expenseSelection.forEach((id) => {
      if (!eligibleIds.has(id)) expenseSelection.delete(id);
    });
    eligibleIds.forEach((id) => {
      if (!expenseSelection.has(id)) expenseSelection.add(id);
    });
  }
}

function renderExpenseChecklist() {
  if (!els.expenseFamilyChecklist) return;

  const dateISO = currentExpenseDateISO();
  ensureExpensePreselectAll(dateISO);
  const fams = eligibleFamiliesForExpenseDate(dateISO);

  els.expenseFamilyChecklist.innerHTML = "";

  if (els.expenseAllHint) {
    els.expenseAllHint.hidden = fams.length === 0;
    // text set by i18n, but also keep safe:
    els.expenseAllHint.textContent = t("expenseAllHint");
  }

  if (fams.length === 0) {
    const div = document.createElement("div");
    div.className = "muted";
    div.textContent = t("uiNoEligibleFamilies");
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

    const title = document.createElement("div");
    title.className = "checkItem__title";
    title.textContent = familyDisplayName(f);

    const sub = document.createElement("div");
    sub.className = "checkItem__sub";
    const bits = [];
    if (f.comment) bits.push(f.comment);
    if (f.activeFromISO || f.activeToISO) bits.push(`${f.activeFromISO || "…"} → ${f.activeToISO || "…"} `);
    sub.textContent = bits.join(" · ");

    main.appendChild(title);
    if (sub.textContent) main.appendChild(sub);

    row.appendChild(cb);
    row.appendChild(main);

    els.expenseFamilyChecklist.appendChild(row);
  }
}

/* ---------------- dropdown filtered by date ---------------- */
function renderDepositFamilyPicker() {
  if (!els.depositFamily) return;
  const dateISO = (els.depositDate?.value || "").trim() || todayISO();

  const fams = state.families
    .filter((f) => familyEligibleForDate(f, dateISO))
    .slice()
    .sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));

  const prev = els.depositFamily.value;
  els.depositFamily.innerHTML = "";

  for (const f of fams) {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = familyDisplayName(f);
    els.depositFamily.appendChild(opt);
  }

  // restore selection if still present
  if (prev && fams.some((f) => f.id === prev)) els.depositFamily.value = prev;
}

/* ---------------- split helper ---------------- */
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

/* ---------------- actions: deposit / expense / family ---------------- */
function addDeposit() {
  const dateISO = (els.depositDate?.value || "").trim() || todayISO();
  const familyId = String(els.depositFamily?.value || "");
  if (!familyId) return alert(t("errFamilyMissing"));

  const fam = familyById(familyId);
  if (!fam || !familyEligibleForDate(fam, dateISO)) return alert(t("errFamilyNotActiveForDate"));

  const cents = centsFromPositiveInput(els.depositAmount?.value);
  if (!cents) return alert(t("errAmountInvalid"));

  const note = clampStr(els.depositNote?.value, 120).trim();

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

  if (els.depositAmount) els.depositAmount.value = "";
  if (els.depositNote) els.depositNote.value = "";

  saveState();
  renderAll();
}

function addExpenseSplit() {
  const dateISO = currentExpenseDateISO();
  const title = clampStr(els.expenseTitle?.value, 80).trim() || t("classExpenseTitle");
  const totalCents = centsFromPositiveInput(els.expenseAmount?.value);
  if (!totalCents) return alert(t("errAmountInvalid"));

  const eligibleSet = new Set(eligibleFamiliesForExpenseDate(dateISO).map((f) => f.id));
  const participantIds = Array.from(expenseSelection).filter((id) => eligibleSet.has(id));
  if (participantIds.length === 0) return alert(t("errNoParticipants"));

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

  // reset selection on next expense
  expenseSelection.clear();
  lastExpenseDateISO = null;

  if (els.expenseTitle) els.expenseTitle.value = "";
  if (els.expenseAmount) els.expenseAmount.value = "";

  saveState();
  renderAll();
}

function addFamilyFromForm() {
  const parent1 = clampStr(els.parent1?.value, 60).trim();
  const parent2 = clampStr(els.parent2?.value, 60).trim();
  const email = clampStr(els.email?.value, 120).trim();
  const children = parseChildrenInput(els.children?.value || "");

  const activeFromISO = (els.activeFrom?.value || "").trim() || null;
  const activeToISO = (els.activeTo?.value || "").trim() || null;
  const comment = clampStr(els.familyNote?.value, 160).trim();

  if (!parent1 && !parent2 && children.length === 0) return alert(t("errFamilyNameRequired"));
  if (email && !isValidEmail(email)) return alert(t("errEmailInvalid"));

  state.families.push({
    id: uid(),
    parent1,
    parent2,
    email,
    children,
    active: true,
    comment,
    activeFromISO,
    activeToISO,
    createdAt: Date.now(),
  });

  // clear
  if (els.parent1) els.parent1.value = "";
  if (els.parent2) els.parent2.value = "";
  if (els.email) els.email.value = "";
  if (els.children) els.children.value = "";
  if (els.activeFrom) els.activeFrom.value = "";
  if (els.activeTo) els.activeTo.value = "";
  if (els.familyNote) els.familyNote.value = "";
  if (els.familyFormDetails) els.familyFormDetails.open = false;

  saveState();
  renderAll();
}

function editFamilyPrompt(familyId) {
  const f = familyById(familyId);
  if (!f) return;

  const kids = prompt(state.lang === "de" ? "Kinder (Komma-getrennt)" : "Children (comma-separated)", (f.children || []).join(", "));
  if (kids === null) return;

  const p1 = prompt(state.lang === "de" ? "Elternteil 1" : "Parent 1", f.parent1 || "");
  if (p1 === null) return;

  const p2 = prompt(state.lang === "de" ? "Elternteil 2 (optional)" : "Parent 2 (optional)", f.parent2 || "");
  if (p2 === null) return;

  const em = prompt(state.lang === "de" ? "E-Mail (optional)" : "Email (optional)", f.email || "");
  if (em === null) return;
  if (em && !isValidEmail(em)) return alert(t("errEmailInvalid"));

  const from = prompt(
    state.lang === "de" ? "In Klasse ab (YYYY-MM-DD, optional)" : "In class from (YYYY-MM-DD, optional)",
    f.activeFromISO || ""
  );
  if (from === null) return;

  const to = prompt(
    state.lang === "de" ? "In Klasse bis (YYYY-MM-DD, optional)" : "In class until (YYYY-MM-DD, optional)",
    f.activeToISO || ""
  );
  if (to === null) return;

  const note = prompt(state.lang === "de" ? "Kommentar (optional)" : "Comment (optional)", f.comment || "");
  if (note === null) return;

  const newChildren = parseChildrenInput(kids);
  const newP1 = clampStr(p1, 60).trim();
  const newP2 = clampStr(p2, 60).trim();

  if (newChildren.length === 0 && !newP1 && !newP2) return alert(t("errFamilyNameRequired"));

  f.children = newChildren;
  f.parent1 = newP1;
  f.parent2 = newP2;
  f.email = clampStr(em, 120).trim();
  f.activeFromISO = String(from).trim() || null;
  f.activeToISO = String(to).trim() || null;
  f.comment = clampStr(note, 160).trim();

  saveState();
  renderAll();
}

function deleteFamilyIfPossible(familyId) {
  const hasTx = state.tx.some((t) => t.familyId === familyId);
  const isInExpense = state.expenses.some((e) => (e.participantIds || []).includes(familyId));

  if (hasTx || isInExpense) {
    const ok = confirm(t("confirmDeactivateInstead"));
    if (!ok) return;
    const f = familyById(familyId);
    if (f) f.active = false;
    saveState();
    renderAll();
    return;
  }

  const ok = confirm(t("confirmDeleteFamily"));
  if (!ok) return;

  state.families = state.families.filter((f) => f.id !== familyId);
  saveState();
  renderAll();
}

/* ---------------- render: summary / families / ledger ---------------- */
function renderSummary() {
  const { total } = calcBalances();
  if (els.totalBalance) els.totalBalance.textContent = formatEUR(total);
  if (els.familiesCount) els.familiesCount.textContent = String(state.families.length);
  if (els.txCount) els.txCount.textContent = String(state.tx.length);

  if (els.totalBalance) {
    els.totalBalance.style.color = total < 0 ? "var(--neg)" : total > 0 ? "var(--pos)" : "var(--text)";
  }
}

function renderFamilies() {
  if (!els.familiesList) return;

  const { byFamily } = calcBalances();
  const fams = state.families.slice().sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));

  els.familiesList.innerHTML = "";

  for (const f of fams) {
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

    const right = document.createElement("div");
    const amt = document.createElement("div");
    amt.className = "amount " + (bal < 0 ? "neg" : bal > 0 ? "pos" : "");
    amt.textContent = formatEUR(bal);
    right.appendChild(amt);

    if (state.targetCents > 0 && due > 0) {
      const dueLine = document.createElement("div");
      dueLine.className = "familySmall";
      dueLine.style.marginTop = "6px";
      dueLine.style.color = "var(--neg)";
      dueLine.textContent = `${state.lang === "de" ? "Fehlt noch" : "Due"}: ${formatEUR(due)}`;
      right.appendChild(dueLine);
    }

    top.appendChild(meta);
    top.appendChild(right);

    const actions = document.createElement("div");
    actions.className = "familyActions";

    const toggle = document.createElement("button");
    toggle.className = "btn";
    toggle.type = "button";
    toggle.textContent = f.active ? t("btnDeactivate") : t("btnActivate");
    toggle.addEventListener("click", () => {
      f.active = !f.active;
      saveState();
      renderAll();
    });

    const edit = document.createElement("button");
    edit.className = "btn";
    edit.type = "button";
    edit.textContent = t("btnEdit");
    edit.addEventListener("click", () => editFamilyPrompt(f.id));

    const emailBtn = document.createElement("button");
    emailBtn.className = "btn";
    emailBtn.type = "button";
    emailBtn.textContent = t("btnEmail");
    emailBtn.addEventListener("click", () => openEmailDialogForFamily(f.id));

    const reportBtn = document.createElement("button");
    reportBtn.className = "btn";
    reportBtn.type = "button";
    reportBtn.textContent = t("btnReport");
    reportBtn.addEventListener("click", () => openReportForFamily(f.id));

    const del = document.createElement("button");
    del.className = "btn btn--danger";
    del.type = "button";
    del.textContent = t("btnDelete");
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

function renderLedger() {
  if (!els.ledger) return;

  const items = [];
  for (const tx of state.tx) {
    if (tx.type === "deposit") items.push({ kind: "deposit", dateISO: tx.dateISO, createdAt: tx.createdAt, tx });
  }
  for (const ex of state.expenses) {
    items.push({ kind: "expense", dateISO: ex.dateISO, createdAt: ex.createdAt, ex });
  }
  items.sort((a, b) => b.dateISO.localeCompare(a.dateISO) || b.createdAt - a.createdAt);

  els.ledger.innerHTML = "";
  if (els.emptyState) els.emptyState.hidden = items.length !== 0;

  for (const it of items) {
    const row = document.createElement("div");
    row.className = "txRow";

    const title = document.createElement("div");
    title.className = "txTitle";

    const meta = document.createElement("div");
    meta.className = "txMeta";

    if (it.kind === "deposit") {
      const tx = it.tx;
      const f = familyById(tx.familyId);
      title.textContent = `${t("depositTitle")}: ${formatEUR(tx.centsSigned)} · ${familyDisplayName(f || {})}`;
      meta.textContent = `${t("dateLabel")}: ${tx.dateISO}${tx.note ? " · " + t("noteLabel") + ": " + tx.note : ""}`;
    } else {
      const ex = it.ex;
      const famCount = (ex.participantIds || []).length;
      title.textContent = `${t("classExpenseTitle")}: ${formatEUR(-ex.totalCents)} · ${ex.title || ""}`;
      meta.textContent =
        `${t("dateLabel")}: ${ex.dateISO} · ` +
        (state.lang === "de" ? `geteilt auf ${famCount} Familien` : `split across ${famCount} families`);
    }

    row.appendChild(title);
    row.appendChild(meta);
    els.ledger.appendChild(row);
  }
}

/* ---------------- target ---------------- */
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

/* ---------------- dialogs: export / reset / import ---------------- */
function exportPayload() {
  return {
    exportedAt: new Date().toISOString(),
    ...state,
  };
}

function openExportDialog() {
  const payload = exportPayload();
  const json = JSON.stringify(payload, null, 2);
  if (els.exportText) els.exportText.value = json;
  els.exportDialog?.showModal();
}

function downloadExport() {
  const payload = exportPayload();
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = t("uiExportFilename");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      ta.remove();
      return false;
    }
  }
}

function openResetDialog() {
  els.confirmDialog?.showModal();
}
function doReset() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  saveState();
  expenseSelection.clear();
  lastExpenseDateISO = null;
  els.confirmDialog?.close();
  renderAll();
}

function importJsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!parsed || typeof parsed !== "object") throw new Error("bad");

      // must at least contain arrays (back compat)
      if (!Array.isArray(parsed.families) || !Array.isArray(parsed.tx)) throw new Error("bad");

      const base = defaultState();

      // keep unknown fields, but ensure required ones exist
      const cleaned = {
        ...base,
        ...parsed,
        families: parsed.families,
        tx: parsed.tx,
        expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
        lang: normalizeLang(parsed.lang),
        theme: ["minimal", "paper"].includes(parsed.theme) ? parsed.theme : base.theme,
        targetCents:
          Number.isFinite(parsed.targetCents) && parsed.targetCents >= 0 ? parsed.targetCents : base.targetCents,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      state = loadState();

      expenseSelection.clear();
      lastExpenseDateISO = null;

      renderAll();
    } catch {
      alert(t("errImportFailed"));
    } finally {
      if (els.importInput) els.importInput.value = "";
    }
  };
  reader.readAsText(file);
}

/* ---------------- email dialog (single family) ---------------- */
let emailContextFamilyId = null;

function fillTemplate(template, family, balanceCents) {
  const parents = parentsText(family);
  const kids = childrenText(family) || "—";
  const balance = formatEUR(balanceCents);
  const target = state.targetCents > 0 ? formatEUR(state.targetCents) : "—";
  const due = state.targetCents > 0 ? formatEUR(dueCents(balanceCents)) : "—";
  const email = family?.email || "";
  const today = todayISO();

  return String(template || "")
    .replaceAll("{{parents}}", parents)
    .replaceAll("{{children}}", kids)
    .replaceAll("{{balance}}", balance)
    .replaceAll("{{due}}", due)
    .replaceAll("{{target}}", target)
    .replaceAll("{{email}}", email)
    .replaceAll("{{today}}", today);
}

function openEmailDialogForFamily(familyId) {
  const family = familyById(familyId);
  if (!family) return;

  const { byFamily } = calcBalances();
  const bal = byFamily.get(familyId) || 0;

  emailContextFamilyId = familyId;

  if (els.emailSubject) els.emailSubject.value = t("emailDefaultSubject");
  if (els.emailTemplate) els.emailTemplate.value = t("emailDefaultTemplate");

  updateEmailPreview();

  els.emailDialog?.showModal();
}

function updateEmailPreview() {
  if (!emailContextFamilyId) return;
  const family = familyById(emailContextFamilyId);
  if (!family) return;

  const { byFamily } = calcBalances();
  const bal = byFamily.get(emailContextFamilyId) || 0;

  const subject = String(els.emailSubject?.value || "").trim();
  const bodyTemplate = String(els.emailTemplate?.value || "");
  const body = fillTemplate(bodyTemplate, family, bal);

  if (els.emailPreview) els.emailPreview.textContent = body;

  // keep mailto payload accessible
  if (els.openMailto) {
    els.openMailto.disabled = !isValidEmail(family.email);
    els.openMailto.dataset.mailto = buildMailto(family.email, subject, body);
  }
}

function buildMailto(email, subject, body) {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject || "")}&body=${encodeURIComponent(body || "")}`;
}

/* ---------------- reminder batch dialog ---------------- */
let reminderQueue = [];
let reminderIndex = 0;

function buildReminderQueue() {
  const mode = els.reminderMode?.value || "below_target";
  const activeOnly = !!els.reminderActiveOnly?.checked;
  const dateISO = todayISO();

  const { byFamily } = calcBalances();

  // subject/template defaults
  if (els.reminderSubject && !els.reminderSubject.value) els.reminderSubject.value = t("emailDefaultSubject");
  if (els.reminderTemplate && !els.reminderTemplate.value) els.reminderTemplate.value = t("emailDefaultTemplate");

  const subject = String(els.reminderSubject?.value || "").trim();
  const template = String(els.reminderTemplate?.value || "");

  const fams = state.families
    .filter((f) => {
      if (!activeOnly) return true;
      return familyEligibleForDate(f, dateISO); // <- manuell aktiv + Zeitraum
    })
    .slice()
    .sort((a, b) => familyDisplayName(a).localeCompare(familyDisplayName(b)));

  const items = fams
    .map((f) => {
      const bal = byFamily.get(f.id) || 0;
      const due = dueCents(bal);
      return { f, bal, due };
    })
    .filter(({ bal, due }) => {
      if (mode === "negative_only") return bal < 0;
      // below_target
      if (!state.targetCents || state.targetCents <= 0) return false;
      return due > 0;
    })
    .map(({ f, bal, due }) => ({
      familyId: f.id,
      name: familyDisplayName(f),
      email: String(f.email || "").trim(),
      balanceCents: bal,
      dueCents: due,
      subject,
      body: fillTemplate(template, f, bal),
    }));

  reminderQueue = items;
  reminderIndex = 0;
}

function renderReminderList() {
  if (!els.reminderList) return;
  els.reminderList.innerHTML = "";

  for (const r of reminderQueue) {
    const item = document.createElement("div");
    item.className = "remItem";

    const top = document.createElement("div");
    top.className = "remItem__top";

    const name = document.createElement("div");
    name.className = "remItem__name";
    name.textContent = r.name;

    const meta = document.createElement("div");
    meta.className = "remItem__meta";
    meta.textContent = r.email || "—";

    const due = document.createElement("div");
    due.className = "remItem__due";
    due.textContent =
      state.targetCents > 0 ? formatEUR(r.dueCents) : formatEUR(Math.max(0, -r.balanceCents));

    top.appendChild(name);
    top.appendChild(meta);
    top.appendChild(due);

    item.appendChild(top);

    els.reminderList.appendChild(item);
  }

  if (els.reminderCount) {
    const n = reminderQueue.length;
    els.reminderCount.textContent =
      state.lang === "de" ? `${n} E-Mail(s) in der Liste` : `${n} email(s) in the list`;
  }
}

function openReminderDialog() {
  // if mode is below_target, ensure target exists
  const mode = els.reminderMode?.value || "below_target";
  if (mode === "below_target" && (!state.targetCents || state.targetCents <= 0)) {
    // still open dialog, but show a hint in count
    if (els.reminderCount) els.reminderCount.textContent = t("errTargetMissing");
  }

  // set defaults
  if (els.reminderSubject) els.reminderSubject.value = t("emailDefaultSubject");
  if (els.reminderTemplate) els.reminderTemplate.value = t("emailDefaultTemplate");

  buildReminderQueue();
  renderReminderList();

  els.reminderDialog?.showModal();
}

function copyAllReminders() {
  const blocks = reminderQueue.map((r) => {
    const header =
      state.lang === "de"
        ? `--- ${r.name} (${r.email || "keine E-Mail"}) ---`
        : `--- ${r.name} (${r.email || "no email"}) ---`;
    return `${header}\nSubject: ${r.subject}\n\n${r.body}\n`;
  });
  return copyTextToClipboard(blocks.join("\n"));
}

function openNextReminderEmail() {
  if (!reminderQueue.length) {
    buildReminderQueue();
    renderReminderList();
  }
  if (!reminderQueue.length) return;

  const idx = Math.min(reminderIndex, reminderQueue.length - 1);
  const r = reminderQueue[idx];
  reminderIndex = Math.min(reminderIndex + 1, reminderQueue.length);

  if (!r.email) return alert(t("errEmailMissing"));

  window.location.href = buildMailto(r.email, r.subject, r.body);
}

/* ---------------- report dialog (per family) ---------------- */
function openReportForFamily(familyId) {
  const family = familyById(familyId);
  if (!family) return;

  const { byFamily } = calcBalances();
  const bal = byFamily.get(familyId) || 0;

  // tx list for this family
  const txs = state.tx
    .filter((x) => x.familyId === familyId)
    .slice()
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO) || b.createdAt - a.createdAt);

  const due = dueCents(bal);

  const title = familyDisplayName(family);
  const subLines = [];
  if (childrenText(family)) subLines.push((state.lang === "de" ? "Kinder: " : "Children: ") + childrenText(family));
  if (parentsText(family) !== "—") subLines.push((state.lang === "de" ? "Eltern: " : "Parents: ") + parentsText(family));
  if (family.email) subLines.push(family.email);
  if (family.comment) subLines.push(family.comment);

  const rows = txs
    .map((x) => {
      const sign = x.centsSigned >= 0 ? "+" : "−";
      const amt = formatEUR(Math.abs(x.centsSigned));
      const kind = x.type === "deposit" ? t("depositTitle") : (state.lang === "de" ? "Ausgabe-Anteil" : "Expense share");
      const note = x.note ? ` — ${x.note}` : "";
      return `<tr><td>${x.dateISO}</td><td>${kind}${note}</td><td style="text-align:right">${sign} ${amt}</td></tr>`;
    })
    .join("");

  const targetLine =
    state.targetCents > 0
      ? `<div><strong>${state.lang === "de" ? "Ziel" : "Target"}:</strong> ${formatEUR(state.targetCents)} &nbsp; · &nbsp; <strong>${
          state.lang === "de" ? "Fehlt noch" : "Due"
        }:</strong> ${formatEUR(due)}</div>`
      : "";

  const html = `
    <h3 style="margin-top:0">${escapeHtml(title)}</h3>
    <div style="margin-bottom:10px; color: var(--muted)">${escapeHtml(subLines.join(" · "))}</div>
    <div><strong>${state.lang === "de" ? "Saldo" : "Balance"}:</strong> ${formatEUR(bal)}</div>
    ${targetLine}
    <hr class="hr" />
    <table>
      <thead>
        <tr>
          <th>${t("dateLabel")}</th>
          <th>${state.lang === "de" ? "Eintrag" : "Entry"}</th>
          <th style="text-align:right">${state.lang === "de" ? "Betrag" : "Amount"}</th>
        </tr>
      </thead>
      <tbody>${rows || `<tr><td colspan="3" class="muted">${t("emptyState")}</td></tr>`}</tbody>
    </table>
  `;

  if (els.reportContent) els.reportContent.innerHTML = html;
  els.reportDialog?.showModal();

  // store current report for copy
  els.reportDialog.dataset.currentReportText = reportAsText(title, subLines, bal, due, txs);
}

function reportAsText(title, subLines, bal, due, txs) {
  const lines = [];
  lines.push(title);
  if (subLines.length) lines.push(subLines.join(" · "));
  lines.push("");
  lines.push(`${state.lang === "de" ? "Saldo" : "Balance"}: ${formatEUR(bal)}`);
  if (state.targetCents > 0) {
    lines.push(`${state.lang === "de" ? "Ziel" : "Target"}: ${formatEUR(state.targetCents)}`);
    lines.push(`${state.lang === "de" ? "Fehlt noch" : "Due"}: ${formatEUR(due)}`);
  }
  lines.push("");
  lines.push(state.lang === "de" ? "Historie:" : "History:");
  for (const x of txs) {
    const sign = x.centsSigned >= 0 ? "+" : "-";
    const kind = x.type === "deposit" ? t("depositTitle") : (state.lang === "de" ? "Ausgabe-Anteil" : "Expense share");
    lines.push(`${x.dateISO} · ${kind}${x.note ? " · " + x.note : ""} · ${sign}${formatEUR(Math.abs(x.centsSigned))}`);
  }
  return lines.join("\n");
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ---------------- theme/lang ---------------- */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
}

/* ---------------- render all ---------------- */
function renderAll() {
  // set selectors
  if (els.lang) els.lang.value = state.lang;
  if (els.theme) els.theme.value = state.theme;

  applyTheme();
  applyI18nToDOM();

  if (els.depositDate && !els.depositDate.value) els.depositDate.value = todayISO();
  if (els.expenseDate && !els.expenseDate.value) els.expenseDate.value = todayISO();

  renderTargetInput();
  renderDepositFamilyPicker();
  renderExpenseChecklist();

  renderSummary();
  renderFamilies();
  renderLedger();

  // keep previews up to date if dialog open
  if (els.emailDialog?.open) updateEmailPreview();
  if (els.reminderDialog?.open) {
    buildReminderQueue();
    renderReminderList();
  }
}

/* ---------------- bindings ---------------- */
if (els.lang) {
  els.lang.addEventListener("change", () => {
    state.lang = normalizeLang(els.lang.value);
    saveState();
    renderAll();
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

if (els.depositDate) els.depositDate.addEventListener("change", renderDepositFamilyPicker);
if (els.addDepositBtn) els.addDepositBtn.addEventListener("click", addDeposit);
if (els.depositAmount) {
  els.depositAmount.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addDeposit();
  });
}

if (els.expenseDate) {
  els.expenseDate.addEventListener("change", () => {
    lastExpenseDateISO = null;
    renderExpenseChecklist();
  });
}
if (els.addExpenseBtn) els.addExpenseBtn.addEventListener("click", addExpenseSplit);
if (els.expenseAmount) {
  els.expenseAmount.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addExpenseSplit();
  });
}

if (els.addFamilyBtn) els.addFamilyBtn.addEventListener("click", addFamilyFromForm);

/* export dialog */
if (els.exportBtn) els.exportBtn.addEventListener("click", openExportDialog);
if (els.closeExport) els.closeExport.addEventListener("click", () => els.exportDialog?.close());
if (els.copyExport) els.copyExport.addEventListener("click", () => copyTextToClipboard(els.exportText?.value || ""));
if (els.downloadExport) els.downloadExport.addEventListener("click", downloadExport);

/* import */
if (els.importInput) {
  els.importInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importJsonFile(file);
  });
}

/* reset dialog */
if (els.resetBtn) els.resetBtn.addEventListener("click", openResetDialog);
if (els.closeConfirm) els.closeConfirm.addEventListener("click", () => els.confirmDialog?.close());
if (els.cancelReset) els.cancelReset.addEventListener("click", () => els.confirmDialog?.close());
if (els.confirmReset) els.confirmReset.addEventListener("click", doReset);

/* email dialog */
if (els.closeEmail) els.closeEmail.addEventListener("click", () => els.emailDialog?.close());
if (els.emailSubject) els.emailSubject.addEventListener("input", updateEmailPreview);
if (els.emailTemplate) els.emailTemplate.addEventListener("input", updateEmailPreview);
if (els.copyEmail) {
  els.copyEmail.addEventListener("click", () => copyTextToClipboard(els.emailPreview?.textContent || ""));
}
if (els.openMailto) {
  els.openMailto.addEventListener("click", () => {
    const url = els.openMailto.dataset.mailto;
    if (!url) return alert(t("errEmailMissing"));
    window.location.href = url;
  });
}

/* reminder dialog */
if (els.reminderBtn) els.reminderBtn.addEventListener("click", openReminderDialog);
if (els.closeReminder) els.closeReminder.addEventListener("click", () => els.reminderDialog?.close());
if (els.reminderMode) els.reminderMode.addEventListener("change", () => { buildReminderQueue(); renderReminderList(); });
if (els.reminderActiveOnly) els.reminderActiveOnly.addEventListener("change", () => { buildReminderQueue(); renderReminderList(); });
if (els.reminderSubject) els.reminderSubject.addEventListener("input", () => { buildReminderQueue(); renderReminderList(); });
if (els.reminderTemplate) els.reminderTemplate.addEventListener("input", () => { buildReminderQueue(); renderReminderList(); });
if (els.copyAllReminders) els.copyAllReminders.addEventListener("click", copyAllReminders);
if (els.openNextReminder) els.openNextReminder.addEventListener("click", openNextReminderEmail);

/* report dialog */
if (els.closeReport) els.closeReport.addEventListener("click", () => els.reportDialog?.close());
if (els.copyReport) {
  els.copyReport.addEventListener("click", () => {
    const txt = els.reportDialog?.dataset.currentReportText || "";
    copyTextToClipboard(txt);
  });
}
if (els.printReport) {
  els.printReport.addEventListener("click", () => {
    // simplest: print whole page, but user will see modal content
    window.print();
  });
}

/* ---------------- init ---------------- */
(function init() {
  // url override
  const urlLang = new URLSearchParams(location.search).get("lang");
  if (urlLang) state.lang = normalizeLang(urlLang);

  // apply persisted theme attribute
  applyTheme();

  // initial i18n
  applyI18nToDOM();

  renderAll();
})();
