import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarCheck2,
  Coins,
  IdCard,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import DashboardSection from "./sections/Dashboard";
import EmployeesSection from "./sections/Employees";
import AttendanceSection from "./sections/Attendance";
import PayrollSection from "./sections/Payroll";
import ProfileSection from "./sections/Profile";
import AuthSection from "./sections/Auth";
import { useAuth } from "./context/AuthContext.jsx";
import LoadingOverlay from "./components/LoadingOverlay";

const tabs = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  { key: "employees", label: "Karyawan", icon: Users, roles: ["ADMIN"] },
  {
    key: "attendance",
    label: "Absensi",
    icon: CalendarCheck2,
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    key: "payroll",
    label: "Penggajian",
    icon: Coins,
    roles: ["ADMIN", "EMPLOYEE"],
  },
  { key: "profile", label: "Profil", icon: IdCard, roles: ["EMPLOYEE"] },
];

const tabViewMap = {
  dashboard: DashboardSection,
  employees: EmployeesSection,
  attendance: AttendanceSection,
  payroll: PayrollSection,
  profile: ProfileSection,
};

function App() {
  const { user, isAuthenticating, logout } = useAuth();

  const availableTabs = useMemo(() => {
    if (!user) return [];
    return tabs.filter((tab) => tab.roles.includes(user.role));
  }, [user]);

  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!user || availableTabs.length === 0) {
      setActiveTab(null);
      return;
    }
    setActiveTab((prev) => {
      if (prev && availableTabs.some((tab) => tab.key === prev)) {
        return prev;
      }
      return availableTabs[0].key;
    });
  }, [availableTabs, user]);

  const ActiveView = activeTab ? tabViewMap[activeTab] : null;

  if (isAuthenticating) {
    return <LoadingOverlay label="Menyiapkan sesi" />;
  }

  if (!user) {
    return <AuthSection />;
  }

  return (
    <div className="min-h-screen bg-canvas text-primary">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary-soft">
              Sistem Informasi
            </p>
            <h1 className="text-3xl font-semibold text-primary">
              Absensi & Penggajian
            </h1>
            <p className="text-sm text-primary-soft">
              Rancang bangun sistem terpusat untuk manajemen karyawan, absensi,
              dan gaji.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-surface px-5 py-3 text-sm text-primary-soft shadow-soft">
            <Activity className="h-4 w-4 text-success" />
            <div className="text-left">
              <p className="font-medium text-primary">
                {user.employee?.fullName ?? user.email}
              </p>
              <p className="text-xs uppercase tracking-wide">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-danger/10 p-2 text-danger transition hover:bg-danger/20"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <nav className="mt-8 flex flex-wrap gap-3">
          {availableTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                activeTab === key
                  ? "border-transparent bg-primary text-white shadow-soft"
                  : "border-shade/60 bg-surface text-primary-soft hover:border-primary/20"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <section className="mt-8">{ActiveView ? <ActiveView /> : null}</section>
      </div>
    </div>
  );
}

export default App;
