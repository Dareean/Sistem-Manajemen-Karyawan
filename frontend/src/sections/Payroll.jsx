import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import LoadingOverlay from "../components/LoadingOverlay";
import { api, fetcher } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

const currency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const PayrollSection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetcher("/employees"),
    enabled: isAdmin,
  });

  const {
    data: payrollRuns,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["payroll"],
    queryFn: () => fetcher("/payroll"),
  });

  const runMutation = useMutation({
    mutationFn: (payload) =>
      api.post("/payroll/run", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      periodStart: new Date(form.periodStart.value).toISOString(),
      periodEnd: new Date(form.periodEnd.value).toISOString(),
      employeeId: form.employeeId.value
        ? Number(form.employeeId.value)
        : undefined,
      allowances: Number(form.allowances.value || 0),
      deductions: Number(form.deductions.value || 0),
    };
    runMutation.mutate(payload, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary">
              Riwayat Penggajian
            </h2>
            <p className="text-sm text-primary-soft">
              {isAdmin
                ? "Semua proses payroll terbaru."
                : "Riwayat payroll pribadi Anda."}
            </p>
          </div>
          {isFetching && !isLoading ? (
            <p className="text-xs text-primary-soft">Memperbarui data...</p>
          ) : null}
        </div>

        {isLoading ? (
          <LoadingOverlay label="Memuat payroll" />
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-primary-soft">
                  <th className="py-3 font-medium">Karyawan</th>
                  <th className="py-3 font-medium">Periode</th>
                  <th className="py-3 font-medium">Total Jam</th>
                  <th className="py-3 font-medium">Take Home Pay</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(payrollRuns ?? []).map((run) => (
                  <tr key={run.id} className="border-t border-shade/40">
                    <td className="py-4">
                      <p className="font-medium text-primary">
                        {run.employee.fullName}
                      </p>
                      <p className="text-xs text-primary-soft">
                        {run.employee.department ?? "-"}
                      </p>
                    </td>
                    <td className="py-4 text-primary-soft">
                      {dayjs(run.periodStart).format("DD MMM")} -{" "}
                      {dayjs(run.periodEnd).format("DD MMM YYYY")}
                    </td>
                    <td className="py-4 text-primary-soft">
                      {run.totalHours} jam
                    </td>
                    <td className="py-4 font-semibold text-primary">
                      {currency(Number(run.netPay))}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          run.status === "PAID"
                            ? "bg-success/10 text-success"
                            : run.status === "APPROVED"
                            ? "bg-warning/10 text-warning"
                            : "bg-shade/40 text-primary-soft"
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(payrollRuns ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-primary-soft">
                Belum ada proses payroll.
              </p>
            )}
          </div>
        )}
      </section>

      {isAdmin ? (
        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-primary">
            Jalankan Payroll
          </h3>
          <form
            className="mt-4 grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <select
              name="employeeId"
              className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
              defaultValue=""
            >
              <option value="">Semua karyawan</option>
              {(employees ?? []).map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="periodStart"
              required
              className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
            />
            <input
              type="date"
              name="periodEnd"
              required
              className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
            />
            <input
              type="number"
              name="allowances"
              min="0"
              step="50000"
              placeholder="Tunjangan"
              className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
            />
            <input
              type="number"
              name="deductions"
              min="0"
              step="50000"
              placeholder="Potongan"
              className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
            />
            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-soft disabled:opacity-60"
                disabled={runMutation.isPending}
              >
                {runMutation.isPending ? "Memproses..." : "Proses Payroll"}
              </button>
            </div>
          </form>
          {runMutation.isError && (
            <p className="mt-3 text-sm text-danger">
              Gagal menjalankan payroll.
            </p>
          )}
        </section>
      ) : (
        <section className="rounded-3xl bg-surface p-6 text-center shadow-soft">
          <p className="text-sm text-primary-soft">
            Proses payroll hanya dapat dijalankan oleh administrator.
          </p>
        </section>
      )}
    </div>
  );
};

export default PayrollSection;
