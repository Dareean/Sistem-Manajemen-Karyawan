import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import { api, fetcher } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

const AttendanceSection = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetcher("/employees"),
    enabled: isAdmin,
  });

  const {
    data: attendanceLogs,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["attendance", selectedDate],
    queryFn: () => fetcher("/attendance", { date: selectedDate }),
  });

  const createMutation = useMutation({
    mutationFn: (payload) =>
      api.post("/attendance", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const attendanceDateValue = form.attendanceDate.value;
    const employeeIdValue = isAdmin ? Number(form.employeeId.value) : undefined;
    const payload = {
      employeeId: employeeIdValue,
      attendanceDate: new Date(`${attendanceDateValue}T00:00:00`).toISOString(),
      checkIn: form.checkIn.value
        ? new Date(
            `${attendanceDateValue}T${form.checkIn.value}:00`
          ).toISOString()
        : null,
      checkOut: form.checkOut.value
        ? new Date(
            `${attendanceDateValue}T${form.checkOut.value}:00`
          ).toISOString()
        : null,
      status: form.status.value,
      workHours: Number(form.workHours.value || 0),
      overtimeHours: Number(form.overtimeHours.value || 0),
      notes: form.notes.value,
    };
    createMutation.mutate(payload, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary">
              Absensi Harian
            </h2>
            <p className="text-sm text-primary-soft">
              Pantau daftar kehadiran berdasarkan tanggal.
            </p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm md:w-56"
          />
        </div>

        {isLoading ? (
          <LoadingOverlay label="Memuat absensi" />
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-primary-soft">
                  <th className="py-3 font-medium">Karyawan</th>
                  <th className="py-3 font-medium">Masuk</th>
                  <th className="py-3 font-medium">Pulang</th>
                  <th className="py-3 font-medium">Jam Kerja</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(attendanceLogs ?? []).map((log) => (
                  <tr key={log.id} className="border-t border-shade/40">
                    <td className="py-4">
                      <p className="font-medium text-primary">
                        {log.employee.fullName}
                      </p>
                      <p className="text-xs text-primary-soft">
                        {log.employee.department ?? "-"}
                      </p>
                    </td>
                    <td className="py-4 text-primary-soft">
                      {log.checkIn ? dayjs(log.checkIn).format("HH:mm") : "-"}
                    </td>
                    <td className="py-4 text-primary-soft">
                      {log.checkOut ? dayjs(log.checkOut).format("HH:mm") : "-"}
                    </td>
                    <td className="py-4 text-primary-soft">
                      {log.workHours ?? 0} jam
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          log.status === "PRESENT"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(attendanceLogs ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-primary-soft">
                Belum ada data untuk tanggal ini.
              </p>
            )}
          </div>
        )}
        {isFetching && !isLoading ? (
          <p className="mt-2 text-xs text-primary-soft">Memperbarui data...</p>
        ) : null}
      </section>

      <section className="rounded-3xl bg-surface p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-primary">Input Absensi</h3>
        <form
          className="mt-4 grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          {isAdmin ? (
            <select
              name="employeeId"
              required
              className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                Pilih karyawan
              </option>
              {(employees ?? []).map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm">
              {user?.employee?.fullName ?? "Karyawan"}
            </div>
          )}
          <input
            type="date"
            name="attendanceDate"
            required
            defaultValue={selectedDate}
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            type="time"
            name="checkIn"
            placeholder="Masuk"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            type="time"
            name="checkOut"
            placeholder="Pulang"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            type="number"
            name="workHours"
            min="0"
            max="24"
            step="0.5"
            placeholder="Jam Kerja"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <input
            type="number"
            name="overtimeHours"
            min="0"
            max="24"
            step="0.5"
            placeholder="Lembur"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <select
            name="status"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          >
            <option value="PRESENT">Hadir</option>
            <option value="LEAVE">Cuti</option>
            <option value="SICK">Sakit</option>
            <option value="ABSENT">Alpa</option>
          </select>
          <input
            name="notes"
            placeholder="Catatan (opsional)"
            className="rounded-2xl border border-shade/80 bg-canvas px-4 py-2 text-sm"
          />
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Menyimpan..." : "Simpan Absen"}
            </button>
          </div>
        </form>
        {createMutation.isError && (
          <p className="mt-3 text-sm text-danger">Gagal menyimpan absensi.</p>
        )}
      </section>
    </div>
  );
};

export default AttendanceSection;
