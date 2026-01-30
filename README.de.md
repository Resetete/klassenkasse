🇩🇪 Deutsch | 🇬🇧 [English](README.md)

# Klassenkasse / ClassFund

**Klassenkasse** (auch bekannt als **ClassFund**) ist eine **kostenlose, datenschutzfreundliche Web-App** zur Verwaltung von Klassenkassen, Elterninitiativen und Schulprojekten.

Die App läuft **vollständig im Browser**, benötigt **kein Login**, **keine Cloud** und speichert alle Daten **ausschließlich lokal** auf deinem Gerät.

👉 Ideal für Elternvertretungen, Klassenfahrten, Kitas, Schulen und freie Träger.

---

## Funktionen

### Ein- & Ausgaben
- Einzahlungen pro Familie erfassen (mit Datum, Kategorie & Notiz)
- Klassen-Ausgaben als **Gesamtbetrag** erfassen und **automatisch auf Familien aufteilen**
- Faire Cent-Rundung bei geteilten Ausgaben
- Jede Familie sieht ihren individuellen Saldo

### Transparente Abrechnung
- **Gesamtsaldo entspricht dem Bankkontostand**
- Separate Übersicht:
  - Einzahlungen (Bank)
  - Ausgaben (Bank)
  - Bank-Saldo
- Warnhinweise bei:
  - doppelten Buchungen
  - Buchungen ohne zugeordnete Familie (Historienfälle)

### Familienverwaltung
- Familien anlegen, bearbeiten, deaktivieren
- Aktive Zeiträume (z. B. Eintritt / Austritt aus der Klasse)
- Inaktive Familien bleiben in der Historie erhalten
- Klick auf eine Familie öffnet einen **Detailbericht** (Einzahlungen, Ausgaben, Saldo)

### Erinnerungen
- Automatische Erinnerungs-E-Mails (Batch-Modus)
- Filter:
  - unter Zielbetrag
  - nur negative Salden
  - nur aktive Familien
- Platzhalter für personalisierte Texte
- Versand über die eigene Mail-App (kein Server!)

### Export & Abgleich
- **JSON-Export** (Backup / Gerätewechsel)
- **CSV-Export für Bankabgleich**
  - Einzahlungen & Ausgaben in einer Datei
  - Ideal zum Abgleich mit Kontoauszügen (Excel, Numbers, LibreOffice)
- Import früherer Exporte mit Vorschau & Sicherheitswarnung

---

## Datenschutz & Sicherheit

- ❌ kein Login
- ❌ keine Cloud
- ❌ keine Server-Speicherung
- ✅ alles lokal im Browser (Local Storage)
- ✅ DSGVO-freundlich
- ✅ auch offline nutzbar

⚠️ **Wichtig:**
Lokaler Browserspeicher kann gelöscht werden (z. B. beim Browser-Reset oder Gerätewechsel).
👉 **Regelmäßig exportieren!**

---

## Wie funktioniert die Abrechnung?

- **Einzahlungen** erhöhen den Klassenkassen-Saldo
- **Ausgaben** werden:
  - einmal als Bank-Ausgabe erfasst
  - intern auf die beteiligten Familien verteilt
- Die App zeigt:
  - pro Familie den individuellen Saldo
  - im Überblick den **echten Bankkontostand**

So kannst du jederzeit prüfen:
> „Stimmt die App mit dem Konto überein?“

---

## Technik

- Reines **Vanilla JavaScript**
- HTML + CSS
- Keine Abhängigkeiten
- Keine Build-Tools
- Läuft auf GitHub Pages / jedem Static Host

---

## Nutzung

1. Seite im Browser öffnen
2. Familien anlegen
3. Einzahlungen & Ausgaben erfassen
4. Regelmäßig **Export** machen

Fertig 😊

---

## Lizenz

MIT License
© 2026 Theresa Mannschatz

---

## Motivation

Klassenkassen werden schnell unübersichtlich:
WhatsApp-Nachrichten, Barzahlungen, Excel-Tabellen.

**Klassenkasse / ClassFund** soll genau das vermeiden:
klar, transparent, fair – und ohne technischen Ballast.
