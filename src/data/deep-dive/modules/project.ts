import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const jasa = seed.products.jasa;
const kopi = seed.products.kopi;
const company = seed.company;

/**
 * Deep Dive — Project (Wave 2)
 * Project, Task, Stage, profitability dengan Timesheets.
 */
export const projectDeepDive: DeepDiveModule = {
  slug: "project",
  name: "Project — Tasks & Delivery",
  shortTitle: "Project",
  icon: "FolderKanban",
  category: "services",
  wave: 2,
  availability: "available",
  apps: ["Project", "Timesheets", "Sales", "Employees"],
  overview: {
    function:
      "Modul Project mengelola pengerjaan layanan/proyek: project.project sebagai wadah, project.task sebagai unit kerja, stage kanban, assignees, deadline, dan integrasi timesheet (account.analytic.line) untuk biaya/jam. Di Odoo 19 Enterprise, Project sering digandeng Sales (service SO) dan Timesheets untuk profitability.",
    businessProblem:
      "Tanpa Project, pekerjaan jasa tersebar di chat, tidak ada owner/task, progress tidak terlihat, dan jam kerja tidak tertaut ke pelanggan/invoice.",
    typicalUsers: [
      "Project Manager",
      "Consultant / Service Delivery",
      "Sales (handover SO jasa)",
      "Finance (analytic / billing)",
    ],
    whenNeeded:
      "Saat perusahaan menjual jasa, implementasi, atau inisiatif internal yang butuh task tracking dan pelaporan jam.",
    relatedModules: ["Timesheets", "Sales", "Employees", "Planning", "Helpdesk"],
    businessScenario: `${company.name} menjual ${jasa.name} ke ${customer.name} dan proyek onboarding distributor ke ${distributor.name}. PM membuat project, memecah task (survey lokasi, packing list, training), assign karyawan, lalu mencatat timesheet untuk ditagih atau dianalisis biaya.`,
  },
  prerequisites: {
    modules: ["Project", "Contacts", "Employees (untuk assignee karyawan)", "Timesheets (disarankan)"],
    masterData: [
      `Customer: ${customer.name}, ${distributor.name}`,
      "Employees aktif sebagai assignees",
      "Project stages (task stages)",
      `Produk service: ${jasa.name} (jika dari Sales)`,
    ],
    configuration: [
      "Project → Configuration → Settings: Task Dependencies / Sub-tasks (sesuai kebutuhan)",
      "Project → Configuration → Settings: Timesheets on tasks",
      "Stages per project atau shared",
    ],
    access: [
      "Project / User: task assigned & project diizinkan",
      "Project / Administrator: semua project, konfigurasi",
      "Timesheets user untuk input jam",
    ],
    relationships:
      "project.task.project_id → project.project; timesheet lines (account.analytic.line) menempel task/project; SO line service bisa create project/tasks otomatis jika dikonfigurasi.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Project'",
      "Install aplikasi Project",
      "Install Timesheets jika belum (untuk jam & billing)",
    ],
    dependencies: [
      "Analytic Accounting (sering otomatis untuk timesheet)",
      "Employees disarankan untuk resource manusia",
      "Sales opsional untuk project dari SO",
    ],
    afterInstall: [
      "Project → Configuration → Settings: aktifkan Timesheets, Sub-tasks jika perlu",
      "Buat project template atau stage standar",
      "Pastikan user punya akses Project",
    ],
    newMenus: [
      "Project → Projects",
      "Project → Tasks",
      "Project → Reporting",
      "Project → Configuration → Settings",
      "Project → Configuration → Stages",
    ],
    newSettings: [
      "Settings → Project → Tasks Management",
      "Settings → Project → Time Management",
      "Settings → Project → Analytics",
    ],
  },
  configurations: [
    {
      id: "proj-timesheets",
      name: "Timesheets on Tasks",
      location: "Settings → Project → Time Management → Timesheets",
      what: "Mengizinkan pencatatan jam pada task/project.",
      whyEnable:
        "Tanpa timesheet, profitability jasa dan billing berbasis jam tidak akurat.",
      whenEnable:
        "Hampir selalu untuk perusahaan jasa atau proyek billable.",
      whenNot:
        "Project murni checklist internal tanpa perlu jam — bisa nonaktifkan untuk sederhanakan UI.",
      businessExample: `Task "Kirim & setup" untuk ${customer.name} mencatat 2 jam timesheet terkait ${jasa.name}.`,
      impact:
        "Smart button Timesheets di task; field Allocated Time / Hours Spent muncul.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-project.png",
        caption: "Overview Project — area kerja setelah Timesheets diaktifkan",
        whatYouSee: "Daftar atau dashboard project",
      },
    },
    {
      id: "proj-subtasks",
      name: "Sub-tasks",
      location: "Settings → Project → Tasks Management → Sub-tasks",
      what: "Task dapat memiliki anak (breakdown pekerjaan).",
      whyEnable:
        "Proyek onboarding distributor punya banyak langkah yang perlu dipecah.",
      whenEnable:
        "Task induk terlalu besar (>1 hari kerja) dan multi-orang.",
      whenNot:
        "Checklist pendek — sub-tasks menambah kompleksitas navigasi.",
      businessExample: `Task "Onboarding ${distributor.name}" → sub-task Survey, Training, Go-Live.`,
      impact:
        "Tab/field Sub-tasks; progress induk bisa agregat anak.",
    },
    {
      id: "proj-dependencies",
      name: "Task Dependencies",
      location: "Settings → Project → Tasks Management → Task Dependencies",
      what: "Task menunggu predecessor selesai (blocked by).",
      whyEnable:
        "Mencegah mulai training sebelum packing list & stok siap.",
      whenEnable:
        "Urutan kerja kritis lintas role (warehouse → sales → training).",
      whenNot:
        "Kerja paralel penuh tanpa urutan — dependency hanya noise.",
      businessExample: `"Training ${customer.name}" blocked by "Konfirmasi SO & Delivery ${kopi.name}".`,
      impact:
        "Field Blocked By / Dependent Tasks; Gantt/status blocked.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-project-task-subtasks.png",
        caption:
          "Form Task — tab Sub-tasks (di Odoo 19 dependensi task ada di tab ini, bukan checkbox terpisah di Settings)",
        whatYouSee: "Notebook Description, Timesheets, Sub-tasks dengan Add a line",
      },
    },
    {
      id: "proj-milestones",
      name: "Milestones",
      location: "Settings → Project → Tasks Management → Milestones",
      what: "Titik pencapaian tertanggal untuk billing/progress.",
      whyEnable:
        "Invoice bertahap per milestone lebih mudah dijelaskan ke customer.",
      whenEnable:
        "Kontrak jasa bertahap (DP, UAT, Go-Live).",
      whenNot:
        "Order jasa sekali kirim sederhana seperti ${jasa.name} retail.",
      businessExample: `Milestone "Go-Live ${distributor.name}" tanggal akhir bulan.`,
      impact:
        "Menu/field Milestone di project; task bisa ditautkan milestone.",
    },
    {
      id: "proj-recurring",
      name: "Recurring Tasks",
      location: "Settings → Project → Tasks Management → Recurring Tasks",
      what: "Task berulang otomatis (mingguan/bulanan).",
      whyEnable:
        "Checklist rutin (stock review, QC report) tidak dibuat manual tiap periode.",
      whenEnable:
        "Ada pekerjaan periodik yang sama.",
      whenNot:
        "Semua task one-off per customer.",
      businessExample: "Task mingguan 'Review pipeline CRM × Project handover'.",
      impact:
        "Opsi Recurrence di form task; instance baru ter-generate.",
    },
    {
      id: "proj-billable",
      name: "Billable Projects / Sales Integration",
      location: "Settings → Project / Sales → service product Create on Order",
      what: "Produk service pada SO dapat membuat project/task otomatis.",
      whyEnable:
        "Handover Sales → Delivery tanpa PM menyalin data manual.",
      whenEnable:
        "Menjual jasa berulang dari Sales Order.",
      whenNot:
        "Project murni internal tanpa SO.",
      businessExample: `SO ${customer.name} line ${jasa.name} auto-create project/task delivery.`,
      impact:
        "Project terisi dari SO; smart button Sales Order di project.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-project-form-new.png",
        caption: "Form Project baru — dapat ditautkan ke customer & SO",
        whatYouSee: "Form create project.project",
      },
    },
  ],
  masterData: [
    {
      id: "md-project",
      name: "Project (project.project)",
      purpose: "Kontainer tugas, analytic, customer, dan staging.",
      required: true,
      whyNeeded:
        "Task harus punya project; reporting jam & biaya digroup per project.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama proyek",
          why: "Identitas di dashboard",
          example: `Delivery ${jasa.name} — ${customer.name}`,
          impactIfEmpty: "Tidak bisa simpan",
        },
        {
          field: "Customer",
          type: "Many2one",
          required: false,
          purpose: "Pelanggan terkait",
          why: "Billing & portal",
          example: customer.name,
          impactIfEmpty: "Project internal / tanpa bill-to",
          related: "res.partner",
        },
        {
          field: "Project Manager",
          type: "Many2one",
          required: false,
          purpose: "Owner proyek",
          why: "Akuntabilitas & notifikasi",
          example: "Administrator",
          impactIfEmpty: "Eskalasi tidak jelas",
          related: "res.users",
        },
        {
          field: "Planned Date / Deadline",
          type: "Datetime / Date",
          required: false,
          purpose: "Batas waktu proyek",
          why: "Highlight overdue",
          example: "2026-10-31",
          impactIfEmpty: "Sulit prioritas portofolio",
        },
        {
          field: "Allocated Time",
          type: "Float",
          required: false,
          purpose: "Jam anggaran",
          why: "Bandingkan vs hours spent",
          example: "8",
          impactIfEmpty: "Tidak ada indikator overrun",
        },
        {
          field: "Privacy / Visibility",
          type: "Selection",
          required: true,
          purpose: "Siapa boleh lihat",
          why: "Keamanan data customer",
          example: "Invited internal users",
          impactIfEmpty: "Default company — bisa terlalu terbuka",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-project-form-new.png",
        caption: "Form Project — master project.project",
      },
    },
    {
      id: "md-task",
      name: "Task (project.task)",
      purpose: "Unit kerja yang di-assign, di-stage, dan di-timesheet.",
      required: true,
      whyNeeded:
        "Progress operasional terjadi di level task, bukan hanya nama project.",
      fields: [
        {
          field: "Title",
          type: "Char",
          required: true,
          purpose: "Nama tugas",
          why: "Kartu kanban",
          example: `Siapkan pengiriman ${kopi.name}`,
          impactIfEmpty: "Task invalid",
        },
        {
          field: "Project",
          type: "Many2one",
          required: true,
          purpose: "Induk proyek",
          why: "Konteks & analytic",
          example: `Delivery ${jasa.name} — ${customer.name}`,
          impactIfEmpty: "Task mengambang",
          related: "project.project",
        },
        {
          field: "Assignees",
          type: "Many2many",
          required: false,
          purpose: "Pelaksana",
          why: "My Tasks & notifikasi",
          example: "Administrator",
          impactIfEmpty: "Tidak ada owner eksekusi",
          related: "res.users",
        },
        {
          field: "Customer",
          type: "Many2one",
          required: false,
          purpose: "Override/partner task",
          why: "Konteks lapangan",
          example: customer.name,
          impactIfEmpty: "Pakai customer project",
          related: "res.partner",
        },
        {
          field: "Deadline",
          type: "Datetime",
          required: false,
          purpose: "Jatuh tempo task",
          why: "Prioritas harian",
          example: "2026-10-18 17:00",
          impactIfEmpty: "Overdue tracking lemah",
        },
        {
          field: "Stage",
          type: "Many2one",
          required: false,
          purpose: "Status kanban",
          why: "Alur kerja visual",
          example: "In Progress",
          impactIfEmpty: "Masuk stage pertama default",
          related: "project.task.type",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-project-task-form.png",
        caption:
          "Form Task — Assignees dan stage In Progress (project.task)",
        whatYouSee: "Boiler maintenance, Assignees Mitchell Admin, stage In Progress",
      },
    },
    {
      id: "md-task-stage",
      name: "Task Stage (project.task.type)",
      purpose: "Kolom kanban status task per project atau shared.",
      required: true,
      whyNeeded:
        "Tanpa stage, board tidak punya alur New → Doing → Done.",
      fields: [
        {
          field: "Stage Name",
          type: "Char",
          required: true,
          purpose: "Nama kolom",
          why: "Bahasa tim delivery",
          example: "Backlog / In Progress / Done",
          impactIfEmpty: "Tidak valid",
        },
        {
          field: "Projects",
          type: "Many2many",
          required: false,
          purpose: "Project yang memakai stage",
          why: "Stage khusus vs global",
          example: "Delivery Jasa Retail",
          impactIfEmpty: "Bisa jadi template stage baru",
        },
        {
          field: "Folded",
          type: "Boolean",
          required: false,
          purpose: "Lipat kolom Done/Cancelled",
          why: "Board fokus work-in-progress",
          example: "True untuk Done",
          impactIfEmpty: "Board penuh history",
        },
        {
          field: "Closing Stage",
          type: "Boolean",
          required: false,
          purpose: "Menandai selesai",
          why: "KPI completed tasks",
          example: "True pada Done",
          impactIfEmpty: "Task 'selesai' tidak terhitung closed",
        },
      ],
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts" },
      { id: "employees", label: "Employees / Users" },
      { id: "project", label: "Project / Tasks" },
      { id: "timesheets", label: "Timesheets" },
      { id: "sales", label: "Sales (Service SO)" },
    ],
    edges: [
      {
        from: "contacts",
        to: "project",
        why: "Customer di project.project.partner_id",
      },
      {
        from: "employees",
        to: "project",
        why: "Assignees & PM adalah user/employee",
      },
      {
        from: "project",
        to: "timesheets",
        why: "Jam dicatat pada task/project via analytic lines",
      },
      {
        from: "sales",
        to: "project",
        why: "Service SO dapat generate project/tasks",
      },
    ],
    summary:
      "Project bergantung Contacts & resource manusia; Timesheets mengukur usaha; Sales bisa memicu project dari line jasa.",
  },
  forms: [
    {
      id: "form-project",
      name: "Project (project.project)",
      menuPath: "Project → Projects → New",
      fields: [
        {
          field: "Name",
          required: true,
          purpose: "Nama proyek",
          why: "Identitas utama",
          example: `Onboarding ${distributor.name}`,
        },
        {
          field: "Customer",
          required: false,
          purpose: "Pelanggan",
          why: "Konteks & invoice",
          example: distributor.name,
        },
        {
          field: "Project Manager",
          required: false,
          purpose: "PM",
          why: "Ownership",
          example: "Administrator",
        },
        {
          field: "Allocated Hours",
          required: false,
          purpose: "Budget jam",
          why: "Kontrol overrun",
          example: "16",
        },
        {
          field: "Start / End",
          required: false,
          purpose: "Jadwal proyek",
          why: "Planning portofolio",
          example: "2026-10-08 — 2026-10-31",
        },
        {
          field: "Tags",
          required: false,
          purpose: "Kategori",
          why: "Filter reporting",
          example: "Distributor, Onboarding",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-project-form-new.png",
        caption: "Form Project baru di Odoo 19",
        whatToFill: `Name Onboarding ${distributor.name}, Customer ${distributor.name}`,
      },
    },
    {
      id: "form-task",
      name: "Task (project.task)",
      menuPath: "Project → Tasks → New (atau dari project → New Task)",
      fields: [
        {
          field: "Title",
          required: true,
          purpose: "Nama task",
          why: "Unit kerja",
          example: "Training penggunaan portal order",
        },
        {
          field: "Project",
          required: true,
          purpose: "Induk",
          why: "Wajib konteks",
          example: `Onboarding ${distributor.name}`,
        },
        {
          field: "Assignees",
          required: false,
          purpose: "Pelaksana",
          why: "My Tasks",
          example: "Administrator",
        },
        {
          field: "Deadline",
          required: false,
          purpose: "Due date",
          why: "Prioritas",
          example: "2026-10-20",
        },
        {
          field: "Allocated Time",
          required: false,
          purpose: "Estimasi jam",
          why: "Vs timesheet aktual",
          example: "3",
        },
        {
          field: "Description",
          required: false,
          purpose: "Instruksi kerja",
          why: "Handover jelas",
          example: `Jelaskan cara order ${kopi.name} dan cek stok`,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-project.png",
        caption: "Board/list Project tempat task dikelola",
      },
    },
  ],
  procedures: [
    {
      id: "proc-proj-create",
      title: `Membuat Project untuk ${customer.name}`,
      goal: "Project aktif dengan customer dan PM terisi.",
      preparation: [
        `Contact ${customer.name} ada`,
        "User PM punya akses Project",
      ],
      steps: [
        "Home → Project → Projects → New",
        `Name: Delivery ${jasa.name} — ${customer.name}`,
        `Customer: ${customer.name}`,
        "Set Project Manager",
        "Allocated Time: 8 hours",
        "Save → buka task board project",
      ],
      expectedResult: "project.project tersimpan; stages default tersedia.",
      verification: [
        "Project muncul di daftar Projects",
        "Customer benar",
        "Bisa membuat task di dalamnya",
      ],
      fillFields: [
        {
          field: "Name",
          value: `Delivery ${jasa.name} — ${customer.name}`,
          where: "Header",
          how: "Ketik",
          required: true,
        },
        {
          field: "Customer",
          value: customer.name,
          where: "Header",
          how: "Pilih",
        },
        {
          field: "Allocated Time",
          value: "8",
          where: "Header / Settings tab",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-project-form-new.png",
        caption: "Form Project siap diisi",
      },
    },
    {
      id: "proc-proj-tasks",
      title: "Memecah pekerjaan menjadi Tasks",
      goal: "Minimal 3 task dengan assignee dan deadline.",
      preparation: ["Project sudah dibuat"],
      steps: [
        "Buka Project → New Task",
        `Task 1: Konfirmasi alamat kirim ${customer.name}`,
        `Task 2: Siapkan ${kopi.name} × ${seed.so.kopiQty} + ${jasa.name}`,
        "Task 3: Follow-up kepuasan setelah kirim",
        "Assign masing-masing; set deadline berurutan",
        "Geser Task 1 ke In Progress",
      ],
      expectedResult: "Kanban terisi; My Tasks menampilkan assignment.",
      verification: [
        "3 task di project yang sama",
        "Assignee terisi",
        "Stage berbeda terlihat di board",
      ],
      fillFields: [
        {
          field: "Title",
          value: `Konfirmasi alamat kirim ${customer.name}`,
          where: "Task form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Project",
          value: `Delivery ${jasa.name} — ${customer.name}`,
          where: "Task form",
          how: "Pilih",
          required: true,
        },
        {
          field: "Assignees",
          value: "Administrator",
          where: "Task form",
          how: "Pilih",
        },
        {
          field: "Deadline",
          value: "2026-10-18",
          where: "Task form",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-project.png",
        caption: "Project board setelah beberapa task dibuat",
      },
    },
    {
      id: "proc-proj-timesheet-close",
      title: "Catat jam dan tutup task",
      goal: "Timesheet tertaut task; task masuk stage Done.",
      preparation: ["Timesheets aktif", "Task In Progress"],
      steps: [
        "Buka Task → tab Timesheets",
        "Add line: Date hari ini, Hours 1.5, Description pekerjaan",
        "Save",
        "Geser task ke Done / Mark as Done",
        "Cek Project: Hours Spent bertambah",
      ],
      expectedResult: "account.analytic.line terbuat; progress jam terupdate.",
      verification: [
        "Smart button Timesheets > 0",
        "Task di closing stage",
        "Reporting Project menampilkan jam",
      ],
      fillFields: [
        {
          field: "Date",
          value: "Hari ini",
          where: "Timesheets tab",
          how: "Pilih",
          required: true,
        },
        {
          field: "Hours",
          value: "1.5",
          where: "Timesheets tab",
          how: "Ketik",
          required: true,
        },
        {
          field: "Description",
          value: `Koordinasi pengiriman ${kopi.name}`,
          where: "Timesheets tab",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-timesheets-lines.png",
        caption: "Baris timesheet yang tertaut ke task project",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-proj-service-so",
      title: "Project dari Sales Order jasa",
      whenToUse: `SO berisi ${jasa.name} dengan Create on Order = Project/Task.`,
      flow: [
        "Confirm SO service",
        "Project/task ter-generate",
        "Assign PM & kerjakan task",
        "Timesheet + invoice sesuai policy",
      ],
    },
    {
      id: "sc-proj-internal",
      title: "Project internal improvement",
      whenToUse: "Tidak ada customer billable.",
      flow: [
        "Buat project tanpa customer",
        "Task improvement proses gudang",
        "Timesheet non-billable",
        "Review hours spent vs allocated",
      ],
    },
    {
      id: "sc-proj-milestone-billing",
      title: "Billing per milestone",
      whenToUse: "Kontrak bertahap ke distributor.",
      flow: [
        `Project onboarding ${distributor.name}`,
        "Define milestones",
        "Selesaikan task per milestone",
        "Invoice bertahap dari Sales/Project",
      ],
    },
    {
      id: "sc-proj-overrun",
      title: "Deteksi overrun jam",
      whenToUse: "Hours Spent > Allocated Time.",
      flow: [
        "Set allocated 4 jam",
        "Input timesheet 6 jam",
        "Baca indikator overrun",
        "Eskalasi scope/CR ke sales",
      ],
      notes: "Latihan kontrol biaya jasa.",
    },
  ],
  integrations: [
    {
      id: "int-proj-timesheets",
      withModule: "Timesheets",
      relationship: "project.task ← account.analytic.line",
      whatHappens:
        "Jam pada task mengaggregate ke project; bisa ditagih jika billable.",
    },
    {
      id: "int-proj-sales",
      withModule: "Sales",
      relationship: "sale.order.line → project/task",
      whatHappens:
        "Service product create-on-order membuat wadah delivery otomatis.",
    },
    {
      id: "int-proj-employees",
      withModule: "Employees",
      relationship: "assignees / timesheet employee",
      whatHappens:
        "Karyawan sebagai resource; HR master mendukung nama & departemen di laporan.",
    },
    {
      id: "int-proj-accounting",
      withModule: "Accounting",
      relationship: "analytic account / billing",
      whatHappens:
        "Analytic dari project membantu margin; invoice jasa mengakui revenue.",
    },
  ],
  mistakes: [
    {
      id: "m-proj-no-assignee",
      problem: "Task tanpa assignee",
      why: "Tidak muncul di My Tasks; pekerjaan mengambang",
      detect: "Filter Unassigned berisi banyak kartu",
      fix: "Assign owner; buat rule wajib assignee sebelum In Progress",
      prevent: "SOP: tidak ada task aktif tanpa owner",
    },
    {
      id: "m-proj-too-big-task",
      problem: "Satu task mencakup seluruh proyek",
      why: "Progress 0→100 menyesatkan; parallel work sulit",
      detect: "Task berumur panjang tanpa sub-task",
      fix: "Pecah jadi sub-tasks / beberapa task",
      prevent: "Batasi task ≤ 1 hari ideal",
    },
    {
      id: "m-proj-timesheet-orphan",
      problem: "Timesheet di project tanpa task",
      why: "Detail pekerjaan hilang; review sulit",
      detect: "Line analytic tanpa task_id",
      fix: "Pindahkan line ke task yang benar",
      prevent: "Wajibkan task saat encode jam billable",
    },
    {
      id: "m-proj-wrong-customer",
      problem: "Customer project salah / kosong saat billable",
      why: "Invoice & portal salah pihak",
      detect: "Project billable partner ≠ SO partner",
      fix: "Update partner_id; perbaiki dokumen turunan",
      prevent: "Generate project dari SO agar partner konsisten",
    },
  ],
  troubleshooting: [
    {
      id: "t-proj-no-timesheet-tab",
      problem: "Tab Timesheets tidak ada di task",
      causes: [
        "Timesheets belum diinstall/aktif",
        "Setting Project timesheets off",
        "Hak akses kurang",
      ],
      diagnosis: [
        "Apps → Timesheets",
        "Settings → Project → Time Management",
      ],
      solution: [
        "Install Timesheets",
        "Aktifkan opsi timesheets on tasks",
        "Refresh browser",
      ],
      prevention: "Checklist install Wave 2: Project + Timesheets bersama",
    },
    {
      id: "t-proj-cannot-see",
      problem: "User tidak melihat project",
      causes: [
        "Privacy/followers terbatas",
        "Bukan anggota project",
        "Multi-company salah",
      ],
      diagnosis: [
        "Cek Visibility project",
        "Cek invited users / followers",
      ],
      solution: [
        "Invite user ke project",
        "Ubah visibility sesuai kebijakan",
      ],
      prevention: "Template project dengan anggota tim default",
    },
    {
      id: "t-proj-so-not-creating",
      problem: "SO service tidak membuat project",
      causes: [
        "Product Create on Order = Nothing",
        "Bukan tipe Service",
        "Sales/Project bridge belum lengkap",
      ],
      diagnosis: [
        "Product → Sales tab → Create on Order",
        "Cek tipe produk Service",
      ],
      solution: [
        "Set Create a Project / Task",
        "Confirm SO baru untuk uji",
      ],
      prevention: "Standarkan produk jasa template dengan create-on-order",
    },
  ],
  behind: {
    models: [
      "project.project",
      "project.task",
      "project.task.type",
      "project.tags",
      "project.milestone",
      "account.analytic.line",
      "sale.order",
      "res.partner",
    ],
    relations: [
      "project.task.project_id → project.project",
      "project.task.stage_id → project.task.type",
      "project.project.partner_id → res.partner",
      "account.analytic.line.task_id → project.task",
      "account.analytic.line.project_id → project.project",
    ],
    automations: [
      "stage changes trigger chatter & activities",
      "SO service create project/task on confirm",
      "timesheet amounts roll up to task/project hours",
    ],
    securityNotes: [
      "project.group_project_user vs project.group_project_manager",
      "Privacy fields membatasi visibility lintas tim",
    ],
    note: "Di Odoo 19, project.task tetap pusat eksekusi; jam memakai account.analytic.line yang dishare dengan Timesheets.",
  },
  reporting: [
    {
      name: "Project Overview",
      path: "Project → Reporting → Projects",
      kpi: "Progress, hours spent vs allocated",
      decision: "Intervensi project overrun",
    },
    {
      name: "Tasks Analysis",
      path: "Project → Reporting → Tasks",
      kpi: "Throughput Done, overdue count",
      decision: "Redistribusi beban assignee",
    },
    {
      name: "Timesheet Analysis",
      path: "Timesheets → Reporting / Project timesheets",
      kpi: "Jam billable vs non-billable",
      decision: "Pricing jasa & staffing",
    },
    {
      name: "Profitability",
      path: "Project → Reporting → Profitability (Enterprise)",
      kpi: "Revenue vs cost analytic",
      decision: "Stop/lanjut tipe project merugi",
    },
  ],
  security: {
    roles: [
      {
        role: "Project / User",
        can: [
          "Update task assigned",
          "Encode timesheet di task terlihat",
          "Chatter & activity di project diizinkan",
        ],
        cannot: [
          "Ubah Settings Project",
          "Hapus project massal",
          "Lihat semua project privat orang lain",
        ],
        whyDifferent: "Pelaksana fokus eksekusi, bukan administrasi portofolio.",
      },
      {
        role: "Project / Administrator",
        can: [
          "Semua project sesuai company",
          "Konfigurasi stages & settings",
          "Invite anggota & ubah privacy",
        ],
        cannot: [
          "Post jurnal akuntansi tanpa role finance",
        ],
        whyDifferent: "Admin menjaga struktur & keamanan data proyek.",
      },
    ],
    notes: [
      "Portal customer bisa lihat project/task jika dibagikan",
      "Timesheet approval terpisah di modul Timesheets",
    ],
  },
  levels: {
    beginner: [
      "Buat project & task sederhana",
      "Assign & geser stage",
      "Pahami My Tasks vs Projects",
      "Tutup task Done",
    ],
    intermediate: [
      "Sub-tasks & deadlines",
      "Timesheets pada task",
      "Project dari SO service",
      "Allocated vs spent hours",
    ],
    advanced: [
      "Milestones & dependencies",
      "Profitability reporting",
      "Template project berulang",
      "Privacy & portal sharing",
    ],
    expert: [
      "Desain stage WIP limits",
      "Integrasi Planning/Helpdesk",
      "Kebijakan billable vs non-billable",
      "KPI delivery cycle time",
    ],
  },
  exercises: [
    {
      id: "ex-proj-create",
      title: "Project delivery jasa retail",
      objective: `Project untuk ${customer.name}`,
      prerequisites: ["CRM/Sales optional", "Contacts ada"],
      task: [
        "Buat project dengan customer",
        "Set allocated 8 jam",
        "Undang minimal 1 anggota",
      ],
      expectedResult: "Project aktif di daftar",
      checklist: ["Customer benar", "PM terisi"],
    },
    {
      id: "ex-proj-tasks",
      title: "Tiga task berurutan",
      objective: "Board terisi kerja nyata",
      prerequisites: ["Project ada"],
      task: [
        "Buat 3 task terkait pengiriman",
        "Assign & deadline",
        "Satu task In Progress",
      ],
      expectedResult: "Kanban menampilkan distribusi stage",
      checklist: ["Tidak ada unassigned aktif", "Judul spesifik"],
    },
    {
      id: "ex-proj-timesheet",
      title: "Timesheet 1.5 jam",
      objective: "Jam tertaut task",
      prerequisites: ["Timesheets aktif"],
      task: ["Encode 1.5h", "Done-kan task", "Cek hours spent project"],
      expectedResult: "Hours Spent ≥ 1.5",
      checklist: ["Description terisi", "Date benar"],
    },
    {
      id: "ex-proj-distributor",
      title: "Onboarding distributor",
      objective: `Project ${distributor.name} dengan milestone mental (atau fitur milestone)`,
      prerequisites: ["Contact distributor"],
      task: [
        "Buat project onboarding",
        "Task survey, training, go-live",
        "Laporkan overdue jika ada",
      ],
      expectedResult: "Tiga task terencana sampai go-live",
      checklist: ["Customer = distributor", "Deadline masuk akal"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Timesheets", href: "/materi/timesheets" },
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Core Flow Sales", href: "/modul/flow-sales" },
    { label: "Deep Dive Employees", href: "/materi/employees" },
    { label: "Invoicing & Payment", href: "/modul/flow-invoicing" },
  ],
};
