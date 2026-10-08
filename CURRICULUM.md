# Odoo Functional Curriculum Architecture (Phase 0)

> **Status:** Phase 0–3 implemented (shell Dual-Layer + Wave 1 Deep Dive + Core Users/Closing).  
> **Target:** Odoo 19 Enterprise · Lab `http://172.16.2.123:8072` · DB `odoo`  
> **Pages:** `/silabus` (Core Flow) · `/materi` (Deep Dive) · `/kurikulum` (architecture map)

## Keputusan desain

1. **Pertahankan Core Flow 00–09** (slug & materi existing tidak dihapus).
2. Tambah **Layer B: Module Deep Dive** sebagai mini-course per aplikasi.
3. Sisipkan node Core baru: **Users & Access Rights** + **Closing/Reporting** (enrich, bukan mengganti).
4. Implementasi **bertahap per wave**; Wave 1 = modul yang sudah disentuh Core.
5. Screenshot = UI Odoo nyata; jika belum ada → `[SCREENSHOT REQUIRED]`.
6. Fitur tidak dicek di lab → `[VERIFY IN ODOO UI]` / `Not Available in Current Environment`.

## Layer A — Core Business Flow

| # | Node | Status | Existing slug |
|---|------|--------|---------------|
| 1 | Odoo Fundamentals | keep | `pengenalan` |
| 2 | Company & Localization | enrich | `setup-perusahaan` |
| 3 | Users & Access Rights | **add** | — |
| 4 | Contacts | keep | `master-contacts` |
| 5 | Accounting Foundations | keep | `master-accounting` |
| 6 | Products, WH & Locations | keep | `master-inventory` |
| 7 | Procure-to-Pay | keep | `flow-purchase` |
| 8 | Inventory Operations | enrich | `flow-inventory` |
| 9 | Order-to-Cash | keep | `flow-sales` |
| 10 | Invoicing, Payment & Reconciliation | keep | `flow-invoicing` |
| 11 | End-to-End Business Cycle | enrich | `flow-end-to-end` |
| 12 | Closing, Reporting & Analysis | **add** | — |

### Process chains

- **Setup:** Company → Users → Contacts → Accounting → Products/WH  
- **P2P:** Vendor → PO → Receipt → Bill → Payment → Accounting  
- **O2C:** Customer → SO → Delivery → Invoice → Payment → Accounting  
- **Retail E2E (Final Project):** full chain di atas + reports

## Layer B — Module Deep Dive

Setiap modul memakai template wajib:

Overview · Prerequisites · Installation · Complete Configuration · Master Data · Dependencies · Field docs · Procedures · Scenarios · Integration · Common Mistakes · Troubleshooting · Behind the Scene · Reporting · Security · Levels · Exercises · Real Screenshots

### Wave 1 (konten dulu)

Sales · Purchase · Inventory · Accounting/Invoicing · Contacts · Users & Access · Settings

### Wave 2

CRM · Manufacturing · Project · Timesheets · Employees · Website · eCommerce · Companies/Multi-company · Developer Mode (functional view) · Localization

### Wave 3+

POS · Subscriptions · HR suite · Helpdesk · Quality · Barcode · Marketing · dll. (verify/N/A di lab)

## Learning Paths

- **Path A — Flow First (pemula):** `/cara-pakai` → Core 00–09 → Deep Dive Sales  
- **Path B — Module Specialist:** Matrix → satu Deep Dive penuh → validasi E2E  
- **Path C — Consultant:** Core → Wave 1 → Security → Wave 2 → Final Project

## Gap terbesar hari ini

1. Tidak ada Deep Dive layer  
2. Users/Access Rights hampir absen  
3. Config depth What/Why/When/Impact belum standar  
4. Modul di luar Sales/Purchase/Inventory/Accounting belum ada  
5. Hub Integration / Reporting / Security / Exercises belum ada  
6. Screenshot Deep Dive belum di-capture dari lab `:8072`

## Phases

| Phase | Fokus |
|------:|-------|
| 0 | Architecture freeze (**sekarang**) |
| 1 | Platform shell dual-layer + template |
| 2 | Deep Dive Wave 1 + screenshot pass |
| 3 | Core hardening (Users, Closing) |
| 4 | Deep Dive Wave 2 |
| 5 | Deep Dive Wave 3 |
| 6 | Final Project + consultant pack |

## Yang diminta dari Anda sebelum Phase 1

1. Setuju urutan Core keep/enrich/add?  
2. Wave 1 prioritas OK?  
3. Modul mana yang N/A di lab Anda?  
4. Default homepage path: A (pemula) atau C (consultant)?

Data sumber: `src/data/curriculum/*`
