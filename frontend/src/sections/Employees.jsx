import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetcher, api } from "../lib/api";
import LoadingOverlay from "../components/LoadingOverlay";

const currency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const EmployeesSection = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["employees", search],
    queryFn: () => fetcher("/employees", search ? { search } : undefined),
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      api.post("/employees", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const employees = useMemo(() => data ?? [], [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      employeeCode: form.employeeCode.value,
      fullName: form.fullName.value,
      email: form.email.value,
      department: form.department.value,
      jobTitle: form.jobTitle.value,
      baseSalary: Number(form.baseSalary.value),
    };
    createMutation.mutate(payload, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary">
              Daftar Karyawan
            </h2>
            <p className="text-sm text-primary-soft">
              Cari atau tambahkan karyawan baru ke dalam sistem.
            </p>
          </div>
          <input
            type="search"
            placeholder="Cari nama / departemen"
            className="w-full rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm md:w-64"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isLoading ? (
          <LoadingOverlay label="Memuat karyawan" />
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-primary-soft">
                  <th className="py-3 font-medium">Nama</th>
                  <th className="py-3 font-medium">Departemen</th>
                  <th className="py-3 font-medium">Jabatan</th>
                  <th className="py-3 font-medium">Gaji Pokok</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-t border-shade/40">
                    <td className="py-4">
                      <p className="font-medium text-primary">
                        {employee.fullName}
                      </p>
                      <p className="text-xs text-primary-soft">
                        {employee.email}
                      </p>
                    </td>
                    <td className="py-4 text-primary-soft">
                      {employee.department ?? "-"}
                    </td>
                    <td className="py-4 text-primary-soft">
                      {employee.jobTitle ?? "-"}
                    </td>
                    <td className="py-4 font-semibold text-primary">
                      {currency(Number(employee.baseSalary))}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          employee.status === "ACTIVE"
                            ? "bg-success/10 text-success"
                            : "bg-shade/40 text-primary-soft"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length === 0 && (
              <p className="py-6 text-center text-sm text-primary-soft">
                Tidak ada data karyawan.
              </p>
            )}
          </div>
        )}
        {isFetching && !isLoading ? (
          <p className="mt-2 text-xs text-primary-soft">Memperbarui data...</p>
        ) : null}
      </section>

      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-primary">Tambah Karyawan</h3>
        <form
          className="mt-4 grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <input
            name="employeeCode"
            required
            placeholder="Kode Karyawan"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            name="fullName"
            required
            placeholder="Nama Lengkap"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            name="department"
            placeholder="Departemen"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            name="jobTitle"
            placeholder="Jabatan"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            type="number"
            name="baseSalary"
            required
            min="0"
            step="100000"
            placeholder="Gaji Pokok"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-soft disabled:opacity-60"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
        {createMutation.isError && (
          <p className="mt-3 text-sm text-danger">
            Gagal menyimpan karyawan. Pastikan data unik.
          </p>
        )}
      </section>
    </div>
  );
};

export default EmployeesSection;
