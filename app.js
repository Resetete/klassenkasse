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

function normalizeLang(lang) {
  return lang === "de" ? "de" : "en";
}
function dict() {
  return I18N[normalizeLang(state?.lang || "en")] || I18N.en;
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

    // NEW: expense selection mode (backward compatible default)
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

    const expenseSelectMode = parsed.expenseSelectMode === "custom" ? "custom" : "all";

    return {
      ...base,
      ...parsed,
      lang,
      theme,
      targetCents,
      expenseSelectMode,
      families: families.map((f) => ({
        id: f.id || uid(),
        parent1: typeof f.parent1 === "string" ? f.parent1.slice(0, 60) : "",
        parent2: typeof f.parent2 === "string" ? f.parent2.slice(0, 60) : "",
        email: typeof f.email === "string" ? f.email.slice(0, 120) : "",
        children: Array.isArray(f.children) ? f.children.filter(Boolean).map((x) => String(x).slice(0, 60)) : [],
        active: typeof f.active === "boolean" ? f.active : true,
        createdAt: Number.isFinite(f.createdAt) ? f.createdAt : Date.now(),

        comment: typeof f.comment === "string" ? f.comment.slice(0, 160) : "",
        activeFromISO: typeof f.activeFromISO === "string" && f.activeFromISO ? f.activeFromISO : null,
        activeToISO: typeof f.activeToISO === "string" && f.activeToISO ? f.activeToISO : null,
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

  totalBalance: document.getElementById("totalBalance"),
  familiesCount: document.getElementById("familiesCount"),
  txCount: document.getElementById("txCount"),

  targetAmount: document.getElementById("targetAmount"),

  depositDate: document.getElementById("depositDate"),
  depositFamily: document.getElementById("depositFamily"),
  depositAmount: document.getElementById("depositAmount"),
  depositNote: document.getElementById("depositNote"),
  addDepositBtn: document.getElementById("addDepositBtn"),

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

  // NEW: family report dialog (already in your index.html)
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

/** ---------- balances ---------- **/
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

/** =========================================================
    NEW: FAMILY OVERVIEW POPUP (reportDialog)
    ========================================================= */
let currentReportFamilyId = null;

function familyTxItems(familyId) {
  const items = [];
  for (const t of state.tx) {
    if (t.familyId !== familyId) continue;

    if (t.type === "deposit") {
      items.push({
        kind: "deposit",
        dateISO: t.dateISO,
        createdAt: t.createdAt || 0,
        title: state.lang === "de" ? "Einzahlung" : "Contribution",
        amountCentsSigned: t.centsSigned || 0,
      });
    } else {
      let expenseTitle = "";
      if (t.expenseId) {
        const e = state.expenses.find((x) => x.id === t.expenseId);
        if (e) expenseTitle = e.title || "";
      }
      items.push({
        kind: "allocation",
        dateISO: t.dateISO,
        createdAt: t.createdAt || 0,
        title: (state.lang === "de" ? "Ausgabe" : "Expense") + (expenseTitle ? `: ${expenseTitle}` : ""),
        amountCentsSigned: t.centsSigned || 0, // negative
      });
    }
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

  const { deposits, expenses, balance } = calcFamilyTotals(familyId);
  const due = dueCents(balance);

  const lines = [];
  lines.push(`${familyDisplayName(f)}`);
  lines.push(`Saldo: ${formatEUR(balance)}`);
  if (state.targetCents > 0) lines.push(`Ziel: ${formatEUR(state.targetCents)} · Fehlt: ${formatEUR(due)}`);
  lines.push(`Einzahlungen: ${formatEUR(deposits)}`);
  lines.push(`Ausgaben (Anteile): ${formatEUR(expenses)}`);
  lines.push("");
  lines.push("Buchungen:");
  for (const it of familyTxItems(familyId)) {
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
        ${rows || `<tr><td colspan="3" class="muted">${escapeHtml(state.lang === "de" ? "Keine Buchungen." : "No transactions.")}</td></tr>`}
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
  const { total } = calcBalances();
  if (els.totalBalance) els.totalBalance.textContent = formatEUR(total);
  if (els.familiesCount) els.familiesCount.textContent = String(state.families.length);
  if (els.txCount) els.txCount.textContent = String(state.tx.length);

  if (els.totalBalance) {
    els.totalBalance.style.color = total < 0 ? "var(--neg)" : total > 0 ? "var(--pos)" : "var(--text)";
  }
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
      const t = it.tx;
      const f = familyById(t.familyId);
      title.textContent = `${d.labels.deposit}: ${formatEUR(t.centsSigned)} · ${familyDisplayName(f || {})}`;
      meta.textContent = `${d.labels.date}: ${t.dateISO}${t.note ? " · " + d.labels.note + ": " + t.note : ""}`;
    } else {
      const e = it.expense;
      const famCount = (e.participantIds || []).length;
      title.textContent = `${d.labels.expense}: ${formatEUR(-e.totalCents)} · ${e.title || d.defaults.expenseTitle}`;
      meta.textContent = `${d.labels.date}: ${e.dateISO} · ${state.lang === "de" ? "geteilt auf" : "split across"} ${famCount} ${
        state.lang === "de" ? "Familien" : "families"
      }`;
    }

    row.appendChild(title);
    row.appendChild(meta);
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

  const newFrom = String(from).trim();
  const newTo = String(to).trim();

  f.children = newChildren;
  f.parent1 = newP1;
  f.parent2 = newP2;
  f.email = String(em).trim().slice(0, 120);
  f.activeFromISO = newFrom ? newFrom : null;
  f.activeToISO = newTo ? newTo : null;
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

/** ---------- Expenses ---------- **/
function addExpenseSplit() {
  const d = dict();

  const dateISO = currentExpenseDateISO();
  const title = String(els.expenseTitle?.value || "").trim().slice(0, 80) || d.defaults.expenseTitle;
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

/** ---------- Export / Import / Reset ---------- **/
function exportJsonDownload() {
  const d = dict();
  const payload = { exportedAt: new Date().toISOString(), ...state };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = d.ui.exportFilename;
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

function renderAll() {
  applyLang();
  applyTheme();

  if (els.lang) els.lang.value = state.lang;
  if (els.theme) els.theme.value = state.theme;

  if (els.depositDate && !els.depositDate.value) els.depositDate.value = todayISO();
  if (els.expenseDate && !els.expenseDate.value) els.expenseDate.value = todayISO();

  renderTargetInput();
  renderDepositFamilyPicker();
  renderExpenseChecklist();

  renderSummary();
  renderFamilies();
  renderLedger();
}

/** ---------- Bindings ---------- **/
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

/** NEW: report dialog wiring */
if (els.closeReport) els.closeReport.addEventListener("click", closeFamilyReport);

if (els.reportDialog) {
  // click outside dialog closes (nice UX)
  els.reportDialog.addEventListener("click", (e) => {
    const rect = els.reportDialog.getBoundingClientRect();
    const inDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inDialog) closeFamilyReport();
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

if (els.exportBtn) els.exportBtn.addEventListener("click", exportJsonDownload);
if (els.importInput) {
  els.importInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importJsonFile(file);
  });
}
if (els.resetBtn) els.resetBtn.addEventListener("click", resetAll);

/** ---------- init ---------- **/
(function initFromUrl() {
  const urlLang = new URLSearchParams(location.search).get("lang");
  if (urlLang) state.lang = normalizeLang(urlLang);
})();
renderAll();
