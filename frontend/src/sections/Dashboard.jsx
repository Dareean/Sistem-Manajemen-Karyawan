import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { fetcher } from "../lib/api";
import LoadingOverlay from "../components/LoadingOverlay";
import { BarChart3, CalendarDays, DollarSign, Users } from "lucide-react";

const metricConfig = [
  { key: "employeeCount", label: "Total Karyawan", icon: Users },
  { key: "activeEmployees", label: "Aktif", icon: BarChart3 },
  { key: "attendanceToday", label: "Hadir Hari Ini", icon: CalendarDays },
  { key: "payrollPending", label: "Payroll Menunggu", icon: DollarSign },
];

const DashboardSection = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => fetcher("/dashboard/summary"),
  });

  if (isLoading) {
    return <LoadingOverlay label="Memuat ringkasan dashboard" />;
  }

  const weekly = data?.weeklyAttendance ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricConfig.map(({ key, label, icon: Icon }) => (
          <article key={key} className="rounded-3xl bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-soft">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-primary">
                  {data?.[key] ?? 0}
                </p>
              </div>
              <div className="rounded-2xl bg-accent/10 p-3 text-accent">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            {isFetching ? (
              <p className="mt-3 text-xs text-primary-soft">Memperbarui...</p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary-soft">
                Tren Kehadiran 7 Hari
              </p>
              <h3 className="text-lg font-semibold text-primary">
                Distribusi Absensi
              </h3>
            </div>
            <span className="text-xs text-primary-soft">
              {dayjs().format("DD MMM YYYY")}
            </span>
          </div>
          <div className="mt-6 flex items-end gap-3">
            {weekly.length === 0 && (
              <p className="text-sm text-primary-soft">
                Belum ada data absensi.
              </p>
            )}
            {weekly.map((item, idx) => (
              <div
                key={(item.attendanceDate ?? idx).toString()}
                className="flex-1"
              >
                <div
                  className="rounded-t-2xl bg-gradient-to-t from-accent to-accent/30"
                  style={{
                    height: `${Math.max(item._count?._all ?? 1, 1) * 8}px`,
                  }}
                />
                <p className="mt-2 text-center text-xs text-primary-soft">
                  {dayjs(item.attendanceDate ?? new Date()).format("dd")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-primary">Catatan Cepat</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-soft">
            <li>• Gunakan tab Karyawan untuk menambahkan anggota tim baru.</li>
            <li>• Modul Absensi mendukung filter tanggal dan input manual.</li>
            <li>
              • Jalankan Payroll untuk periode tertentu langsung dari tab
              Penggajian.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DashboardSection;
