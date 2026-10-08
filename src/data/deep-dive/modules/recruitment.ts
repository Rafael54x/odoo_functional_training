import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const company = seed.company;
const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const jasa = seed.products.jasa;
const kopi = seed.products.kopi;

/**
 * Deep Dive — Recruitment
 * Job Positions, Applicant pipeline, interview, offer/refuse, handoff ke Employees.
 */
export const recruitmentDeepDive: DeepDiveModule = {
  slug: "recruitment",
  name: "Recruitment — Hiring Pipeline",
  shortTitle: "Recruitment",
  icon: "UserPlus",
  category: "hr",
  wave: 3,
  availability: "available",
  apps: ["Recruitment", "Employees", "Discuss", "Calendar"],
  overview: {
    function:
      "Modul Recruitment mengelola siklus hiring: membuka Job Position, menerima Application/Applicant, memindahkan stage (New → Interview → Contract Proposal → Hired / Refused), menjadwalkan wawancara, menolak atau menawarkan, lalu Create Employee ke master Employees. Di Odoo 19 Enterprise, model inti adalah hr.job dan hr.applicant dengan kanban stage per job.",
    businessProblem:
      "Tanpa Recruitment, lowongan tersebar di chat/email, status kandidat tidak jelas, interviewer tidak terjadwal, dan handoff ke HR Employees sering kehilangan data (nama, email, job, department).",
    typicalUsers: [
      "Recruiter / HR Officer",
      "Hiring Manager (Department Manager)",
      "Interviewer (Sales Lead / Operations Lead)",
      "HR Administrator (settings & stages)",
    ],
    whenNeeded:
      "Saat headcount bertambah terencana — misalnya menambah Sales Rep atau Service Consultant — dan proses seleksi perlu jejak stage, refuse reason, serta konversi ke employee resmi.",
    relatedModules: [
      "Employees",
      "Contacts",
      "Discuss",
      "Calendar",
      "Website / Jobs page (opsional)",
      "Referrals (opsional)",
    ],
    businessScenario: `${company.name} membuka lowongan Sales Representative (dukung pipeline ${customer.name} & ${distributor.name}) dan Service Consultant (delivery ${jasa.name}). Recruiter mempublikasikan Job Position, menerima applicant, menjadwalkan interview, menolak yang tidak cocok, menawarkan ke kandidat terpilih, lalu Create Employee agar siap Timesheets dan org chart Employees.`,
  },
  prerequisites: {
    modules: [
      "Recruitment app terpasang",
      "Employees (untuk handoff Create Employee)",
      "Contacts / Discuss (chatter & email)",
    ],
    masterData: [
      "Departments di Employees (Sales, Operations, Finance)",
      "Job Positions (hr.job) — boleh dibuat dari Recruitment atau Employees",
      "Recruiter sebagai employee/user dengan hak Recruitment",
      "Interviewers (employee) untuk activity Meeting/Call",
    ],
    configuration: [
      "Recruitment → Configuration → Settings (Online Posting, Interview Form, dll.)",
      "Stages per Job Position (atau default stages)",
      "Refuse Reasons",
      "Degree / Sources (opsional)",
    ],
    access: [
      "Recruitment / Officer: kelola job & applicant operasional",
      "Recruitment / Administrator: settings, stages, refuse reasons",
      "Employees / Officer: menyempurnakan employee setelah Create Employee",
    ],
    relationships:
      "hr.applicant.job_id → hr.job; stage_id menggerakkan kanban; Create Employee membuat hr.employee (department/job dari lowongan). Recruiter & interviewer merujuk employee/user. Link Employees deep dive untuk master pasca-hire.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Recruitment'",
      "Install aplikasi Recruitment",
      "Menu Recruitment muncul di App Switcher",
    ],
    dependencies: [
      "Employees (fondasi HR — job & employee handoff)",
      "Contacts / mail (chatter, email)",
      "Calendar membantu interview Meeting",
    ],
    afterInstall: [
      "Buka Recruitment → Configuration → Settings sesuai kebutuhan lab",
      "Buat/review Job Positions (Sales Representative, Service Consultant)",
      "Pastikan stages kanban masuk akal per job",
      "Siapkan Refuse Reasons minimal",
    ],
    newMenus: [
      "Recruitment → Applications → By Job / All Applications",
      "Recruitment → Applications → Applications",
      "Recruitment → Recruitment → Job Positions",
      "Recruitment → Reporting",
      "Recruitment → Configuration → Settings",
      "Recruitment → Configuration → Stages / Refuse Reasons",
    ],
    newSettings: [
      "Settings → Recruitment → Recruitment",
      "Settings → Recruitment → Process",
      "Settings → Recruitment → Job Posting (online/website jika aktif)",
    ],
  },
  configurations: [
    {
      id: "rec-online-posting",
      name: "Online Job Posting / Website Jobs",
      location: "Settings → Recruitment → Online Posting (atau Website Jobs)",
      what: "Memungkinkan lowongan dipublikasikan agar kandidat apply dari luar.",
      whyEnable:
        "Menangkap applicant tanpa entri manual HR untuk setiap CV.",
      whenEnable:
        "Volume hiring tinggi atau ada career page perusahaan.",
      whenNot:
        "Lab fungsional internal — apply manual oleh recruiter sudah cukup.",
      businessExample: `${company.name} publish Job Position Sales Representative; kandidat isi form → hr.applicant baru di stage New.`,
      impact:
        "Tombol Publish / Job Page pada job; applicant masuk otomatis ke pipeline.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-recruitment.png",
        caption: "Settings Recruitment — opsi process & posting di Odoo 19 Enterprise",
        whatYouSee: "Halaman Settings bagian Recruitment",
        why: "Online posting dan opsi proses diaktifkan dari sini sebelum publish job",
      },
    },
    {
      id: "rec-interview-form",
      name: "Interview Form / Survey",
      location: "Settings → Recruitment → Interview Form (Survey)",
      what: "Form penilaian terstruktur yang dikirim ke interviewer atau kandidat.",
      whyEnable:
        "Menstandarkan skor interview antar hiring manager.",
      whenEnable:
        "Beberapa interviewer menilai role yang sama (Sales vs Operations).",
      whenNot:
        "Hiring ad-hoc 1 interviewer — catatan chatter sudah memadai.",
      businessExample:
        "Form skor komunikasi & product knowledge untuk kandidat Sales Rep kopi/jasa.",
      impact:
        "Tombol Send Interview Survey / form linked di applicant; jawaban tersimpan.",
    },
    {
      id: "rec-cv-display",
      name: "CV Display / Résumé on Application",
      location: "Settings → Recruitment → Display CV / Documents",
      what: "Menampilkan lampiran CV di form applicant.",
      whyEnable:
        "Interviewer membuka CV tanpa unduh berulang dari email.",
      whenEnable:
        "Proses seleksi berbasis dokumen (CV, sertifikat).",
      whenNot:
        "Hanya screening singkat via LinkedIn/call — lampiran jarang dipakai.",
      businessExample:
        "CV Service Consultant dilampirkan sebelum interview teknis delivery jasa.",
      impact:
        "Widget/preview dokumen di form hr.applicant.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-applicant.png",
        caption: "Form Applicant — profil kandidat, job, stage, dan area dokumen/CV",
        whatYouSee: "Detail application dengan field inti dan chatter",
      },
    },
    {
      id: "rec-recruitment-team",
      name: "Recruiters & Interviewers on Job",
      location: "Job Position form → Recruiters / Interviewers",
      what: "Menetapkan siapa pemilik lowongan dan siapa yang diundang interview.",
      whyEnable:
        "Notifikasi dan responsibilitas jelas; tidak semua HR melihat semua job.",
      whenEnable:
        "Multi-department hiring paralel (Sales + Operations).",
      whenNot:
        "Satu recruiter tunggal untuk semua lowongan kecil.",
      businessExample: `Job Sales Representative: Recruiter HR, Interviewer Sales Lead yang menangani ${customer.name}.`,
      impact:
        "Follower/notifikasi job & applicant; domain akses sesuai recruiter.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-job-form.png",
        caption: "Form Job Position — department, recruiter, expected employees",
        whatYouSee: "Header job form Recruitment Odoo 19",
        whatToFill: "Job Position, Department, Recruiters, Expected New Employees",
      },
    },
    {
      id: "rec-stages-per-job",
      name: "Application Stages (per Job)",
      location: "Recruitment → Configuration → Stages / Stages on Job",
      what: "Kolom kanban status applicant (New, Initial Qualification, First Interview, Second Interview, Contract Proposal, Hired, Refused).",
      whyEnable:
        "Visual pipeline hiring; bottleneck interview terlihat di board.",
      whenEnable:
        "Selalu — stage adalah tulang punggung Recruitment.",
      whenNot:
        "Jangan buat 12 stage untuk role sederhana; cukup 4–6 tahap.",
      businessExample:
        "Service Consultant: New → Phone Screen → Technical Interview → Offer → Hired.",
      impact:
        "Drag-and-drop applicant antar kolom; reporting per stage.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment.png",
        caption: "Kanban Recruitment — job cards / applications by stage",
        whatYouSee: "Board Recruitment Odoo 19 dengan job atau applicant stages",
        why: "Stage menentukan alur interview → offer → hired",
      },
    },
    {
      id: "rec-refuse-reasons",
      name: "Refuse Reasons",
      location: "Recruitment → Configuration → Refuse Reasons",
      what: "Alasan penolakan terstandar (skill mismatch, salary, no-show, dll.).",
      whyEnable:
        "Analisis kualitas sourcing dan coaching hiring manager.",
      whenEnable:
        "Volume applicant cukup untuk review bulanan.",
      whenNot:
        "Fase awal setup — fokus dulu isi pipeline, lalu wajibkan reason.",
      businessExample:
        "Applicant Sales ditolak reason 'Pengalaman B2B kurang' setelah interview retail vs distributor.",
      impact:
        "Wizard Refuse meminta reason; laporan refused by reason.",
    },
  ],
  masterData: [
    {
      id: "md-rec-job",
      name: "Job Position (hr.job)",
      purpose: "Lowongan / peran yang dibuka untuk hiring dan nanti jadi title employee.",
      required: true,
      whyNeeded:
        "Tanpa job, applicant tidak punya konteks role; Create Employee kehilangan default department/job.",
      fields: [
        {
          field: "Job Position",
          type: "Char",
          required: true,
          purpose: "Nama jabatan/lowongan",
          why: "Identitas role di kanban & website",
          example: "Sales Representative",
          impactIfEmpty: "Tidak bisa simpan job",
        },
        {
          field: "Department",
          type: "Many2one",
          required: false,
          purpose: "Unit organisasi target",
          why: "Default department saat Create Employee",
          example: "Sales",
          impactIfEmpty: "Harus diisi manual di employee",
          related: "hr.department",
        },
        {
          field: "Company",
          type: "Many2one",
          required: false,
          purpose: "Entitas legal",
          why: "Multi-company isolation",
          example: company.name,
          impactIfEmpty: "Current company",
          related: "res.company",
        },
        {
          field: "Expected New Employees",
          type: "Integer",
          required: false,
          purpose: "Target headcount untuk job ini",
          why: "Progress hiring vs kebutuhan",
          example: "2",
          impactIfEmpty: "Tidak ada sinyal kapasitas hiring",
        },
        {
          field: "Recruiters",
          type: "Many2many",
          required: false,
          purpose: "Pemilik operasional lowongan",
          why: "Notifikasi & ownership",
          example: "Siti HR Officer",
          impactIfEmpty: "Semua officer melihat tanpa owner jelas",
          related: "res.users / hr.employee",
        },
        {
          field: "Interviewers",
          type: "Many2many",
          required: false,
          purpose: "Default peserta interview",
          why: "Undangan activity cepat",
          example: "Sales Lead",
          impactIfEmpty: "Interviewer dipilih manual tiap applicant",
        },
        {
          field: "Status (Recruitment in Progress / Closed)",
          type: "Selection",
          required: false,
          purpose: "Apakah job masih menerima applicant",
          why: "Menutup lowongan yang sudah terpenuhi",
          example: "Recruitment in Progress",
          impactIfEmpty: "Default in progress",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-job-form.png",
        caption: "Master Job Position di Recruitment",
        whatYouSee: "Form hr.job",
        whatToFill: "Name, Department, Expected New Employees, Recruiters",
      },
    },
    {
      id: "md-rec-applicant",
      name: "Application / Applicant (hr.applicant)",
      purpose: "Kandidat dalam pipeline satu Job Position.",
      required: true,
      whyNeeded:
        "Semua stage, interview, refuse, dan Create Employee bertumpu pada record applicant.",
      fields: [
        {
          field: "Applicant's Name",
          type: "Char",
          required: true,
          purpose: "Nama kandidat",
          why: "Identitas di kanban",
          example: "Rina Wulandari",
          impactIfEmpty: "Tidak tersimpan",
        },
        {
          field: "Email / Phone",
          type: "Char",
          required: false,
          purpose: "Kontak kandidat",
          why: "Undangan interview & offer",
          example: "rina.wulandari@mail.test",
          impactIfEmpty: "Komunikasi hanya manual di luar sistem",
        },
        {
          field: "Applied Job",
          type: "Many2one",
          required: true,
          purpose: "Lowongan yang dilamar",
          why: "Menempatkan kartu di board job benar",
          example: "Sales Representative",
          impactIfEmpty: "Pipeline tidak terorganisir",
          related: "hr.job",
        },
        {
          field: "Stage",
          type: "Many2one",
          required: true,
          purpose: "Status seleksi",
          why: "Alur kanban",
          example: "First Interview",
          impactIfEmpty: "Default stage New",
          related: "hr.recruitment.stage",
        },
        {
          field: "Recruiter",
          type: "Many2one",
          required: false,
          purpose: "Owner applicant",
          why: "Akuntabilitas follow-up",
          example: "Siti HR Officer",
          impactIfEmpty: "Follow-up mudah tercecer",
        },
        {
          field: "Interviewer(s)",
          type: "Many2many",
          required: false,
          purpose: "Penilai wawancara",
          why: "Activity & feedback",
          example: "Sales Lead",
          impactIfEmpty: "Interview tidak terjadwal ke orang tepat",
        },
        {
          field: "Source / Medium",
          type: "Many2one",
          required: false,
          purpose: "Asal kandidat",
          why: "Efektivitas channel hiring",
          example: "LinkedIn / Referral",
          impactIfEmpty: "Reporting source kosong",
        },
        {
          field: "Salary Expected / Proposed",
          type: "Float/Monetary",
          required: false,
          purpose: "Ekspektasi & tawaran gaji",
          why: "Negosiasi offer",
          example: "8500000",
          impactIfEmpty: "Offer kurang terukur",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-applicant.png",
        caption: "Form Application — field kandidat dan job terkait",
        whatYouSee: "hr.applicant form",
        whatToFill: "Name, Email, Applied Job, Recruiter, Interviewers",
      },
    },
    {
      id: "md-rec-stage",
      name: "Recruitment Stage (hr.recruitment.stage)",
      purpose: "Definisi kolom status di kanban applications.",
      required: true,
      whyNeeded:
        "Tanpa stage, tidak ada alur interview/offer yang terukur.",
      fields: [
        {
          field: "Stage Name",
          type: "Char",
          required: true,
          purpose: "Label kolom",
          why: "Bahasa proses hiring",
          example: "Contract Proposal",
          impactIfEmpty: "Invalid",
        },
        {
          field: "Sequence",
          type: "Integer",
          required: false,
          purpose: "Urutan kolom",
          why: "Alur kiri→kanan masuk akal",
          example: "30",
          impactIfEmpty: "Urutan default tidak terduga",
        },
        {
          field: "Folded in Kanban",
          type: "Boolean",
          required: false,
          purpose: "Melipat kolom Hired/Refused",
          why: "Board tetap fokus ke aktif",
          example: "True untuk Refused",
          impactIfEmpty: "Board penuh kartu historis",
        },
        {
          field: "Hired Stage",
          type: "Boolean",
          required: false,
          purpose: "Menandai stage sukses hire",
          why: "Trigger logic hired / progress job",
          example: "True pada Hired",
          impactIfEmpty: "Progress expected employees kurang akurat",
        },
      ],
    },
    {
      id: "md-rec-refuse",
      name: "Refuse Reason",
      purpose: "Katalog alasan penolakan applicant.",
      required: false,
      whyNeeded:
        "Membuat penolakan terukur, bukan catatan bebas yang sulit digabung.",
      fields: [
        {
          field: "Reason",
          type: "Char",
          required: true,
          purpose: "Teks alasan",
          why: "Standar analisis",
          example: "Skill mismatch",
          impactIfEmpty: "Tidak bisa dipakai di wizard",
        },
        {
          field: "Template (email) opsional",
          type: "Many2one",
          required: false,
          purpose: "Email penolakan otomatis",
          why: "Komunikasi profesional konsisten",
          example: "Recruitment: Refuse",
          impactIfEmpty: "Email manual",
        },
      ],
    },
  ],
  dependencies: {
    nodes: [
      { id: "employees-md", label: "Employees (Dept / Job / Employee)" },
      { id: "recruitment", label: "Recruitment App" },
      { id: "jobs", label: "Job Positions" },
      { id: "applicants", label: "Applications / Stages" },
      { id: "handoff", label: "Create Employee" },
    ],
    edges: [
      {
        from: "employees-md",
        to: "jobs",
        why: "Department & struktur org dari Employees mengisi Job Position",
      },
      {
        from: "recruitment",
        to: "jobs",
        why: "App Recruitment membuka dan mengelola lowongan hr.job",
      },
      {
        from: "jobs",
        to: "applicants",
        why: "Setiap applicant terikat Applied Job dan stage pipeline",
      },
      {
        from: "applicants",
        to: "handoff",
        why: "Applicant Hired → Create Employee ke hr.employee",
      },
      {
        from: "handoff",
        to: "employees-md",
        why: "Employee baru masuk direktori, manager chain, Timesheets",
      },
    ],
    summary:
      "Recruitment mengisi headcount di atas fondasi Employees: Job Position → Applicant stages → Interview/Offer/Refuse → Create Employee kembali ke master HR.",
  },
  forms: [
    {
      id: "form-job",
      name: "Job Position Form (hr.job)",
      menuPath: "Recruitment → Recruitment → Job Positions → New",
      fields: [
        {
          field: "Job Position",
          required: true,
          purpose: "Nama lowongan",
          why: "Wajib",
          example: "Service Consultant",
        },
        {
          field: "Department",
          required: false,
          purpose: "Dept target",
          why: "Handoff employee",
          example: "Operations",
        },
        {
          field: "Expected New Employees",
          required: false,
          purpose: "Kuota hiring",
          why: "Planning",
          example: "1",
        },
        {
          field: "Company",
          required: false,
          purpose: "Perusahaan",
          why: "Multi-company",
          example: company.name,
        },
        {
          field: "Recruiters",
          required: false,
          purpose: "Owner job",
          why: "Notifikasi",
          example: "Administrator / HR Officer",
        },
        {
          field: "Interviewers",
          required: false,
          purpose: "Default interviewer",
          why: "Jadwal interview",
          example: "Operations Lead",
        },
        {
          field: "Job Description",
          required: false,
          purpose: "Uraian peran",
          why: "Publish & alignment hiring manager",
          example: `Delivery ${jasa.name} ke customer retail/distributor`,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-job-form.png",
        caption: "Form New Job Position di Recruitment",
        whatToFill: "Job Position, Department, Expected New Employees, Recruiters",
      },
    },
    {
      id: "form-applicant",
      name: "Application Form (hr.applicant)",
      menuPath: "Recruitment → Applications → New (atau New di kanban job)",
      fields: [
        {
          field: "Applicant's Name",
          required: true,
          purpose: "Nama",
          why: "Identitas",
          example: "Budi Hartono",
        },
        {
          field: "Email",
          required: false,
          purpose: "Email",
          why: "Komunikasi",
          example: "budi.hartono@mail.test",
        },
        {
          field: "Phone",
          required: false,
          purpose: "Telepon",
          why: "Phone screen",
          example: "+62 812 5555 0101",
        },
        {
          field: "Applied Job",
          required: true,
          purpose: "Lowongan",
          why: "Pipeline",
          example: "Sales Representative",
        },
        {
          field: "Recruiter",
          required: false,
          purpose: "Owner",
          why: "Follow-up",
          example: "HR Officer",
        },
        {
          field: "Interviewer",
          required: false,
          purpose: "Penilai",
          why: "Interview",
          example: "Sales Lead",
        },
        {
          field: "Salary Expected",
          required: false,
          purpose: "Ekspektasi",
          why: "Offer",
          example: "8000000",
        },
        {
          field: "LinkedIn / Linked partner",
          required: false,
          purpose: "Profil / contact",
          why: "Deduplikasi & jejak",
          example: "Contact kandidat",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-applicant.png",
        caption: "Form Application baru — siap masuk stage New",
        whatToFill: "Name, Email, Applied Job, Recruiter, Interviewers",
      },
    },
    {
      id: "form-refuse",
      name: "Refuse Application Wizard",
      menuPath: "Applicant form → Refuse",
      fields: [
        {
          field: "Refuse Reason",
          required: true,
          purpose: "Alasan penolakan",
          why: "Analitik & audit",
          example: "Skill mismatch",
        },
        {
          field: "Send Email",
          required: false,
          purpose: "Kirim email penolakan",
          why: "Etika komunikasi kandidat",
          example: "Centang + template default",
        },
      ],
    },
  ],
  procedures: [
    {
      id: "proc-rec-install-open",
      title: "Install Recruitment dan buka app",
      goal: "App Recruitment tersedia di App Switcher untuk ${company.name}.",
      preparation: ["Akses Apps", "Hak install app"],
      steps: [
        "Home → Apps",
        "Cari Recruitment",
        "Install",
        "Buka Recruitment dari App Switcher",
        "Verifikasi menu Job Positions & Applications",
      ],
      expectedResult: "Ikon Recruitment muncul; board/job list dapat dibuka.",
      verification: [
        "Apps menampilkan Recruitment installed",
        "Menu Applications & Job Positions ada",
      ],
      fillFields: [
        {
          field: "Search Apps",
          value: "Recruitment",
          where: "Apps",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-apps.png",
        caption: "Apps — Recruitment siap diinstall / terlihat di katalog",
        whatYouSee: "Kartu aplikasi Recruitment di Apps",
      },
    },
    {
      id: "proc-rec-job-open",
      title: "Buka Job Position Sales Representative",
      goal: "Lowongan Sales aktif dengan kuota dan recruiter jelas.",
      preparation: [
        "Department Sales ada di Employees",
        "Recruitment terpasang",
      ],
      steps: [
        "Recruitment → Job Positions → New",
        "Job Position: Sales Representative",
        "Department: Sales",
        "Expected New Employees: 2",
        "Isi Recruiters & Interviewers (Sales Lead)",
        "Simpan; pastikan status Recruitment in Progress",
        "Opsional: tulis job description terkait penjualan ${kopi.name} & ${jasa.name}",
      ],
      expectedResult: "Kartu job muncul di Recruitment; siap terima applicant.",
      verification: [
        "Job list/kanban menampilkan Sales Representative",
        "Expected New Employees = 2",
        "Department Sales terisi",
      ],
      fillFields: [
        {
          field: "Job Position",
          value: "Sales Representative",
          where: "Job form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Department",
          value: "Sales",
          where: "Job form",
          how: "Pilih",
        },
        {
          field: "Expected New Employees",
          value: "2",
          where: "Job form",
          how: "Ketik",
        },
        {
          field: "Company",
          value: company.name,
          where: "Job form",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-job-form.png",
        caption: "Form Job Position Sales Representative",
      },
    },
    {
      id: "proc-rec-applicant-stages",
      title: "Buat Application dan gerakkan antar stage",
      goal: "Kandidat masuk pipeline dan maju dari New ke Interview.",
      preparation: ["Job Position Sales Representative aktif"],
      steps: [
        "Buka job Sales Representative → New Application",
        "Name: Rina Wulandari; Email & Phone isi",
        "Recruiter: HR Officer; Interviewer: Sales Lead",
        "Save — pastikan stage New / Initial Qualification",
        "Drag atau pilih stage First Interview",
        "Jadwalkan activity Call/Meeting",
      ],
      expectedResult: "Applicant terlihat di kolom interview; activity terjadwal.",
      verification: [
        "Kartu applicant di kanban job benar",
        "Stage bukan Draft kosong",
        "Chatter mencatat perubahan / activity",
      ],
      fillFields: [
        {
          field: "Applicant's Name",
          value: "Rina Wulandari",
          where: "Application form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Email",
          value: "rina.wulandari@mail.test",
          where: "Application form",
          how: "Ketik",
        },
        {
          field: "Applied Job",
          value: "Sales Representative",
          where: "Application form",
          how: "Pilih",
          required: true,
        },
        {
          field: "Recruiter",
          value: "HR Officer",
          where: "Application form",
          how: "Pilih",
        },
        {
          field: "Interviewer",
          value: "Sales Lead",
          where: "Application form",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-app.png",
        caption: "Recruitment app — board job/applicant setelah application masuk",
        whatYouSee: "Tampilan utama Recruitment dengan job atau applications",
      },
    },
    {
      id: "proc-rec-interview",
      title: "Jadwalkan dan selesaikan Interview",
      goal: "Ada jejak wawancara sebelum offer atau refuse.",
      preparation: [
        "Applicant di stage Interview",
        "Interviewer punya user/calendar",
      ],
      steps: [
        "Buka applicant Rina Wulandari",
        "Schedule activity → Meeting / Call 'Interview Sales'",
        "Assign ke Sales Lead; due date jelas",
        "Setelah wawancara: Mark Done + catatan hasil di chatter",
        "Geser ke Contract Proposal jika lolos, atau Refuse jika gagal",
      ],
      expectedResult: "Activity selesai; keputusan stage terdokumentasi.",
      verification: [
        "Activity Done di chatter",
        "Stage berubah sesuai keputusan",
        "Interviewer tercatat di field/followers",
      ],
      fillFields: [
        {
          field: "Activity Type",
          value: "Meeting",
          where: "Schedule Activity",
          how: "Pilih",
          required: true,
        },
        {
          field: "Summary",
          value: "Interview Sales Representative — retail & distributor",
          where: "Schedule Activity",
          how: "Ketik",
          required: true,
        },
        {
          field: "Assigned to",
          value: "Sales Lead",
          where: "Schedule Activity",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment-applicant.png",
        caption: "Applicant form — schedule interview via activity",
      },
    },
    {
      id: "proc-rec-refuse",
      title: "Refuse applicant yang tidak lolos",
      goal: "Penolakan tercatat dengan reason, tidak menghapus historis.",
      preparation: [
        "Applicant kedua untuk latihan",
        "Refuse Reasons sudah ada",
      ],
      steps: [
        "Buat applicant 'Andi Gagal Uji' pada job Sales Representative",
        "Pindah ke Interview lalu putuskan tidak lolos",
        "Klik Refuse",
        "Pilih reason (mis. Skill mismatch)",
        "Opsional kirim email template",
        "Konfirmasi — kartu masuk stage Refused / folded",
      ],
      expectedResult: "Applicant refused dengan reason; job masih open untuk kandidat lain.",
      verification: [
        "Stage Refused / archived dari board aktif",
        "Refuse reason tersimpan",
        "Record tidak dihapus hard",
      ],
      fillFields: [
        {
          field: "Refuse Reason",
          value: "Skill mismatch",
          where: "Refuse wizard",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-recruitment.png",
        caption: "Board Recruitment — kolom Refused biasanya folded",
      },
    },
    {
      id: "proc-rec-offer-hire-employee",
      title: "Offer → Hired → Create Employee",
      goal: "Kandidat lolos menjadi hr.employee di Employees.",
      preparation: [
        "Applicant di Contract Proposal / siap hire",
        "Department & Job selaras Employees",
      ],
      steps: [
        "Isi Salary Proposed pada applicant Rina",
        "Pindah stage Contract Proposal → Hired (atau tombol equivalent)",
        "Klik Create Employee",
        "Lengkapi wizard/form employee (Department Sales, Job, Manager)",
        "Save employee",
        "Buka Employees — pastikan Rina muncul di direktori",
        "Tautkan Related User jika akun login sudah dibuat",
      ],
      expectedResult:
        "hr.employee aktif; job expected employees berkurang/progress terbarui; handoff ke deep dive Employees.",
      verification: [
        "Smart button Employee pada applicant",
        "Record di Employees → Employees",
        "Department/Job terisi dari lowongan",
      ],
      fillFields: [
        {
          field: "Salary Proposed",
          value: "8500000",
          where: "Application form",
          how: "Ketik",
        },
        {
          field: "Stage",
          value: "Hired",
          where: "Application / kanban",
          how: "Pilih / drag",
          required: true,
        },
        {
          field: "Department (Employee)",
          value: "Sales",
          where: "Create Employee / Employees form",
          how: "Pilih",
        },
        {
          field: "Manager",
          value: "Sales Lead",
          where: "Employee form",
          how: "Pilih",
          note: "Lanjut konfigurasi di Deep Dive Employees",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-employees.png",
        caption:
          "Direktori Employees setelah Create Employee — handoff dari Recruitment",
        whatYouSee: "List/kanban karyawan termasuk hasil hire",
        why: "Validasi bahwa applicant Hired sudah menjadi master employee",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-rec-sales-hire",
      title: "Hiring Sales Rep untuk ekspansi retail",
      whenToUse: `Pipeline ${customer.name} & ${distributor.name} butuh kapasitas sales tambahan.`,
      flow: [
        "Buka Job Sales Representative (expected 2)",
        "Masukkan 3–5 applicant dari sumber berbeda",
        "Phone screen → interview Sales Lead",
        "Refuse yang tidak cocok + reason",
        "Offer & Create Employee untuk 1–2 orang terpilih",
      ],
    },
    {
      id: "sc-rec-consultant",
      title: "Hiring Service Consultant",
      whenToUse: `Beban delivery ${jasa.name} melebihi kapasitas Operations.`,
      flow: [
        "Job Service Consultant (Dept Operations)",
        "Technical interview Operations Lead",
        "Contract Proposal dengan salary proposed",
        "Create Employee → link user → siap Timesheets",
      ],
      notes: "Setelah handoff, lanjut Deep Dive Employees untuk manager & Related User.",
    },
    {
      id: "sc-rec-internal-move",
      title: "Internal applicant / mutasi minat",
      whenToUse: "Karyawan existing minat pindah role lewat job internal.",
      flow: [
        "Buat applicant dengan partner/employee terkait",
        "Interview hiring manager baru",
        "Jika lolos: update employee Dept/Job (bukan create duplikat)",
        "Tutup application sebagai Hired tanpa employee ganda",
      ],
      notes: "Hindari Create Employee kedua untuk orang yang sama.",
    },
    {
      id: "sc-rec-freeze-job",
      title: "Tutup lowongan setelah kuota terpenuhi",
      whenToUse: "Expected new employees sudah tercapai.",
      flow: [
        "Review applicant aktif tersisa",
        "Refuse atau park dengan komunikasi jelas",
        "Set job Recruitment Done / not in progress",
        "Laporkan time-to-hire ke manajemen",
      ],
    },
  ],
  integrations: [
    {
      id: "int-rec-employees",
      withModule: "Employees",
      relationship: "Create Employee → hr.employee; Job/Department shared",
      whatHappens:
        "Applicant Hired menjadi master karyawan. Lengkapi Manager, Related User, work location di Employees agar Timesheets/Time Off jalan. Lihat Deep Dive Employees.",
    },
    {
      id: "int-rec-contacts",
      withModule: "Contacts",
      relationship: "partner_id pada applicant",
      whatHappens:
        "Kontak kandidat dapat terbentuk/tertaut; cegah duplikat partner saat hire.",
    },
    {
      id: "int-rec-calendar",
      withModule: "Calendar / Activities",
      relationship: "mail.activity & meeting pada hr.applicant",
      whatHappens:
        "Interview muncul di to-do interviewer; Mark Done menjadi audit trail seleksi.",
    },
    {
      id: "int-rec-discuss",
      withModule: "Discuss / Mail",
      relationship: "chatter & email template refuse/offer",
      whatHappens:
        "Komunikasi ke kandidat dan catatan internal HR tersimpan di thread applicant.",
    },
    {
      id: "int-rec-website",
      withModule: "Website Jobs (opsional)",
      relationship: "publish hr.job → form apply",
      whatHappens:
        "Apply publik membuat hr.applicant di stage awal tanpa entri manual.",
    },
  ],
  mistakes: [
    {
      id: "m-rec-no-job",
      problem: "Applicant tanpa Applied Job jelas / job salah",
      why: "Pipeline bercampur; Create Employee dapat job/department kosong",
      detect: "Kartu di board job lain atau job kosong",
      fix: "Edit Applied Job; pindahkan ke job benar",
      prevent: "Wajibkan job saat New Application dari kartu job",
    },
    {
      id: "m-rec-skip-interview",
      problem: "Langsung Hired tanpa interview/activity",
      why: "Tidak ada jejak keputusan; sulit audit & coaching",
      detect: "Stage Hired tanpa activity Done",
      fix: "Minimal catat hasil di chatter; standarkan stage Interview",
      prevent: "Checklist: tidak boleh Contract Proposal tanpa interview Done",
    },
    {
      id: "m-rec-refuse-no-reason",
      problem: "Refuse tanpa reason / hapus applicant",
      why: "Kehilangan analitik sourcing; jejak hukum/komunikasi lemah",
      detect: "Refused tanpa reason; record hilang",
      fix: "Pakai wizard Refuse + reason; jangan unlink historis",
      prevent: "Wajibkan refuse reason di proses HR",
    },
    {
      id: "m-rec-duplicate-employee",
      problem: "Create Employee meski orang sudah punya hr.employee",
      why: "Duplikat headcount; timesheet terpecah",
      detect: "Dua employee nama/email sama setelah hire internal",
      fix: "Archive duplikat; tautkan applicant ke employee existing",
      prevent: "Cari email di Employees sebelum Create Employee",
    },
    {
      id: "m-rec-no-recruiter",
      problem: "Recruiter & interviewer kosong",
      why: "Follow-up mengambang; notifikasi tidak sampai",
      detect: "Applicant stagnan di New >N hari",
      fix: "Isi Recruiter; assign activity",
      prevent: "Default recruiter pada Job Position",
    },
  ],
  troubleshooting: [
    {
      id: "t-rec-create-employee-missing",
      problem: "Tombol Create Employee tidak muncul",
      causes: [
        "Stage belum Hired / flag hired stage tidak aktif",
        "Employee sudah dibuat (smart button sudah ada)",
        "Hak akses Recruitment/Employees kurang",
      ],
      diagnosis: [
        "Cek stage applicant = Hired",
        "Cek smart button Employee",
        "Cek group user Recruitment Officer + Employees",
      ],
      solution: [
        "Pindahkan ke hired stage",
        "Buka employee existing jika sudah terbuat",
        "Tambah group yang sesuai",
      ],
      prevention: "Dokumentasikan stage mana yang 'Hired' di Configuration → Stages",
    },
    {
      id: "t-rec-job-not-in-progress",
      problem: "Tidak bisa menambah application pada job",
      causes: [
        "Job ditutup / Recruitment Done",
        "Expected employees 0 dan kebijakan menutup job",
        "Company mismatch multi-company",
      ],
      diagnosis: [
        "Buka job form — status recruitment",
        "Cek company job vs company user",
      ],
      solution: [
        "Set Recruitment in Progress",
        "Samakan company",
        "Naikkan expected new employees jika masih butuh hire",
      ],
      prevention: "Review status job saat planning headcount bulanan",
    },
    {
      id: "t-rec-kanban-empty",
      problem: "Kanban Recruitment kosong padahal ada data",
      causes: [
        "Filter My Applications / Recruiter terlalu sempit",
        "Job di-archive",
        "Stage folded menyembunyikan kartu",
      ],
      diagnosis: [
        "Clear filter",
        "Applications → All Applications",
        "Cek archived jobs",
      ],
      solution: [
        "Reset filter search",
        "Unarchive job/applicant",
        "Buka kolom folded Refused/Hired jika perlu audit",
      ],
      prevention: "Simpan favorit filter 'All open applications'",
    },
    {
      id: "t-rec-email-refuse-fail",
      problem: "Email penolakan gagal terkirim",
      causes: [
        "Outgoing mail server belum dikonfigurasi",
        "Email kandidat kosong/salah",
        "Template tidak valid",
      ],
      diagnosis: [
        "Settings → Technical → Outgoing Mail (jika akses)",
        "Cek field Email applicant",
      ],
      solution: [
        "Isi email valid",
        "Refuse tanpa send email di lab jika SMTP belum siap",
        "Perbaiki mail server di environment demo",
      ],
      prevention: "Uji kirim email satu kali sebelum mass refuse",
    },
  ],
  behind: {
    models: [
      "hr.job",
      "hr.applicant",
      "hr.recruitment.stage",
      "hr.applicant.refuse.reason",
      "hr.recruitment.source",
      "hr.employee",
      "mail.activity",
      "res.partner",
    ],
    relations: [
      "hr.applicant.job_id → hr.job",
      "hr.applicant.stage_id → hr.recruitment.stage",
      "hr.applicant.user_id → recruiter (res.users)",
      "hr.applicant.interviewer_ids → res.users / employees",
      "hr.applicant.emp_id / create employee → hr.employee",
      "hr.job.department_id → hr.department",
    ],
    automations: [
      "stage Hired dapat memicu progress expected employees pada job",
      "Refuse wizard mengarsipkan/memindahkan ke refuse stage + optional email",
      "Create Employee menyalin nama, kontak, job, department ke hr.employee",
      "Activity reminder untuk interview overdue",
    ],
    securityNotes: [
      "hr_recruitment.group_hr_recruitment_user vs manager",
      "Applicant berisi data pribadi kandidat — batasi akses non-recruiter",
      "Pisahkan hak publish website jobs dari recruiter operasional bila perlu",
    ],
    note: "Di Odoo 19 Enterprise, Recruitment tetap berpusat pada hr.job + hr.applicant; handoff Create Employee adalah jembatan resmi ke modul Employees.",
  },
  reporting: [
    {
      name: "Recruitment Pipeline / Applications Analysis",
      path: "Recruitment → Reporting → Applications Analysis",
      kpi: "Jumlah applicant per stage & job",
      decision: "Tambah interviewer jika bottleneck di Interview",
    },
    {
      name: "Time to Hire",
      path: "Reporting / filter create date → hired date",
      kpi: "Hari rata-rata New → Hired",
      decision: "Percepat phone screen atau sederhanakan stage",
    },
    {
      name: "Refuse Reasons",
      path: "Applications group by Refuse Reason",
      kpi: "Alasan penolakan dominan",
      decision: "Perbaiki JD atau channel sourcing",
    },
    {
      name: "Job Position Progress",
      path: "Recruitment → Job Positions",
      kpi: "Hired vs Expected New Employees",
      decision: "Tutup job atau perpanjang hiring",
    },
    {
      name: "Source Effectiveness",
      path: "Reporting group by Source",
      kpi: "Applicant & hire rate per source",
      decision: "Alokasi budget channel (LinkedIn vs referral)",
    },
  ],
  security: {
    roles: [
      {
        role: "Recruitment / Officer",
        can: [
          "Buat & gerakkan applications",
          "Schedule interview",
          "Refuse / offer operasional",
          "Create Employee dari applicant Hired",
        ],
        cannot: [
          "Mengubah settings global Recruitment tanpa role Manager",
          "Melihat field private employee payroll di luar group HR",
        ],
        whyDifferent:
          "Recruiter fokus pipeline kandidat, bukan arsitektur master HR penuh.",
      },
      {
        role: "Recruitment / Administrator",
        can: [
          "Settings Recruitment",
          "Stages & refuse reasons",
          "Semua job & applicant",
        ],
        cannot: [
          "Mengganti ACL teknis tanpa Administration Settings",
        ],
        whyDifferent: "Mengatur kebijakan proses hiring perusahaan.",
      },
      {
        role: "Interviewer (user terbatas)",
        can: [
          "Lihat applicant yang di-assign",
          "Activity interview & catatan",
        ],
        cannot: [
          "Refuse massal / ubah expected employees job",
          "Publish job ke website",
        ],
        whyDifferent: "Interviewer menilai kompetensi, bukan mengelola lowongan.",
      },
    ],
    notes: [
      "Lindungi CV & data pribadi kandidat sesuai kebijakan privasi",
      "Setelah Create Employee, kelola akses lanjutan di Users & Employees",
    ],
  },
  levels: {
    beginner: [
      "Install & buka Recruitment",
      "Buat Job Position sederhana",
      "Buat Application di stage New",
      "Geser stage drag-and-drop",
    ],
    intermediate: [
      "Isi Recruiter & Interviewers pada job",
      "Schedule & complete interview activity",
      "Refuse dengan reason",
      "Offer → Hired → Create Employee",
    ],
    advanced: [
      "Stages per jenis role (Sales vs Consultant)",
      "Source tracking & analisis refuse",
      "Online posting / website jobs",
      "Cegah duplikat employee pada hire internal",
    ],
    expert: [
      "Desain SLA time-to-hire per department",
      "Integrasi Referrals & career site",
      "Kebijakan data retention applicant",
      "Selaraskan headcount job dengan org chart Employees & Timesheets onboarding",
    ],
  },
  exercises: [
    {
      id: "ex-rec-job",
      title: "Job Position Sales & Consultant",
      objective: "Dua lowongan aktif untuk ${company.name}",
      prerequisites: ["Recruitment installed", "Department Sales & Operations ada"],
      task: [
        "Buat Sales Representative expected 2",
        "Buat Service Consultant expected 1",
        "Isi recruiter & interviewer",
        "Screenshot job form / board",
      ],
      expectedResult: "Kedua job in progress di Recruitment",
      checklist: ["Department benar", "Expected > 0", "Company benar"],
    },
    {
      id: "ex-rec-pipeline",
      title: "Pipeline 3 applicant",
      objective: "Melatih stage New → Interview → Refuse/Offer",
      prerequisites: ["Job Sales Representative ada"],
      task: [
        "Buat 3 applicant berbeda",
        "Jadwalkan interview untuk 2 orang",
        "Refuse 1 dengan reason",
        "Loloskan 1 ke Contract Proposal",
      ],
      expectedResult: "Board menampilkan sebaran stage yang sehat",
      checklist: ["Recruiter terisi", "Refuse ber-reason", "Activity Done pada interview"],
    },
    {
      id: "ex-rec-interview",
      title: "Interview Meeting",
      objective: "Jejak wawancara terstruktur",
      prerequisites: ["Applicant di stage Interview"],
      task: [
        "Schedule Meeting ke interviewer",
        "Mark Done + catatan kompetensi",
        "Putuskan maju offer atau refuse",
      ],
      expectedResult: "Chatter berisi hasil interview; stage berubah",
      checklist: ["Assignee benar", "Note hasil tersimpan"],
    },
    {
      id: "ex-rec-handoff",
      title: "Create Employee handoff",
      objective: "Kandidat Hired muncul di Employees",
      prerequisites: ["Applicant siap hire", "Deep Dive Employees dipahami"],
      task: [
        "Set Hired",
        "Create Employee",
        "Lengkapi Manager & Related User di Employees",
        "Verifikasi di direktori Employees",
      ],
      expectedResult: "Satu hr.employee baru tanpa duplikat; siap timesheet",
      checklist: [
        "Smart button Employee ada",
        "Department/Job dari lowongan",
        "Tidak ada employee ganda",
      ],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Employees", href: "/materi/employees" },
    { label: "Deep Dive Users", href: "/materi/users" },
    { label: "Deep Dive Timesheets", href: "/materi/timesheets" },
    { label: "Deep Dive Settings", href: "/materi/settings" },
    { label: "Master Contacts", href: "/modul/master-contacts" },
  ],
};
