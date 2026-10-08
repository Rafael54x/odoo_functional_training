import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const company = seed.company;
const customer = seed.customers.toko;
const jasa = seed.products.jasa;

/**
 * Deep Dive — Employees / HR (Wave 2)
 * Master karyawan, departemen, job — fondasi apps HR & Timesheets.
 */
export const employeesDeepDive: DeepDiveModule = {
  slug: "employees",
  name: "Employees — HR Master Data",
  shortTitle: "Employees",
  icon: "IdCard",
  category: "hr",
  wave: 2,
  availability: "available",
  apps: ["Employees", "Timesheets", "Project", "Approvals"],
  overview: {
    function:
      "Modul Employees (hr.employee) adalah master data karyawan: identitas, departemen, jabatan, atasan, lokasi kerja, dan tautan ke res.users. Di Odoo 19 Enterprise, Employees menjadi fondasi Timesheets, Time Off, Attendance, Payroll, dan Approvals.",
    businessProblem:
      "Tanpa master karyawan rapi, timesheet tidak punya pemilik, org chart kacau, approval tidak jelas, dan akses aplikasi tidak selaras dengan struktur organisasi.",
    typicalUsers: [
      "HR Officer / HR Admin",
      "Department Manager",
      "Employee (self-service profil terbatas)",
      "IT / Access Admin (link user)",
    ],
    whenNeeded:
      "Sebelum mengaktifkan Timesheets, Time Off, atau alur approval berbasis manager — minimal saat tim >1 orang perlu identitas resmi di sistem.",
    relatedModules: [
      "Users & Companies",
      "Timesheets",
      "Time Off",
      "Attendances",
      "Project",
      "Payroll (opsional)",
    ],
    businessScenario: `${company.name} mempekerjakan staf Sales, Warehouse, Finance, dan Service Delivery. HR membuat employee records, menyusun Department (Sales, Operations, Finance), menautkan Related User, dan menunjuk Manager agar timesheet project ${jasa.name} untuk ${customer.name} serta approval cuti punya jalur yang benar.`,
  },
  prerequisites: {
    modules: ["Employees", "Contacts (otomatis terkait partner)", "Users untuk login"],
    masterData: [
      "Departments (hr.department)",
      "Job Positions (hr.job) opsional tapi disarankan",
      "Work locations / company address",
      "Users yang akan ditautkan",
    ],
    configuration: [
      "Employees → Configuration → Settings (presence, skills — sesuai lab)",
      "Departments hierarchy",
      "Default company & working calendar jika ada",
    ],
    access: [
      "Employees / Officer: kelola data karyawan",
      "Employees / Administrator: struktur & settings",
      "Employee: lihat/edit terbatas profil sendiri",
    ],
    relationships:
      "hr.employee.user_id → res.users; parent_id/manager_id membentuk hierarki; department_id mengelompokkan; work_contact_id/address terkait res.partner.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Employees'",
      "Install aplikasi Employees",
      "Menu Employees muncul di App Switcher",
    ],
    dependencies: [
      "Contacts",
      "Discuss (chatter)",
      "Apps HR lain bisa diinstall kemudian di atas fondasi ini",
    ],
    afterInstall: [
      "Buat Departments inti",
      "Buat Job Positions utama",
      "Create employees dan link Related User",
      "Set Manager untuk rantai approval",
    ],
    newMenus: [
      "Employees → Employees",
      "Employees → Department",
      "Employees → Configuration → Job Positions",
      "Employees → Configuration → Settings",
      "Employees → Reporting (org chart / skills jika ada)",
    ],
    newSettings: [
      "Settings → Employees → Employees",
      "Settings → Employees → Work Organization",
      "Settings → Employees → Employee Update Rights",
    ],
  },
  configurations: [
    {
      id: "emp-presence",
      name: "Presence Control / Attendance link",
      location: "Settings → Employees → Presence control",
      what: "Menampilkan status kehadiran/presence karyawan di direktori.",
      whyEnable:
        "Manajer tahu siapa available sebelum assign task mendesak.",
      whenEnable:
        "Kantor hybrid atau butuh indikator online/onsite.",
      whenNot:
        "Tim fully async tanpa Attendance — indikator menyesatkan.",
      businessExample: `PM cek presence sebelum assign task urgent delivery ke ${customer.name}.`,
      impact:
        "Ikon presence di kanban/list Employees; integrasi Attendance jika terpasang.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-employees.png",
        caption: "Direktori Employees — presence & organisasi terlihat di list/kanban",
        whatYouSee: "Daftar karyawan Odoo 19",
      },
    },
    {
      id: "emp-skills",
      name: "Skills Management",
      location: "Settings → Employees → Skills Management",
      what: "Skill & level pada profil karyawan.",
      whyEnable:
        "Mencari siapa yang bisa training portal / operasi gudang.",
      whenEnable:
        "Resource allocation berbasis kompetensi.",
      whenNot:
        "Organisasi sangat kecil — skill matrix overkill.",
      businessExample:
        "Tag skill 'Odoo Sales' & 'Warehouse Ops' untuk penugasan project.",
      impact:
        "Tab Skills di employee; filter berdasarkan skill.",
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] Tab Skills pada form Employee setelah Skills Management aktif",
      },
    },
    {
      id: "emp-advanced-fields",
      name: "Advanced HR Fields (Family, Education, etc.)",
      location: "Settings → Employees → Employee data / extra info",
      what: "Field tambahan personal & administratif.",
      whyEnable:
        "HR lokal butuh data lengkap untuk compliance & payroll nanti.",
      whenEnable:
        "Menuju implementasi Payroll / benefit.",
      whenNot:
        "Fase awal lab fungsional — cukup identitas kerja inti.",
      businessExample:
        "Isi private address & emergency contact untuk karyawan tetap.",
      impact:
        "Tab Private Information / HR settings bertambah field.",
    },
    {
      id: "emp-update-rights",
      name: "Employee Self-Update Rights",
      location: "Settings → Employees → Employee Update Rights",
      what: "Menentukan field apa yang boleh diubah karyawan sendiri.",
      whyEnable:
        "Mengurangi beban HR untuk update telepon/rekening sambil jaga field kritis.",
      whenEnable:
        "Self-service HR diaktifkan.",
      whenNot:
        "Semua perubahan harus lewat HR Officer (kontrol ketat).",
      businessExample:
        "Karyawan boleh ubah Mobile Work, tidak boleh ubah Department.",
      impact:
        "Form self-service membatasi editable fields.",
    },
    {
      id: "emp-org-chart",
      name: "Organization Chart",
      location: "Employees → Org Chart (dari Manager hierarchy)",
      what: "Visual hierarki berdasarkan Manager pada employee.",
      whyEnable:
        "Memvalidasi rantai approval Time Off / Expenses / Timesheets.",
      whenEnable:
        "Struktur >1 level management.",
      whenNot:
        "Flat organization 3 orang — chart kurang bermanfaat.",
      businessExample:
        "Sales Rep → Sales Manager → General Manager di ${company.name}.",
      impact:
        "Menu/smart button Org Chart; manager_id wajib konsisten.",
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] Organization Chart Employees di Odoo 19 Enterprise",
      },
    },
    {
      id: "emp-work-location",
      name: "Work Locations",
      location: "Employees → Configuration → Work Locations (atau field di employee)",
      what: "Lokasi kerja (Kantor Jakarta, Gudang, Remote).",
      whyEnable:
        "Reporting headcount per lokasi & planning onsite.",
      whenEnable:
        "Multi-site atau hybrid.",
      whenNot:
        "Semua orang satu kantor tetap.",
      businessExample:
        `Warehouse staff di lokasi gudang; consultant sering di site ${customer.name}.`,
      impact:
        "Field Work Location di employee; filter direktori.",
    },
  ],
  masterData: [
    {
      id: "md-emp-department",
      name: "Department (hr.department)",
      purpose: "Unit organisasi untuk grouping karyawan dan approval.",
      required: true,
      whyNeeded:
        "Tanpa department, laporan headcount & filter manajerial lemah.",
      fields: [
        {
          field: "Department Name",
          type: "Char",
          required: true,
          purpose: "Nama unit",
          why: "Label organisasi",
          example: "Operations",
          impactIfEmpty: "Tidak tersimpan",
        },
        {
          field: "Manager",
          type: "Many2one",
          required: false,
          purpose: "Kepala departemen",
          why: "Default approval path",
          example: "Siti Operations Lead",
          impactIfEmpty: "Approval jatuh ke manager personal saja",
          related: "hr.employee",
        },
        {
          field: "Parent Department",
          type: "Many2one",
          required: false,
          purpose: "Hierarki dept",
          why: "Org besar multi-level",
          example: "General Management",
          impactIfEmpty: "Dept root",
          related: "hr.department",
        },
        {
          field: "Company",
          type: "Many2one",
          required: false,
          purpose: "Multi-company",
          why: "Isolasi data",
          example: company.name,
          impactIfEmpty: "Shared / current company",
          related: "res.company",
        },
      ],
    },
    {
      id: "md-emp-job",
      name: "Job Position (hr.job)",
      purpose: "Jabatan/peran rekrutmen & penempatan.",
      required: false,
      whyNeeded:
        "Menstandarkan nama peran; berguna untuk Recruitment nanti.",
      fields: [
        {
          field: "Job Position",
          type: "Char",
          required: true,
          purpose: "Nama jabatan",
          why: "Konsistensi title",
          example: "Sales Representative",
          impactIfEmpty: "Invalid",
        },
        {
          field: "Department",
          type: "Many2one",
          required: false,
          purpose: "Dept default",
          why: "Saat hire mengisi otomatis",
          example: "Sales",
          impactIfEmpty: "Harus diisi manual di employee",
          related: "hr.department",
        },
        {
          field: "Expected New Employees",
          type: "Integer",
          required: false,
          purpose: "Target headcount",
          why: "Recruitment planning",
          example: "2",
          impactIfEmpty: "Tidak ada sinyal hiring",
        },
        {
          field: "Company",
          type: "Many2one",
          required: false,
          purpose: "Entitas",
          why: "Multi-company jobs",
          example: company.name,
          impactIfEmpty: "Current company",
        },
      ],
    },
    {
      id: "md-emp-employee",
      name: "Employee (hr.employee)",
      purpose: "Profil karyawan operasional & HR.",
      required: true,
      whyNeeded:
        "Semua app HR/Timesheets mereferensi employee, bukan hanya user.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama lengkap",
          why: "Identitas resmi",
          example: "Andi Pratama",
          impactIfEmpty: "Tidak bisa simpan",
        },
        {
          field: "Work Email / Phone",
          type: "Char",
          required: false,
          purpose: "Kontak kerja",
          why: "Komunikasi & undangan",
          example: "andi@nusantara-demo.test",
          impactIfEmpty: "Notifikasi kurang",
        },
        {
          field: "Department",
          type: "Many2one",
          required: false,
          purpose: "Unit kerja",
          why: "Grouping & reporting",
          example: "Operations",
          impactIfEmpty: "Filter dept kosong",
          related: "hr.department",
        },
        {
          field: "Job Position",
          type: "Many2one",
          required: false,
          purpose: "Jabatan",
          why: "Peran resmi",
          example: "Service Consultant",
          impactIfEmpty: "Title tidak standar",
          related: "hr.job",
        },
        {
          field: "Manager",
          type: "Many2one",
          required: false,
          purpose: "Atasan langsung",
          why: "Approval chain",
          example: "Siti Operations Lead",
          impactIfEmpty: "Time Off/Expense tanpa approver jelas",
          related: "hr.employee",
        },
        {
          field: "Related User",
          type: "Many2one",
          required: false,
          purpose: "Akun login",
          why: "Portal app & timesheets",
          example: "andi",
          impactIfEmpty: "Tidak bisa My Timesheets / self service",
          related: "res.users",
        },
        {
          field: "Work Address / Location",
          type: "Many2one",
          required: false,
          purpose: "Lokasi kerja",
          why: "Multi-site",
          example: `${company.city} Office`,
          impactIfEmpty: "Default company address",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-employee-form-new.png",
        caption: "Form Employee baru — field inti hr.employee",
        whatYouSee: "Form create employee",
        whatToFill: "Name, Department, Job, Manager, Related User",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "users", label: "Users" },
      { id: "employees", label: "Employees" },
      { id: "dept", label: "Departments / Jobs" },
      { id: "timesheets", label: "Timesheets / Project" },
      { id: "hrapps", label: "Time Off / Attendance / Payroll" },
    ],
    edges: [
      {
        from: "users",
        to: "employees",
        why: "Related User menghubungkan login ke hr.employee",
      },
      {
        from: "dept",
        to: "employees",
        why: "Department & Job mengisi struktur organisasi",
      },
      {
        from: "employees",
        to: "timesheets",
        why: "Timesheet line membutuhkan employee",
      },
      {
        from: "employees",
        to: "hrapps",
        why: "Cuti, absensi, gaji bertumpu master employee",
      },
    ],
    summary:
      "Employees mengikat Users ke struktur organisasi (Dept/Job/Manager) dan membuka seluruh app HR serta Timesheets/Project.",
  },
  forms: [
    {
      id: "form-employee",
      name: "Employee Form (hr.employee)",
      menuPath: "Employees → Employees → New",
      fields: [
        {
          field: "Name",
          required: true,
          purpose: "Nama karyawan",
          why: "Identitas",
          example: "Budi Santoso",
        },
        {
          field: "Department",
          required: false,
          purpose: "Dept",
          why: "Org structure",
          example: "Sales",
        },
        {
          field: "Job Position",
          required: false,
          purpose: "Jabatan",
          why: "Peran",
          example: "Sales Representative",
        },
        {
          field: "Manager",
          required: false,
          purpose: "Atasan",
          why: "Approval",
          example: "Administrator",
        },
        {
          field: "Work Email",
          required: false,
          purpose: "Email kerja",
          why: "Komunikasi",
          example: "budi@nusantara-demo.test",
        },
        {
          field: "Related User",
          required: false,
          purpose: "User login",
          why: "Akses app",
          example: "budi",
        },
        {
          field: "Work Mobile",
          required: false,
          purpose: "No. HP kerja",
          why: "Kontak cepat",
          example: "+62 812 0000 1111",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-employee-form-new.png",
        caption: "Form New Employee di Odoo 19",
        whatToFill: "Name, Department, Job, Manager, Related User",
      },
    },
    {
      id: "form-department",
      name: "Department Form (hr.department)",
      menuPath: "Employees → Department → New",
      fields: [
        {
          field: "Department Name",
          required: true,
          purpose: "Nama",
          why: "Wajib",
          example: "Finance",
        },
        {
          field: "Manager",
          required: false,
          purpose: "Kepala dept",
          why: "Approval dept",
          example: "Dewi Finance Lead",
        },
        {
          field: "Parent Department",
          required: false,
          purpose: "Induk",
          why: "Hierarki",
          example: "General Management",
        },
        {
          field: "Company",
          required: false,
          purpose: "Perusahaan",
          why: "Multi-company",
          example: company.name,
        },
      ],
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] Form Department (Employees → Department → New)",
      },
    },
  ],
  procedures: [
    {
      id: "proc-emp-dept-job",
      title: "Setup Department dan Job Position",
      goal: "Struktur org minimal siap dipakai employee baru.",
      preparation: ["Employees app terpasang", "Hak Officer/Admin"],
      steps: [
        "Employees → Department → New → Operations",
        "New → Sales; New → Finance",
        "Configuration → Job Positions → New: Service Consultant (Dept Operations)",
        "New: Sales Representative (Dept Sales)",
        "Simpan semua",
      ],
      expectedResult: "3 department & 2 job tersedia di many2one employee.",
      verification: [
        "Department list terisi",
        "Job menampilkan department terkait",
      ],
      fillFields: [
        {
          field: "Department Name",
          value: "Operations",
          where: "Department form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Job Position",
          value: "Service Consultant",
          where: "Job form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Department (on Job)",
          value: "Operations",
          where: "Job form",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-employees.png",
        caption: "Direktori Employees setelah struktur mulai dipakai",
      },
    },
    {
      id: "proc-emp-create-link-user",
      title: "Buat Employee dan tautkan User",
      goal: "Karyawan bisa login dan muncul di Timesheets.",
      preparation: [
        "User login sudah dibuat di Settings → Users",
        "Department & Job siap",
      ],
      steps: [
        "Employees → New",
        "Name: Andi Pratama",
        "Department: Operations; Job: Service Consultant",
        "Manager: pilih atasan",
        "Work Email sesuai user",
        "Related User: pilih user Andi",
        "Save",
      ],
      expectedResult: "hr.employee aktif dengan user_id terisi.",
      verification: [
        "Kartu employee di kanban/list",
        "User Andi → preferensi/employee terkait terlihat",
        "Timesheets My Timesheets tidak error employee missing",
      ],
      fillFields: [
        {
          field: "Name",
          value: "Andi Pratama",
          where: "Header",
          how: "Ketik",
          required: true,
        },
        {
          field: "Department",
          value: "Operations",
          where: "Work Information",
          how: "Pilih",
        },
        {
          field: "Job Position",
          value: "Service Consultant",
          where: "Work Information",
          how: "Pilih",
        },
        {
          field: "Related User",
          value: "andi",
          where: "HR Settings / Work Information",
          how: "Pilih",
          required: true,
          note: "Nama user menyesuaikan lab",
        },
        {
          field: "Manager",
          value: "Administrator / Siti Operations Lead",
          where: "Work Information",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-employee-form-new.png",
        caption: "Form Employee saat menautkan Related User",
      },
    },
    {
      id: "proc-emp-manager-chain",
      title: "Susun rantai Manager",
      goal: "Org chart & approval path valid untuk 3 level sederhana.",
      preparation: ["Minimal 3 employee records"],
      steps: [
        "Tentukan GM / Admin sebagai top manager",
        "Set Manager Sales Rep → Sales Lead",
        "Set Manager Service Consultant → Operations Lead",
        "Set Manager Leads → GM",
        "Buka Org Chart — verifikasi pohon",
      ],
      expectedResult: "Tidak ada siklus manager; setiap staf punya atasan kecuali top.",
      verification: [
        "Org chart tidak putus",
        "Field Manager terisi di staf operasional",
      ],
      fillFields: [
        {
          field: "Manager (Sales Rep)",
          value: "Sales Lead",
          where: "Employee form",
          how: "Pilih",
          required: true,
        },
        {
          field: "Manager (Consultant)",
          value: "Operations Lead",
          where: "Employee form",
          how: "Pilih",
          required: true,
        },
        {
          field: "Manager (Leads)",
          value: "Administrator",
          where: "Employee form",
          how: "Pilih",
        },
      ],
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] Org Chart menampilkan rantai Manager 3 level",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-emp-onboard",
      title: "Onboarding karyawan baru",
      whenToUse: "Hire staf baru sebelum beri akses app.",
      flow: [
        "Buat User dengan group sesuai peran",
        "Buat Employee + Related User",
        "Set Dept/Job/Manager",
        "Uji login & Timesheets",
      ],
    },
    {
      id: "sc-emp-transfer",
      title: "Mutasi antar department",
      whenToUse: "Sales pindah ke Operations.",
      flow: [
        "Update Department & Job",
        "Ganti Manager",
        "Review project/timesheet ongoing",
        "Komunikasi akses app jika perlu",
      ],
    },
    {
      id: "sc-emp-offboard",
      title: "Offboarding",
      whenToUse: "Karyawan keluar.",
      flow: [
        "Archive employee",
        "Deactivate / hapus hak user",
        "Reassign task & approval",
        "Pastikan timesheet historis tetap terbaca",
      ],
      notes: "Jangan hapus hard record yang punya history transaksi.",
    },
    {
      id: "sc-emp-shared-service",
      title: "Resource shared ke Project",
      whenToUse: "Consultant melayani ${customer.name} & internal.",
      flow: [
        "Employee Operations",
        "Invite ke project customer",
        "Encode timesheet",
        "Manager review jam",
      ],
    },
  ],
  integrations: [
    {
      id: "int-emp-users",
      withModule: "Users & Companies",
      relationship: "hr.employee.user_id ↔ res.users",
      whatHappens:
        "Hak akses app ditentukan di Users; identitas HR di Employees — keduanya harus selaras.",
    },
    {
      id: "int-emp-timesheets",
      withModule: "Timesheets",
      relationship: "analytic line.employee_id",
      whatHappens:
        "Tanpa employee linked, My Timesheets gagal; laporan jam per orang memakai master ini.",
    },
    {
      id: "int-emp-project",
      withModule: "Project",
      relationship: "assignees (users) & timesheet employees",
      whatHappens:
        "Task di-assign ke user; biaya/jam tetap dilaporkan lewat employee.",
    },
    {
      id: "int-emp-timeoff",
      withModule: "Time Off / Approvals",
      relationship: "manager_id approval",
      whatHappens:
        "Pengajuan cuti/expense mencari manager employee sebagai approver default.",
    },
  ],
  mistakes: [
    {
      id: "m-emp-no-user-link",
      problem: "Employee tanpa Related User",
      why: "Timesheets & self-service tidak jalan",
      detect: "User login tidak punya employee; error encode jam",
      fix: "Isi Related User; pastikan 1:1",
      prevent: "Checklist onboarding: User → Employee → Manager",
    },
    {
      id: "m-emp-manager-cycle",
      problem: "Siklus Manager (A→B→A)",
      why: "Org chart & approval infinite/loop logic",
      detect: "Chart aneh; approval tidak pernah selesai",
      fix: "Putuskan siklus; tetapkan top manager",
      prevent: "Review org chart setelah setiap mutasi",
    },
    {
      id: "m-emp-duplicate",
      problem: "Duplikat employee untuk orang sama",
      why: "Timesheet terpecah; headcount salah",
      detect: "Dua record nama/email sama",
      fix: "Archive duplikat; merge historis hati-hati",
      prevent: "Cari email kerja sebelum New",
    },
    {
      id: "m-emp-wrong-company",
      problem: "Employee di company salah (multi-company)",
      why: "Tidak muncul di filter; timesheet beda entitas",
      detect: "Record hilang saat ganti company di UI",
      fix: "Set company benar / allowed companies user",
      prevent: "Standar company saat create dari template",
    },
  ],
  troubleshooting: [
    {
      id: "t-emp-not-in-timesheet",
      problem: "Karyawan tidak muncul di dropdown timesheet",
      causes: [
        "Employee archived",
        "Company mismatch",
        "Tidak punya user / bukan employee aktif",
      ],
      diagnosis: [
        "Cek Active checkbox",
        "Cek Company field",
        "Cek Related User",
      ],
      solution: [
        "Unarchive",
        "Samakan company",
        "Link user",
      ],
      prevention: "Audit bulanan employee aktif vs user aktif",
    },
    {
      id: "t-emp-cannot-create",
      problem: "Tidak bisa create employee (access error)",
      causes: ["Bukan Officers", "Record rules multi-company"],
      diagnosis: [
        "Settings → Users → groups Employees",
        "Cek companies pada user",
      ],
      solution: [
        "Tambah group Officers",
        "Enable company yang relevan",
      ],
      prevention: "Pisahkan role HR vs employee biasa sejak awal",
    },
    {
      id: "t-emp-org-missing",
      problem: "Org chart kosong / tidak akurat",
      causes: ["Manager kosong", "Manager archived", "Data baru belum refresh"],
      diagnosis: ["Filter employee tanpa Manager", "Cek top-level"],
      solution: [
        "Isi Manager untuk semua non-top",
        "Refresh / reopen org chart",
      ],
      prevention: "Manager wajib di form onboarding",
    },
  ],
  behind: {
    models: [
      "hr.employee",
      "hr.department",
      "hr.job",
      "hr.work.location",
      "hr.employee.public",
      "res.users",
      "res.partner",
    ],
    relations: [
      "hr.employee.user_id → res.users",
      "hr.employee.department_id → hr.department",
      "hr.employee.job_id → hr.job",
      "hr.employee.parent_id → hr.employee (manager)",
      "hr.department.manager_id → hr.employee",
      "hr.employee.work_contact_id → res.partner",
    ],
    automations: [
      "creating employee may create/link partner contact",
      "user-employee sync for name/email in some flows",
      "archive employee impacts presence in dropdowns",
    ],
    securityNotes: [
      "hr.group_hr_user (Officer) vs hr.group_hr_manager",
      "Private fields (bank, ID) lebih ketat dari public employee profile",
    ],
    note: "Di Odoo 19, hr.employee tetap fondasi HR; field private vs work dipisah untuk privasi.",
  },
  reporting: [
    {
      name: "Employees Directory",
      path: "Employees → Employees",
      kpi: "Headcount aktif per dept/lokasi",
      decision: "Hiring & redistribusi",
    },
    {
      name: "Org Chart",
      path: "Employees → Org Chart",
      kpi: "Kedalaman & span of control",
      decision: "Rancang ulang struktur approval",
    },
    {
      name: "Contracts / Status (jika ada)",
      path: "Employees reporting / contracts",
      kpi: "Tetap vs kontrak",
      decision: "Perencanaan payroll",
    },
    {
      name: "Skills Matrix (jika aktif)",
      path: "Employees → Skills",
      kpi: "Coverage skill kritis",
      decision: "Training & staffing project",
    },
  ],
  security: {
    roles: [
      {
        role: "Employee (User)",
        can: ["Lihat direktori publik", "Edit field self-service yang diizinkan"],
        cannot: ["Ubah gaji/private orang lain", "Reorder department massal"],
        whyDifferent: "Privasi data pribadi & pemisahan tugas HR.",
      },
      {
        role: "Employees / Officer",
        can: [
          "Create/update employees",
          "Kelola dept/job operasional",
          "Siapkan data untuk Timesheets/Time Off",
        ],
        cannot: ["Beberapa konfigurasi teknis hanya Manager"],
        whyDifferent: "HR operasional vs arsitek proses HR.",
      },
      {
        role: "Employees / Administrator",
        can: ["Settings Employees", "Struktur penuh", "Akses field sensitif sesuai group"],
        cannot: ["Mengelola ACL teknis tanpa Settings / Administration"],
        whyDifferent: "Kendali kebijakan master data SDM.",
      },
    ],
    notes: [
      "Pisahkan group Accounting Payroll dari HR Officer jika segregasi wajib",
      "Related User jangan dishare antar dua employee",
    ],
  },
  levels: {
    beginner: [
      "Buat department",
      "Buat employee sederhana",
      "Pahami perbedaan User vs Employee",
      "Isi manager",
    ],
    intermediate: [
      "Link Related User",
      "Job positions & work location",
      "Org chart sehat",
      "Siapkan data untuk Timesheets",
    ],
    advanced: [
      "Skills matrix",
      "Self-update rights",
      "Multi-company employees",
      "Onboarding/offboarding checklist",
    ],
    expert: [
      "Integrasi Recruitment→Employee",
      "Desain approval hierarchy lintas app",
      "Data privacy & private fields policy",
      "Headcount planning dengan jobs",
    ],
  },
  exercises: [
    {
      id: "ex-emp-structure",
      title: "Struktur 3 department",
      objective: "Sales, Operations, Finance siap",
      prerequisites: ["Employees installed"],
      task: ["Buat 3 dept", "Isi manager dept jika sudah ada employee admin", "Screenshot list dept"],
      expectedResult: "Department many2one terisi",
      checklist: ["Nama jelas", "Company benar"],
    },
    {
      id: "ex-emp-create",
      title: "Employee + user link",
      objective: "Andi Pratama siap timesheet",
      prerequisites: ["User Andi ada atau buat dulu"],
      task: [
        "Create employee",
        "Set dept/job/manager",
        "Related User",
        "Uji My Timesheets",
      ],
      expectedResult: "Encode jam tidak error missing employee",
      checklist: ["1 user = 1 employee", "Email konsisten"],
    },
    {
      id: "ex-emp-org",
      title: "Rantai manager 3 level",
      objective: "Org chart valid",
      prerequisites: ["≥3 employees"],
      task: ["Set managers", "Buka org chart", "Perbaiki cycle jika ada"],
      expectedResult: "Pohon hierarki masuk akal",
      checklist: ["Top tanpa manager", "Tidak ada cycle"],
    },
    {
      id: "ex-emp-project-ready",
      title: "Siapkan resource project jasa",
      objective: `Consultant siap kerja ${jasa.name}`,
      prerequisites: ["Project & Timesheets terpasang"],
      task: [
        "Pastikan employee Operations",
        "Invite user ke project customer",
        "Encode 1 jam uji",
      ],
      expectedResult: "Jam muncul atas nama employee benar",
      checklist: ["Department Operations", "Timesheet employee match"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Users", href: "/materi/users" },
    { label: "Deep Dive Timesheets", href: "/materi/timesheets" },
    { label: "Deep Dive Project", href: "/materi/project" },
    { label: "Master Contacts", href: "/modul/master-contacts" },
    { label: "Settings Deep Dive", href: "/materi/settings" },
  ],
};
