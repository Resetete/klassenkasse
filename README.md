🇬🇧 English | 🇩🇪 [Deutsch](README.de.md)

# ClassFund / Klassenkasse

**ClassFund** is a free, privacy-friendly web app for managing class funds
(*“Klassenkasse”*), built for parents, classes, and schools.

No login. No cloud. No tracking.
All data is stored **locally in your browser**.

👉 Live app: https://www.classfund.app

---

## Features

- 👨‍👩‍👧 Family accounts with individual balances
- 💶 Record deposits (bank transfers, cash, etc.)
- 📤 Split class expenses fairly across selected families
- 📊 Automatic balance calculation per family
- 🏦 Bank reconciliation overview (deposits vs expenses)
- ⚠️ Duplicate booking detection
- 📩 Reminder emails (batch mode via mail client)
- 📁 Export & import (JSON backup)
- 📄 CSV export for bank statement comparison
- 🌍 German & English UI
- 🛡️ GDPR-friendly by design

---

## Privacy & Data Protection

- No user accounts
- No backend
- No cookies
- No tracking
- No data leaves your device

All data is stored in **localStorage** in your browser.

⚠️ Important:
Local browser storage can be deleted (e.g. clearing browser data, private mode,
changing devices).
**Please export backups regularly.**

---

## How the accounting works

- **Deposits**
  Money paid by families into the class fund

- **Expenses**
  Total class expenses (e.g. trips, materials, gifts)

- **Allocations**
  Each expense is split across selected families and recorded internally
  (used for per-family balances, not bank balance)

- **Bank balance**
  `Total deposits – total expenses`
  This should match your real bank account balance.

---

## Export & Backup

You can export all data at any time:

- **JSON export**
  Full backup (recommended before browser cleanup or device change)

- **CSV (bank) export**
  Deposits and expenses in bank-friendly format for reconciliation

---

## Reminder Emails

ClassFund can generate reminder emails:

- Select families below target or with negative balance
- Uses your local mail app (`mailto:`)
- No emails are sent automatically
- Fully editable templates

---

## Languages

- English 🇬🇧
- German 🇩🇪

Language can be switched directly in the app.

---

## Tech Stack

- Plain HTML, CSS, JavaScript
- No frameworks
- No build step
- Runs entirely in the browser

---

## License

MIT License

---

## Credits

Made with ❤️ in Berlin
by [Theresa Mannschatz](https://theresamannschatz.design)
