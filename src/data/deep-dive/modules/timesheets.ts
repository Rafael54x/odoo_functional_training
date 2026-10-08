import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const jasa = seed.products.jasa;
const kopi = seed.products.kopi;
const company = seed.company;

/**
 * Deep Dive — Timesheets (Wave 2)
 * Time tracking → project/task → analytic → invoice.
 */
export const timesheetsDeepDive: DeepDiveModule = {
  slug: "timesheets",
  name: "Timesheets — Time to Cost/Bill",
  shortTitle: "Timesheets",
  icon: "Clock",
  category: "services",
  wave: 2,
  availability: "available",
  apps: ["Timesheets", "Project", "Sales", "Employees"],
  overview: {
    function:
      "Modul Timesheets mencatat waktu kerja karyawan pada project/task sebagai account.analytic.line. Jam dipakai untuk produktivitas, costing analytic, dan — jika billable — penagihan ke pelanggan melalui Sales/Invoicing. Di Odoo 19 Enterprise, grid harian/mingguan memudahkan encode massal.",
    businessProblem:
      "Tanpa timesheet, biaya jasa tidak terukur, overtime tidak terlihat, dan invoice berbasis jam menjadi debat tanpa bukti.",
    typicalUsers: [
      "Employee / Consultant",
      "Project Manager (review jam)",
      "HR / Team Lead (approval jika aktif)",
      "Billing / Accounting",
    ],
    whenNeeded:
      "Saat tenaga kerja adalah cost driver utama (jasa, implementasi, support) atau perlu audit jam per customer.",
    relatedModules: ["Project", "Employees", "Sales", "Accounting", "Payroll (opsional)"],
    businessScenario: `Tim ${company.name} mencatat jam untuk pengiriman ${jasa.name} ke ${customer.name} dan onboarding ${distributor.name}. PM mereview timesheet, lalu sebagian jam ditagihkan mengikuti SO service; jam internal tetap non-billable untuk analisis beban.`,
  },
  prerequisites: {
    modules: ["Timesheets", "Project (sangat disarankan)", "Employees"],
    masterData: [
      "Employees dengan user terkait",
      "Projects & tasks aktif",
      `Customer billable: ${customer.name}`,
      `Produk service: ${jasa.name} jika invoicing dari timesheet/SO`,
    ],
    configuration: [
      "Project timesheets enabled",
      "Employee ↔ User linked",
      "Billing policy (manually / timesheets on tasks / SO) sesuai skenario",
    ],
    access: [
      "Timesheets / User: encode sendiri",
      "Timesheets / Officer atau Project Manager: lihat tim",
      "Approver jika validation flow dipakai",
    ],
    relationships:
      "account.analytic.line menghubungkan employee, project, task, dan optional so_line; validasi/approval mengubah kesiapan billing.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Timesheets'",
      "Install aplikasi Timesheets",
      "Pastikan Project terpasang untuk konteks task",
    ],
    dependencies: [
      "Analytic (otomatis terkait)",
      "Project untuk task linkage",
      "Employees untuk master karyawan",
    ],
    afterInstall: [
      "Hubungkan user login ke hr.employee",
      "Buka Timesheets → Configuration / Settings sesuai opsi lab",
      "Uji encode 1 jam pada task latihan",
    ],
    newMenus: [
      "Timesheets → Timesheets → My Timesheets",
      "Timesheets → Timesheets → All Timesheets",
      "Timesheets → Reporting",
      "Timesheets → Configuration",
    ],
    newSettings: [
      "Settings → Timesheets",
      "Settings → Project → Time Management",
      "Settings → Sales (billing timesheets) jika dipakai",
    ],
  },
  configurations: [
    {
      id: "ts-grid",
      name: "Timesheet Grid / Timer",
      location: "Timesheets app — Grid view & Timer widget",
      what: "UI grid harian/mingguan dan timer untuk start/stop.",
      whyEnable:
        "Encode cepat lebih akurat daripada mengingat jam di akhir minggu.",
      whenEnable:
        "Tim operasional sering ganti konteks task sepanjang hari.",
      whenNot:
        "Entri bulanan retrospektif kasar — grid harian berlebihan.",
      businessExample: `Timer 45 menit saat koordinasi kirim ${kopi.name} ke ${customer.name}.`,
      impact:
        "Menu My Timesheets menampilkan grid; timer membuat line otomatis.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets.png",
        caption: "Aplikasi Timesheets — grid / daftar waktu kerja",
        whatYouSee: "UI utama Timesheets Odoo 19",
      },
    },
    {
      id: "ts-validation",
      name: "Timesheet Validation / Approval",
      location: "Settings → Timesheets → Validation (atau To Approve menu)",
      what: "Alur review manager sebelum jam dianggap final.",
      whyEnable:
        "Mencegah overstatement jam billable ke customer.",
      whenEnable:
        "Kontrak T&M atau payroll mengandalkan timesheet.",
      whenNot:
        "Tim kecil saling percaya dan bukan basis gaji/invoice — approval memperlambat.",
      businessExample: `PM approve 6 jam onboarding ${distributor.name} sebelum billing.`,
      impact:
        "Status to approve / validated; line terkunci setelah approve.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets-approve.png",
        caption:
          "Timesheets — menu To Validate di navbar, grid waktu per karyawan",
        whatYouSee: "Menu Timesheets dan To Validate, plus baris jam per project",
      },
    },
    {
      id: "ts-billable",
      name: "Billable Timesheets",
      location: "Project/Task & Sales service billing settings",
      what: "Menandai jam yang boleh ditagih ke pelanggan.",
      whyEnable:
        "Memisahkan usaha customer-facing vs internal admin.",
      whenEnable:
        "Ada SO/kontrak time & materials atau retainer berbasis jam.",
      whenNot:
        "Fixed price murni — jam hanya untuk costing internal.",
      businessExample: `Jam training ${customer.name} billable; jam meeting internal tidak.`,
      impact:
        "Reporting memisahkan billable hours; wizard invoice timesheets tersedia.",
    },
    {
      id: "ts-encoding-restriction",
      name: "Encoding Restrictions",
      location: "Settings → Timesheets → Employee can encode ...",
      what: "Membatasi apakah karyawan boleh isi jam ke semua project atau hanya assigned.",
      whyEnable:
        "Menjaga analytic tidak dicemari project yang tidak relevan.",
      whenEnable:
        "Banyak project rahasia/customer berbeda.",
      whenNot:
        "Shared services yang sengaja isi lintas project luas.",
      businessExample: "Konsultan hanya encode project tempat mereka di-invite.",
      impact:
        "Domain project/task di timesheet form menyempit.",
    },
    {
      id: "ts-rounding",
      name: "Time Rounding",
      location: "Settings → Timesheets → Rounding",
      what: "Pembulatan durasi (mis. 15 menit).",
      whyEnable:
        "Standar kontrak billing; mengurangi debat menit remeh.",
      whenEnable:
        "Invoice T&M memakai increment tetap.",
      whenNot:
        "Butuh presisi menit untuk costing mesin/lab.",
      businessExample: "Timer 7 menit dibulatkan 15 menit sesuai kontrak ${distributor.name}.",
      impact:
        "Unit amount tersimpan setelah rounding rule.",
    },
    {
      id: "ts-sales-invoice",
      name: "Invoice from Timesheets",
      location: "Sales Order service policy / Create Invoice from timesheets",
      what: "Menarik jam tervalidasi ke invoice pelanggan.",
      whyEnable:
        "Menutup siklus time-to-cash tanpa salin jam manual ke invoice.",
      whenEnable:
        "Produk service berbasis delivered timesheets.",
      whenNot:
        "Invoice fixed price di muka — timesheet hanya internal.",
      businessExample: `Invoice ${customer.name} untuk 3 jam × rate ${jasa.name}.`,
      impact:
        "Qty to invoice mengikuti jam; analytic linked ke account.move.line.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets-lines.png",
        caption: "Baris timesheet yang siap direview / ditagihkan",
        whatYouSee: "List account.analytic.line timesheet",
      },
    },
  ],
  masterData: [
    {
      id: "md-ts-employee",
      name: "Employee (hr.employee) + User",
      purpose: "Pelaku timesheet; wajib terhubung user untuk My Timesheets.",
      required: true,
      whyNeeded:
        "Tanpa employee-user link, encode jam gagal atau tidak muncul di grid pribadi.",
      fields: [
        {
          field: "Employee Name",
          type: "Char",
          required: true,
          purpose: "Nama karyawan",
          why: "Label di laporan jam",
          example: "Andi Pratama",
          impactIfEmpty: "Master invalid",
        },
        {
          field: "Work Email",
          type: "Char",
          required: false,
          purpose: "Email kerja",
          why: "Notifikasi approval",
          example: "andi@nusantara-demo.test",
          impactIfEmpty: "Reminder kurang efektif",
        },
        {
          field: "Related User",
          type: "Many2one",
          required: true,
          purpose: "Akun login",
          why: "My Timesheets memakai user→employee",
          example: "andi",
          impactIfEmpty: "Tidak bisa encode sebagai diri sendiri",
          related: "res.users",
        },
        {
          field: "Department",
          type: "Many2one",
          required: false,
          purpose: "Organisasi",
          why: "Agregasi laporan HR",
          example: "Operations",
          impactIfEmpty: "Filter dept kosong",
          related: "hr.department",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-employees.png",
        caption: "Daftar Employees — master yang dipakai Timesheets",
      },
    },
    {
      id: "md-ts-project-task",
      name: "Project & Task targets",
      purpose: "Tujuan pencatatan jam (project.project / project.task).",
      required: true,
      whyNeeded:
        "Timesheet tanpa project/task sulit ditagih dan dianalisis.",
      fields: [
        {
          field: "Project",
          type: "Many2one",
          required: true,
          purpose: "Proyek tujuan jam",
          why: "Analytic utama",
          example: `Delivery ${jasa.name} — ${customer.name}`,
          impactIfEmpty: "Line tidak terkelompok",
          related: "project.project",
        },
        {
          field: "Task",
          type: "Many2one",
          required: false,
          purpose: "Task detail",
          why: "Granularitas kerja",
          example: "Koordinasi pengiriman",
          impactIfEmpty: "Hanya level project",
          related: "project.task",
        },
        {
          field: "Customer (related)",
          type: "Many2one",
          required: false,
          purpose: "Partner dari project",
          why: "Konteks billing",
          example: customer.name,
          impactIfEmpty: "Non-billable / internal",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-project.png",
        caption: "Project sebagai target timesheet",
      },
    },
    {
      id: "md-ts-line",
      name: "Timesheet Line (account.analytic.line)",
      purpose: "Satu baris jam: siapa, kapan, di mana, berapa lama.",
      required: true,
      whyNeeded:
        "Ini record aktual yang masuk reporting & invoice wizard.",
      fields: [
        {
          field: "Date",
          type: "Date",
          required: true,
          purpose: "Tanggal kerja",
          why: "Period reporting & payroll",
          example: "2026-10-08",
          impactIfEmpty: "Tidak valid",
        },
        {
          field: "Employee",
          type: "Many2one",
          required: true,
          purpose: "Siapa bekerja",
          why: "Cost & produktivitas",
          example: "Andi Pratama",
          impactIfEmpty: "Line orphan",
          related: "hr.employee",
        },
        {
          field: "Project / Task",
          type: "Many2one",
          required: true,
          purpose: "Konteks kerja",
          why: "Analytic allocation",
          example: `Task pengiriman ${customer.name}`,
          impactIfEmpty: "Tidak bisa analisis per project",
        },
        {
          field: "Description",
          type: "Char",
          required: false,
          purpose: "Uraian kegiatan",
          why: "Audit customer & manager",
          example: `Koordinasi jadwal kirim ${kopi.name}`,
          impactIfEmpty: "Sulit verifikasi isi kerja",
        },
        {
          field: "Hours (unit_amount)",
          type: "Float",
          required: true,
          purpose: "Durasi",
          why: "Angka inti timesheet",
          example: "1.5",
          impactIfEmpty: "0 jam — tidak berguna",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets-lines.png",
        caption: "List baris timesheet (account.analytic.line)",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "employees", label: "Employees" },
      { id: "project", label: "Project / Task" },
      { id: "timesheets", label: "Timesheets (analytic lines)" },
      { id: "sales", label: "Sales / Invoicing" },
      { id: "accounting", label: "Accounting Analytics" },
    ],
    edges: [
      {
        from: "employees",
        to: "timesheets",
        why: "Setiap line membutuhkan hr.employee (+ user)",
      },
      {
        from: "project",
        to: "timesheets",
        why: "Project/task memberi dimensi analytic",
      },
      {
        from: "timesheets",
        to: "sales",
        why: "Jam billable dapat diinvoice via SO/service policy",
      },
      {
        from: "timesheets",
        to: "accounting",
        why: "Analytic lines mendukung cost & profitability",
      },
    ],
    summary:
      "Timesheets menggabungkan siapa (Employees) dan di mana (Project) menjadi jam analytic yang bisa ditagih atau dianalisis biaya.",
  },
  forms: [
    {
      id: "form-ts-line",
      name: "Timesheet Line Form",
      menuPath: "Timesheets → My Timesheets → New / Add a line",
      fields: [
        {
          field: "Date",
          required: true,
          purpose: "Hari kerja",
          why: "Periodisasi",
          example: "2026-10-08",
        },
        {
          field: "Employee",
          required: true,
          purpose: "Pelaksana",
          why: "Default dari user",
          example: "Andi Pratama",
        },
        {
          field: "Project",
          required: true,
          purpose: "Proyek",
          why: "Wajib konteks",
          example: `Delivery ${jasa.name} — ${customer.name}`,
        },
        {
          field: "Task",
          required: false,
          purpose: "Task",
          why: "Detail pekerjaan",
          example: "Koordinasi pengiriman",
        },
        {
          field: "Description",
          required: false,
          purpose: "Catatan",
          why: "Audit",
          example: `Telepon konfirmasi qty ${seed.so.kopiQty}`,
        },
        {
          field: "Hours",
          required: true,
          purpose: "Durasi",
          why: "Nilai utama",
          example: "1.5",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets-lines.png",
        caption: "Form/list pengisian baris timesheet",
        whatToFill: "Date, Project, Task, Hours, Description",
      },
    },
    {
      id: "form-ts-grid",
      name: "Timesheet Grid (mingguan)",
      menuPath: "Timesheets → My Timesheets (Grid)",
      fields: [
        {
          field: "Project / Task rows",
          required: true,
          purpose: "Baris dimensi",
          why: "Alokasi per job",
          example: "Task follow-up kepuasan",
        },
        {
          field: "Day cells (Mon–Sun)",
          required: true,
          purpose: "Jam per hari",
          why: "Encode cepat",
          example: "1.0 / 2.0 / 0.5",
        },
        {
          field: "Total week",
          required: false,
          purpose: "Jumlah minggu",
          why: "Cek beban 40 jam",
          example: "8",
        },
        {
          field: "Description (detail)",
          required: false,
          purpose: "Catatan cell",
          why: "Keterangan audit",
          example: "Site visit",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets.png",
        caption: "Grid Timesheets mingguan",
      },
    },
  ],
  procedures: [
    {
      id: "proc-ts-encode-task",
      title: "Encode jam pada task customer",
      goal: "Satu line timesheet 1.5 jam tertaut task delivery retail.",
      preparation: [
        "Employee terhubung user login",
        `Project/task untuk ${customer.name} ada`,
        "Timesheets terpasang",
      ],
      steps: [
        "Timesheets → My Timesheets → New (atau dari Task → Timesheets)",
        "Date = hari ini",
        `Pilih Project Delivery ${jasa.name} — ${customer.name}`,
        "Pilih Task terkait",
        "Hours = 1.5; Description jelas",
        "Save",
      ],
      expectedResult: "account.analytic.line muncul di My Timesheets & task.",
      verification: [
        "Hours Spent task bertambah 1.5",
        "Employee benar",
        "Project/customer konsisten",
      ],
      fillFields: [
        {
          field: "Date",
          value: "2026-10-08",
          where: "Timesheet line",
          how: "Pilih",
          required: true,
        },
        {
          field: "Project",
          value: `Delivery ${jasa.name} — ${customer.name}`,
          where: "Timesheet line",
          how: "Pilih",
          required: true,
        },
        {
          field: "Task",
          value: "Koordinasi pengiriman",
          where: "Timesheet line",
          how: "Pilih",
        },
        {
          field: "Hours",
          value: "1.5",
          where: "Timesheet line",
          how: "Ketik",
          required: true,
        },
        {
          field: "Description",
          value: `Koordinasi kirim ${kopi.name} × ${seed.so.kopiQty}`,
          where: "Timesheet line",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets-lines.png",
        caption: "Hasil encode baris timesheet",
      },
    },
    {
      id: "proc-ts-weekly-grid",
      title: "Isi grid mingguan",
      goal: "Total minggu ≥ 6 jam terdistribusi ke 2 project.",
      preparation: [
        `Project retail ${customer.name}`,
        `Project onboarding ${distributor.name}`,
      ],
      steps: [
        "Buka My Timesheets tampilan Grid",
        "Tambah baris project/task retail — isi 3 jam tersebar midweek",
        "Tambah baris project distributor — isi 3 jam",
        "Save grid",
        "Review total minggu",
      ],
      expectedResult: "Grid tersimpan; reporting per project terisi.",
      verification: [
        "All Timesheets filter minggu ini = 6 jam",
        "Dua project punya jam",
      ],
      fillFields: [
        {
          field: "Retail task hours",
          value: "3",
          where: "Grid cells",
          how: "Ketik",
          required: true,
        },
        {
          field: "Distributor task hours",
          value: "3",
          where: "Grid cells",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets.png",
        caption: "Grid mingguan setelah diisi",
      },
    },
    {
      id: "proc-ts-invoice",
      title: "Tagihkan jam billable",
      goal: "Invoice pelanggan memuat qty dari timesheet.",
      preparation: [
        "SO service dengan policy timesheets (atau wizard invoice timesheets)",
        "Jam sudah di-encode (dan di-validate jika wajib)",
      ],
      steps: [
        "Pastikan timesheet linked ke SO/task billable",
        "Sales → Order terkait → Create Invoice (atau Project billing wizard)",
        "Review qty jam yang ditarik",
        "Confirm invoice",
        "Tandai timesheet invoiced (otomatis bila alur standar)",
      ],
      expectedResult: "Customer invoice Posted; jam tidak double-bill.",
      verification: [
        `Invoice partner ${customer.name}`,
        "Qty selaras total jam billable",
        "Timesheet menampilkan invoiced flag/qty",
      ],
      fillFields: [
        {
          field: "Customer",
          value: customer.name,
          where: "Invoice",
          how: "Otomatis",
          required: true,
        },
        {
          field: "Quantity (hours)",
          value: "1.5",
          where: "Invoice lines",
          how: "Otomatis dari timesheet",
          required: true,
        },
        {
          field: "Product",
          value: jasa.name,
          where: "Invoice lines",
          how: "Otomatis/pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/15-customer-invoices.png",
        caption: "Customer Invoice hasil penagihan timesheet/service",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-ts-tm-billing",
      title: "Time & Materials billing",
      whenToUse: "Kontrak bayar per jam ke retail/distributor.",
      flow: [
        "Confirm SO service",
        "Kerjakan task + encode jam",
        "Validate timesheet",
        "Create Invoice dari jam",
      ],
    },
    {
      id: "sc-ts-internal-cost",
      title: "Jam internal non-billable",
      whenToUse: "Rapat perbaikan proses tanpa ditagih.",
      flow: [
        "Project internal",
        "Encode jam",
        "Jangan tarik ke invoice",
        "Analisis beban di reporting",
      ],
    },
    {
      id: "sc-ts-approval",
      title: "Approval manajer",
      whenToUse: "Validation flow aktif.",
      flow: [
        "Employee submit minggu",
        "Manager review To Approve",
        "Reject baris salah project",
        "Approve sisa → billing",
      ],
    },
    {
      id: "sc-ts-timer",
      title: "Kerja dengan Timer",
      whenToUse: "Multitask sepanjang hari.",
      flow: [
        "Start timer di task A",
        "Stop / switch ke task B",
        "Review line otomatis",
        "Edit description akhir hari",
      ],
    },
  ],
  integrations: [
    {
      id: "int-ts-project",
      withModule: "Project",
      relationship: "timesheet → task/project hours",
      whatHappens:
        "Hours Spent naik; profitability memakai cost rate × jam jika dikonfigurasi.",
    },
    {
      id: "int-ts-employees",
      withModule: "Employees",
      relationship: "hr.employee pada analytic line",
      whatHappens:
        "Nama, dept, dan manager dipakai filter & approval chain.",
    },
    {
      id: "int-ts-sales",
      withModule: "Sales / Invoicing",
      relationship: "billable hours → invoice qty",
      whatHappens:
        "Service delivered timesheets membuka qty to invoice pada SO.",
    },
    {
      id: "int-ts-accounting",
      withModule: "Accounting",
      relationship: "analytic distribution",
      whatHappens:
        "Jam menjadi dasar analytic cost; laporan margin project di Accounting/Project.",
    },
  ],
  mistakes: [
    {
      id: "m-ts-wrong-project",
      problem: "Jam masuk project customer yang salah",
      why: "Invoice/cost salah pihak; konflik audit",
      detect: "Line dengan partner ≠ kenyataan lapangan",
      fix: "Edit project/task sebelum validate/invoice",
      prevent: "Encode dari task form, bukan pilih project bebas",
    },
    {
      id: "m-ts-endweek-dump",
      problem: "Isi semua jam hanya hari Jumat retrospektif",
      why: "Akurasi rendah; lupa detail",
      detect: "Satu hari 10+ jam, hari lain 0",
      fix: "Pecah ke tanggal aktual sebaik mungkin",
      prevent: "Timer harian atau encode end-of-day",
    },
    {
      id: "m-ts-double-bill",
      problem: "Invoice manual + invoice timesheet untuk jam sama",
      why: "Customer overbilled",
      detect: "Qty invoice > jam; timesheet masih to invoice",
      fix: "Credit note; rekonsiliasi timesheet invoiced",
      prevent: "Satu jalur billing: dari SO/timesheet saja",
    },
    {
      id: "m-ts-no-description",
      problem: "Jam tanpa description",
      why: "Manager/customer menolak bukti kerja",
      detect: "Description kosong di laporan",
      fix: "Lengkapi uraian sebelum approve",
      prevent: "Wajibkan description di SOP / studio required",
    },
  ],
  troubleshooting: [
    {
      id: "t-ts-no-employee",
      problem: "Error tidak punya employee saat encode",
      causes: [
        "User belum linked ke hr.employee",
        "Employee archived",
      ],
      diagnosis: [
        "Employees → buka profil → Related User",
        "Cek user preferences",
      ],
      solution: [
        "Set Related User pada employee",
        "Atau buat employee baru untuk user lab",
      ],
      prevention: "Onboarding user selalu create employee pair",
    },
    {
      id: "t-ts-cannot-invoice",
      problem: "Create Invoice tidak menarik jam",
      causes: [
        "Policy produk bukan timesheets",
        "Jam belum validated",
        "Sudah invoiced",
        "Task tidak linked SO",
      ],
      diagnosis: [
        "Cek Invoicing Policy service product",
        "Filter timesheets To Invoice",
        "Cek link SO line",
      ],
      solution: [
        "Ubah policy / link SO",
        "Validate timesheet",
        "Buat SO service yang benar",
      ],
      prevention: "Desain produk jasa + project create-on-order sejak awal",
    },
    {
      id: "t-ts-grid-readonly",
      problem: "Grid tidak bisa diedit",
      causes: [
        "Periode sudah validated",
        "Hak hanya read",
        "Tanggal di luar encoding window",
      ],
      diagnosis: [
        "Cek status validation minggu",
        "Cek group Timesheets",
      ],
      solution: [
        "Minta manager unbuild/reset jika diizinkan",
        "Encode di periode terbuka",
        "Naikkan hak akses",
      ],
      prevention: "Tutup periode hanya setelah cutoff jelas",
    },
  ],
  behind: {
    models: [
      "account.analytic.line",
      "project.project",
      "project.task",
      "hr.employee",
      "sale.order",
      "sale.order.line",
      "account.move",
      "uom.uom",
    ],
    relations: [
      "account.analytic.line.employee_id → hr.employee",
      "account.analytic.line.project_id → project.project",
      "account.analytic.line.task_id → project.task",
      "account.analytic.line.so_line → sale.order.line",
      "account.analytic.line.unit_amount = hours",
    ],
    automations: [
      "timer start/stop creates/updates analytic lines",
      "validation locks lines",
      "invoicing marks timesheets invoiced quantities",
    ],
    securityNotes: [
      "Users biasanya hanya edit timesheet sendiri",
      "Officers/managers melihat tim / all timesheets",
    ],
    note: "Di Odoo 19, timesheet tetap specialisasi account.analytic.line dengan project coding; bukan model terpisah total.",
  },
  reporting: [
    {
      name: "Timesheet Analysis",
      path: "Timesheets → Reporting → Timesheet Analysis",
      kpi: "Hours per employee/project/customer",
      decision: "Staffing & beban kerja",
    },
    {
      name: "Billable vs Non-billable",
      path: "Timesheets reporting + Project profitability",
      kpi: "Utilization billable %",
      decision: "Target utilisasi konsultan",
    },
    {
      name: "Project Hours",
      path: "Project → Reporting",
      kpi: "Spent vs allocated",
      decision: "CR / stop scope creep",
    },
    {
      name: "To Invoice Hours",
      path: "Sales Orders To Invoice / Timesheets filter",
      kpi: "Backlog jam belum ditagih",
      decision: "Prioritas billing minggu ini",
    },
  ],
  security: {
    roles: [
      {
        role: "Timesheets / User",
        can: ["Encode & edit jam sendiri", "Pakai timer", "Lihat project diizinkan"],
        cannot: ["Approve jam orang lain", "Ubah setting rounding global"],
        whyDifferent: "Privasi & akuntabilitas per individu.",
      },
      {
        role: "Timesheets Officer / Project Manager",
        can: ["Lihat jam tim", "Validate/approve", "Koreksi salah project sebelum billing"],
        cannot: ["Post payment customer tanpa Accounting"],
        whyDifferent: "Kontrol kualitas data sebelum dampak finansial.",
      },
    ],
    notes: [
      "Jangan beri All Timesheets ke semua orang jika ada data sensitif customer",
      "Portal biasanya tidak encode timesheet internal",
    ],
  },
  levels: {
    beginner: [
      "Encode satu line My Timesheets",
      "Pilih project & task benar",
      "Baca total jam minggu",
    ],
    intermediate: [
      "Grid mingguan multi-project",
      "Timer harian",
      "Timesheet dari task form",
      "Pisahkan billable/non-billable",
    ],
    advanced: [
      "Validation flow",
      "Invoice dari timesheets",
      "Analitik utilisasi tim",
      "Rounding & encoding rules",
    ],
    expert: [
      "Desain time-to-cash KPI",
      "Integrasi cost rate karyawan",
      "Cutoff period & audit trail",
      "Kebijakan reject/resubmit",
    ],
  },
  exercises: [
    {
      id: "ex-ts-basic",
      title: "1.5 jam retail delivery",
      objective: `Timesheet untuk ${customer.name}`,
      prerequisites: ["Employee-user linked", "Task ada"],
      task: ["Encode 1.5h", "Isi description", "Cek task hours"],
      expectedResult: "Line terlihat di My Timesheets",
      checklist: ["Project benar", "Hours 1.5", "Description ada"],
    },
    {
      id: "ex-ts-grid",
      title: "Grid dua customer",
      objective: "6 jam dalam seminggu",
      prerequisites: ["Dua project aktif"],
      task: [
        `3 jam ${customer.name}`,
        `3 jam ${distributor.name}`,
        "Save grid",
      ],
      expectedResult: "Total minggu 6",
      checklist: ["Tidak ada hari negatif", "Task terisi"],
    },
    {
      id: "ex-ts-approve",
      title: "Simulasi approval",
      objective: "Alur To Approve",
      prerequisites: ["Validation aktif atau peer review manual"],
      task: [
        "Buat jam sebagai user A",
        "Review sebagai manager",
        "Koreksi 1 line salah",
      ],
      expectedResult: "Jam final bersih sebelum billing",
      checklist: ["Ada jejak koreksi", "Project benar"],
    },
    {
      id: "ex-ts-invoice",
      title: "Invoice jam jasa",
      objective: `Tagih ${jasa.name} berbasis jam`,
      prerequisites: ["SO service siap"],
      task: ["Pastikan jam linked", "Create Invoice", "Confirm"],
      expectedResult: "Invoice qty = jam billable",
      checklist: ["Tidak double bill", "Tax sesuai"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Project", href: "/materi/project" },
    { label: "Deep Dive Employees", href: "/materi/employees" },
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Flow Invoicing", href: "/modul/flow-invoicing" },
    { label: "E2E Cycle", href: "/modul/flow-end-to-end" },
  ],
};
