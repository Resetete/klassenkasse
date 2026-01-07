# Klassenkasse (Class Fund Manager)

**Klassenkasse** ist eine kleine, datenschutzfreundliche Web-App zur Verwaltung von Klassengeldern
(z. B. Bastelbeiträge, Ausflüge, Klassenfeste).

- Läuft **im Browser**  
- **Keine Registrierung**, kein Server, keine Datenbank  
- Daten bleiben lokal (LocalStorage) + **Import/Export (JSON)**  
- Familien-Saldo automatisch durch Ein-/Auszahlungen & Klassen-Ausgaben  
- E-Mail-Vorlagen erstellen (copy/paste in dein Mailprogramm)  
- Mehrsprachig: **Deutsch / English**

---

## Warum diese App?

In vielen Klassen werden Beiträge pro Kind/Familie eingesammelt und Ausgaben anteilig verteilt.
Oft passiert das in Zetteln, WhatsApp, Excel oder chaotischen Listen.

Diese App hilft dir:

- Familien + Kinder sauber zu verwalten (Kinder sind Labels; später können mehrere Kinder pro Familie kommen)
- einen **Saldo je Familie** zu führen (positiv/grün, negativ/rot)
- **Klassen-Ausgaben** fair zu verteilen (alle oder ausgewählte Kinder)
- **Übersichten** schnell zu exportieren / verschicken

---

## Features (v1.1)

### Verwaltung
- Familien (Primär) mit:
  - Elternnamen
  - E-Mail-Adresse
  - Kind-Label (pro Familie erstmal 1 Kind; erweiterbar)
  - Aktiv/Inaktiv (Inaktive erscheinen nicht in Dropdowns)
- Saldo-Anzeige pro Familie (farblich)

### Buchungen
- Einzahlungen (z. B. „20 € Bastelbeitrag“)
- Auszahlungen:
  - direkt für eine Familie oder
  - **Klassen-Ausgabe** (Gesamtbetrag wird auf ausgewählte Kinder/Familien verteilt)

### Reminder & Zielbetrag (v1.1)
- Optional: **Zielbetrag pro Kind/Familie** (z. B. 25 € fürs Halbjahr)
- Reminder-Batch: erzeugt Textvorschläge für Sammel-Mails an Familien, die noch offen sind

### Export / Import
- Export als **JSON** (vollständiges Backup)
- Import aus **JSON** 

### Datenschutz
- Die App speichert Daten nur lokal in deinem Browser (LocalStorage).
- Keine Server-Kommunikation, keine Cookies (außer LocalStorage).

---

## Installation / Nutzung

- go to `https://resetete.github.io/klassenkasse/`

---

## Hinweise zur Datensicherheit

- Daten liegen im Browser des Geräts, auf dem du arbeitest.
- Wenn du Browser-Daten löschst, sind sie weg → nutze **Export (JSON)** als Backup.
- Für echte „gemeinsame Online-Nutzung“ wäre ein Server nötig (nicht Ziel dieses Tools).

---

# Class Fund (English)

**Class Fund** is a small, privacy-friendly web app to manage class money
(e.g. craft supplies, field trips, class parties).

- Works in the browser  
- **No signup**, no backend, no database  
- **Local storage only** + **Import/Export (JSON & CSV)
- Family-based balances with deposits/withdrawals & shared class expenses  
- Email templates (copy/paste into your email client)  
- Languages: **German / English**

---

## Why?

Many classes collect small contributions per child/family and spend it on activities.
This tool replaces messy notes and spreadsheets with a clear, simple workflow.

---

## Usage

Go to: `https://resetete.github.io/klassenkasse/`

## Features (v1.1)

### Management
- Families (primary entity) with:
  - parent names
  - email address
  - child label (v1: one child per family; extensible)
  - active/inactive flag (inactive families won’t appear in class-expense dropdowns)
- Balance color indicators (green / red)

### Transactions
- Deposits (e.g. “€20 craft fee”)
- Withdrawals:
  - for one family, or
  - **class expense** split across selected children/families

### Target amount + Reminder Batch (v1.1)
- Optional target amount per child/family (e.g. €25 per term)
- Reminder batch: generates email text for families with outstanding balance

### Import / Export
- Export **JSON** (full backup)
- Import **JSON**

### Privacy
- Data stays in your browser (LocalStorage).

