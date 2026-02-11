# ⚡ QUICK FIX - Deploy Commands

## 🎯 Masalah:

```
localhost:4000/api/auth/register Failed to load resource: net::ERR_CONNECTION_REFUSED
```

## ✅ Solusi: Deploy Backend + Update Vercel

---

## 📦 STEP 1: Push ke GitHub

```powershell
# Masuk ke folder project
cd "C:\Users\ASUS\Documents\Kumpulan Project Rafi\Sistem-Manajemen-Karyawan"

# Initialize Git (kalau belum)
git init
git add .
git commit -m "Initial commit - prepare for deployment"
git branch -M main

# Create repo di GitHub: https://github.com/new
# Nama: sistem-karyawan
# Lalu jalankan:
git remote add origin https://github.com/YOUR_USERNAME/sistem-karyawan.git
git push -u origin main
```

---

## 🚀 STEP 2: Deploy Backend di Render.com

### A. Buat PostgreSQL Database:

1. https://render.com → Login with GitHub
2. New + → PostgreSQL
3. Name: `karyawan-db`
4. Region: Singapore
5. Create Database
6. **COPY "Internal Database URL"** → Save ke notepad

### B. Deploy Backend:

1. New + → Web Service
2. Connect GitHub repo `sistem-karyawan`
3. Settings:
   - **Name**: `karyawan-backend`
   - **Region**: Singapore
   - **Root Directory**: `backend`
   - **Build Command**:
     ```
     npm install && npm run build && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: `npm start`

4. **Environment Variables** (Add ini semua):

   ```
   DATABASE_URL = [paste Internal Database URL]
   PORT = 4000
   NODE_ENV = production
   JWT_SECRET = sistem_karyawan_secret_key_2026_secure
   ```

5. **Create Web Service** → Tunggu deploy (~10 menit)

6. **COPY URL Backend**, contoh:
   ```
   https://karyawan-backend-abc123.onrender.com
   ```

---

## 🌐 STEP 3: Update Vercel Environment Variable

1. Buka: https://vercel.com/dashboard
2. Pilih project: `sistem-manajemen-karyawan-seven`
3. **Settings** → **Environment Variables**
4. **Add New**:

   ```
   Name:  VITE_API_URL
   Value: https://karyawan-backend-abc123.onrender.com/api
   ```

   ☑️ Production
   ☑️ Preview  
   ☑️ Development

5. **Save**

---

## 🔄 STEP 4: Redeploy Frontend

Vercel Dashboard → Deployments → Latest → "..." → **Redeploy**

Tunggu ~2 menit.

---

## ✅ STEP 5: Test!

Buka: https://sistem-manajemen-karyawan-seven.vercel.app/

1. Register akun baru
2. Login
3. Test fitur dashboard

**Harus sukses!** ✅

---

## 🐛 Troubleshooting

### ❌ Error: "Prisma migrate failed" di Render

Render belum punya migration files. Jalankan di local:

```powershell
cd backend

# Ganti database ke PostgreSQL di schema.prisma
# datasource db {
#   provider = "postgresql"
#   url      = env("DATABASE_URL")
# }

# Generate migration
npx prisma migrate dev --name init

# Commit & push
git add .
git commit -m "Add PostgreSQL migrations"
git push
```

Lalu **Redeploy** di Render (Manual Deploy).

---

### ❌ Backend masih connection refused

**Check**:

1. Backend URL di Vercel environment variable benar?
2. Backend sudah running di Render? (cek Logs)
3. CORS sudah update di `server.ts`?

---

### ❌ Database connection error di Render

**Check**:

1. DATABASE_URL environment variable sudah dikasih?
2. Copy "Internal Database URL" bukan "External"
3. Format: `postgresql://user:pass@host:port/dbname`

---

## 📞 Need Help?

Kalau ada error, share:

1. Screenshot error message
2. Render deployment logs (last 50 lines)
3. Browser console error

---

## 💡 Tips Production

### Seeding Database di Production:

```powershell
# Set DATABASE_URL ke production database
DATABASE_URL="postgresql://..." npm run seed
```

### Check Backend Status:

```
https://karyawan-backend-abc123.onrender.com/api/health
```

Harus return:

```json
{ "status": "ok", "timestamp": "2026-02-11T..." }
```

---

**Good luck! 🚀**
