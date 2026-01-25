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
   ✓ Reminder "active only" can be implemented similarly (see note)
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

  // NEW: mode controls (add in HTML)
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

  // reset selection according to mode
  lastExpenseDateISO = null;
  expenseSelection.clear();
  renderExpenseChecklist();
}

function ensureExpenseSelection(dateISO) {
  const eligible = eligibleFamiliesForExpenseDate(dateISO);
  const eligibleIds = new Set(eligible.map((f) => f.id));

  // date changed -> rebuild default depending on mode
  if (lastExpenseDateISO !== dateISO) {
    if (state.expenseSelectMode === "all") {
      expenseSelection = new Set(eligible.map((f) => f.id)); // preselect all
    } else {
      expenseSelection = new Set(); // start empty
    }
    lastExpenseDateISO = dateISO;
    return;
  }

  // date unchanged -> keep current but drop invalid ids
  expenseSelection.forEach((id) => {
    if (!eligibleIds.has(id)) expenseSelection.delete(id);
  });

  // if mode=all, also auto-add newly eligible (e.g. you changed activeFrom/To)
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

  // hint text
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

  // sync UI mode controls if present
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
    toggle.textContent = f.active ? (state.lang === "de" ? "Inaktiv" : "Deactivate") : state.lang === "de" ? "Aktiv" : "Activate";
    toggle.addEventListener("click", () => {
      f.active = !f.active;
      saveState();
      // selection might change (eligibility)
      lastExpenseDateISO = null;
      renderAll();
    });

    actions.appendChild(toggle);

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

  // reset selection for next input according to mode
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

      // keep forward/back compatibility:
      // write raw imported state; loadState() will sanitize and fill defaults.
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

/** NEW: mode toggles */
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
