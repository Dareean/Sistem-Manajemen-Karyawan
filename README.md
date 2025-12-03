# Sistem Informasi Absensi & Penggajian Karyawan

Aplikasi full-stack untuk memonitor data karyawan, absensi harian, dan proses penggajian dengan UI React + Tailwind bertema minimalis serta API Node.js + Prisma + SQLite. Sudah mendukung autentikasi JWT dengan pemisahan peran admin vs karyawan.

## Tumpukan Teknologi

- **Frontend**: Vite + React 19, Tailwind CSS, @tanstack/react-query, axios, dayjs, lucide-react.
- **Backend**: Node.js 20, Express 5, Prisma ORM, SQLite (default), Zod untuk validasi.
- **Auth**: JWT (8 jam), bcrypt untuk hashing, guard middleware (`requireAuth`, `requireRole`).

## Struktur Proyek

```
backend/
  prisma/schema.prisma        # Definisi model Prisma (Employee, AttendanceLog, PayrollRun, User)
  src/
    server.ts                 # Entrypoint Express
    middleware/auth.ts        # JWT middleware & role guard
    routes/                   # employees, attendance, payroll, dashboard, auth, profile
    services/payrollService.ts
    schemas/                  # Validasi Zod
    seed.ts                   # Seeder + admin default
frontend/
  src/
    App.jsx                   # Layout + navigasi role-based
    context/AuthContext.jsx   # State auth, token storage, refresh /auth/me
    sections/                 # Dashboard, Employees, Attendance, Payroll, Profile, Auth
    lib/api.js                # Axios instance + token interceptor
```

## Variabel Lingkungan

### Backend (`backend/.env`)

```
DATABASE_URL="file:./dev.db"
PORT=4000
JWT_SECRET=supersecretjwtkey
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:4000/api
```

Semua nilai default di atas sudah dipakai bila file `.env` tidak tersedia.

## Menjalankan Aplikasi

> Gunakan dua terminal terpisah untuk backend dan frontend. Semua perintah dijalankan dari folder `Sistem-Manajemen_Karyawan`.

### 1. Backend API

```powershell
cd backend
npm install
npm run prisma:migrate   # apply schema ke SQLite
npm run seed             # hapus data lama & isi contoh + admin bawaan
npm run dev              # jalankan API di http://localhost:4000
```

Seeder membuat akun admin:

- Email: `admin@example.com`
- Password: `PasswordRahasia123`

Registrasi lewat `/api/auth/register` otomatis membuat akun karyawan baru (role EMPLOYEE) beserta data employee.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev   # Vite default di http://localhost:5173
```

Jika backend berjalan di host berbeda, update `VITE_API_URL` sebelum menjalankan `npm run dev`.

### Build / Production Check

- Backend: `npm run build` (TypeScript → dist/)
- Frontend: `npm run build` (output ke `frontend/dist`)

## Fitur Utama

- **Autentikasi & Role**: login/register dengan JWT, tab navigasi otomatis menyesuaikan peran, logout satu klik.
- **Dashboard**: KPI karyawan, hadir hari ini, payroll pending, grafik kehadiran mingguan.
- **Karyawan (Admin)**: daftar + pencarian, form tambah cepat, status aktif, data tersinkron otomatis.
- **Absensi**: filter tanggal, input jam masuk/keluar, lembur, status hadir/cuti/sakit. Karyawan hanya melihat & mencatat miliknya.
- **Penggajian**: riwayat payroll (total jam, net pay, status). Admin dapat menjalankan payroll per periode dan mengubah status.
- **Profil Karyawan**: karyawan dapat memperbarui nama, telepon, departemen, jabatan via `/api/profile/me`.

## Endpoint Singkat

- `POST /api/auth/register | /login` – buat akun baru / login.
- `GET /api/auth/me` – profil user aktif.
- `GET /api/employees` – admin-only listing.
- `GET/POST/PUT /api/attendance` – baca & input absensi sesuai role.
- `GET /api/payroll` – admin semua data, karyawan hanya miliknya.
- `POST /api/payroll/run`, `PATCH /api/payroll/:id/status` – admin-only.
- `GET /api/dashboard/summary` – ringkasan KPI (admin).
- `GET/PUT /api/profile/me` – profil karyawan aktif.

## Tips Pengembangan

- Database lokal berada di `backend/prisma/dev.db`. Hapus file ini bila ingin reset manual.
- Gunakan `npm run seed` kapan pun ingin mengembalikan data contoh + admin default.
- Jalankan `npm run build` sebelum commit/deploy untuk memastikan TypeScript/React aman.

Selamat menggunakan dan kembangkan sesuai kebutuhan organisasi (mis. slip gaji PDF, integrasi perangkat absensi, dsb.).
