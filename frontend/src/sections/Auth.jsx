import { useState } from "react";
import { Activity, Lock, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const AuthSection = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
      setIsSubmitting(true);
      setError("");
      if (mode === "login") {
        await login({
          email: values.email,
          password: values.password,
        });
      } else {
        await register({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phone: values.phone || undefined,
          department: values.department || undefined,
          jobTitle: values.jobTitle || undefined,
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ?? "Permintaan gagal diproses";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-12 text-primary">
      <div className="w-full max-w-3xl rounded-3xl bg-surface p-8 shadow-soft">
        <div className="flex flex-col gap-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-primary-soft">
            Sistem Manajemen Karyawan
          </p>
          <h1 className="text-2xl font-semibold">
            {isLogin ? "Masuk untuk melanjutkan" : "Buat akun karyawan baru"}
          </h1>
          <p className="text-sm text-primary-soft">
            Admin memiliki akses penuh. Karyawan dapat mencatat absensi dan
            melihat payroll pribadi.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              isLogin
                ? "border-transparent bg-primary text-white shadow-soft"
                : "border-shade/40 text-primary"
            }`}
          >
            <Lock className="h-4 w-4" /> Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              !isLogin
                ? "border-transparent bg-accent text-white shadow-soft"
                : "border-shade/40 text-primary"
            }`}
          >
            <UserPlus className="h-4 w-4" /> Daftar Karyawan
          </button>
        </div>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                name="fullName"
                required
                placeholder="Nama lengkap"
                className="rounded-2xl border border-shade/60 bg-canvas px-4 py-2 text-sm"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="phone"
                  placeholder="Nomor telepon (opsional)"
                  className="rounded-2xl border border-shade/60 bg-canvas px-4 py-2 text-sm"
                />
                <input
                  name="department"
                  placeholder="Departemen"
                  className="rounded-2xl border border-shade/60 bg-canvas px-4 py-2 text-sm"
                />
              </div>
              <input
                name="jobTitle"
                placeholder="Jabatan"
                className="rounded-2xl border border-shade/60 bg-canvas px-4 py-2 text-sm"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            required
            placeholder="Email perusahaan"
            className="rounded-2xl border border-shade/60 bg-canvas px-4 py-2 text-sm"
          />
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Kata sandi"
            className="rounded-2xl border border-shade/60 bg-canvas px-4 py-2 text-sm"
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
              isLogin
                ? "bg-primary hover:bg-primary-soft"
                : "bg-accent hover:bg-accent/90"
            } disabled:opacity-60`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthSection;
