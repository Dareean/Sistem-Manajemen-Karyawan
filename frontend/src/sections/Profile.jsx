import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

const ProfileSection = () => {
  const { user, refreshProfile } = useAuth();
  const employee = user?.employee;

  const mutation = useMutation({
    mutationFn: (payload) =>
      api.put("/profile/me", payload).then((res) => res.data),
    onSuccess: () => {
      refreshProfile();
    },
  });

  if (!employee) {
    return (
      <div className="rounded-3xl bg-surface p-8 text-center text-primary shadow-soft">
        <p className="text-lg font-semibold">Profil karyawan tidak tersedia.</p>
        <p className="mt-2 text-sm text-primary-soft">
          Silakan hubungi admin untuk menghubungkan akun Anda dengan data
          karyawan.
        </p>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName") || undefined,
      phone: formData.get("phone") || undefined,
      department: formData.get("department") || undefined,
      jobTitle: formData.get("jobTitle") || undefined,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-primary">Data Akun</h2>
        <dl className="mt-6 space-y-4 text-sm text-primary-soft">
          <div>
            <dt className="text-xs uppercase tracking-wide">Nama</dt>
            <dd className="text-base font-semibold text-primary">
              {employee.fullName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide">Kode Karyawan</dt>
            <dd className="text-base font-semibold text-primary">
              {employee.employeeCode}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide">Email</dt>
            <dd className="text-base font-semibold text-primary">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide">Peran</dt>
            <dd className="text-base font-semibold text-primary">
              {user.role}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-primary">Perbarui Profil</h2>
        <p className="text-sm text-primary-soft">
          Informasi ini digunakan pada modul absensi dan payroll kamu.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            name="fullName"
            defaultValue={employee.fullName}
            placeholder="Nama lengkap"
            className="w-full rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            name="phone"
            defaultValue={employee.phone ?? ""}
            placeholder="Nomor telepon"
            className="w-full rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            name="department"
            defaultValue={employee.department ?? ""}
            placeholder="Departemen"
            className="w-full rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            name="jobTitle"
            defaultValue={employee.jobTitle ?? ""}
            placeholder="Jabatan"
            className="w-full rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-soft disabled:opacity-60"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </form>
        {mutation.isError && (
          <p className="mt-3 text-sm text-danger">Gagal memperbarui profil.</p>
        )}
        {mutation.isSuccess && !mutation.isPending && (
          <p className="mt-3 text-sm text-success">
            Profil berhasil diperbarui.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProfileSection;
