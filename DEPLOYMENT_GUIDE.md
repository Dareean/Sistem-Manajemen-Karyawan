# 🚀 DEPLOYMENT GUIDE - Sistem Manajemen Karyawan

## ❌ Problem yang Anda Alami:

```
localhost:4000/api/auth/register:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

**Penyebab**: Frontend sudah deploy di Vercel, tapi masih coba connect ke backend di `localhost:4000` yang tidak ada di production.

**Solusi**: Deploy backend ke hosting + update environment variable di Vercel.

---

## ✅ SOLUSI LENGKAP

### Opsi 1: Deploy Backend ke Render.com (RECOMMENDED)

Render.com support PostgreSQL gratis dan cocok untuk Prisma.

#### A. Persiapan:

1. **Update Database ke PostgreSQL** (SQLite tidak persistent di cloud)

Edit `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Ganti dari "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Commit & Push ke GitHub**:

```powershell
cd "C:\Users\ASUS\Documents\Kumpulan Project Rafi\Sistem-Manajemen-Karyawan"
git init
git add .
git commit -m "Prepare for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sistem-karyawan.git
git push -u origin main
```

#### B. Deploy di Render.com:

1. **Buat Akun**: https://render.com (login with GitHub)

2. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `karyawan-db`
   - Region: Singapore (closest to Indonesia)
   - Plan: Free
   - Click "Create Database"
   - **COPY** the "Internal Database URL" (simpan untuk nanti)

3. **Deploy Backend (Web Service)**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - **Name**: `karyawan-backend`
     - **Region**: Singapore
     - **Branch**: main
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Set Environment Variables** di Render:

   ```
   DATABASE_URL = [paste Internal Database URL dari step 2]
   PORT = 4000
   NODE_ENV = production
   JWT_SECRET = sistem_karyawan_secret_key_2026_secure
   ```

5. **Deploy!** - Tunggu build selesai (5-10 menit)

6. **COPY** URL backend Anda, contoh:
   ```
   https://karyawan-backend.onrender.com
   ```

---

### Opsi 2: Deploy Backend ke Railway.app

Railway juga bagus tapi perlu kredit card untuk free tier.

1. **Sign up**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Add PostgreSQL** dari Railway dashboard
4. **Set environment variables** (sama seperti Render)
5. **Copy URL backend**

---

## 📱 LANGKAH 2: Update Frontend di Vercel

### A. Set Environment Variable di Vercel:

1. Buka: https://vercel.com/dashboard
2. Pilih project: `sistem-manajemen-karyawan-seven`
3. Settings → Environment Variables
4. Add New:
   ```
   Key: VITE_API_URL
   Value: https://karyawan-backend.onrender.com/api
   ```
   (Ganti dengan URL backend Anda)
5. **Pilih**: Production, Preview, Development
6. **Save**

### B. Redeploy Frontend:

Di Vercel dashboard:

1. Deployments → Latest deployment
2. Click "..." (three dots) → Redeploy
3. Tunggu selesai

---

## 🧪 Testing:

1. Buka: https://sistem-manajemen-karyawan-seven.vercel.app/
2. Coba Register/Login
3. Harus berfungsi tanpa error!

⚠️ **Note**:

- First request ke Render bisa lambat (cold start ~30s) karena free tier sleep setelah 15 menit idle
- Setelah warm, response normal

---

## 🔧 Alternative: Local .env untuk Development

Buat file `frontend/.env.local` untuk development:

```env
VITE_API_URL=http://localhost:4000/api
```

Dan di Vercel (production) tetap pakai URL backend yang sudah di-deploy.

---

## 📊 Troubleshooting:

### Error: "Prisma migrate failed"

**Solusi**:

```powershell
# Di local, generate migration untuk PostgreSQL
cd backend
npx prisma migrate dev --name init
git add . && git commit -m "Add PostgreSQL migration" && git push
```

### Error: "CORS blocked"

**Solusi**: Update `backend/src/server.ts`:

```typescript
app.use(
  cors({
    origin: [
      "https://sistem-manajemen-karyawan-seven.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
```

### Backend di Render sleep terus

**Solusi**:

- Upgrade ke paid plan ($7/month), atau
- Gunakan cron job untuk ping backend setiap 10 menit (keep alive)

---

## 💰 Cost Estimate:

**Free Tier (0 IDR):**

- Vercel: Frontend hosting (unlimited bandwidth)
- Render: PostgreSQL 1GB + Web Service 750 hours/month
- ⚠️ Limitation: Backend sleep after 15 min idle, need 30s cold start

**Paid ($7/month):**

- Render Starter Plan: No sleep, persistent, faster

---

## 🎯 Next Steps:

1. [ ] Push backend code ke GitHub
2. [ ] Deploy PostgreSQL di Render
3. [ ] Deploy backend di Render
4. [ ] Update VITE_API_URL di Vercel
5. [ ] Redeploy frontend
6. [ ] Test production app
7. [ ] Setup custom domain (optional)

---

**Butuh bantuan deploy? Let me know!** 🚀
