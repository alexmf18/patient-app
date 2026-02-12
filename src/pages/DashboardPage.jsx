import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../context/PatientContext";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Activity,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, allPatients } = usePatients();

  const recentPatients = [...allPatients]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Pacientes",
      value: stats.total,
      icon: Users,
      color: "bg-primary-500",
      lightBg: "bg-primary-50",
      textColor: "text-primary-700",
    },
    {
      label: "Pacientes Activos",
      value: stats.active,
      icon: UserCheck,
      color: "bg-accent-500",
      lightBg: "bg-accent-50",
      textColor: "text-accent-700",
    },
    {
      label: "Pacientes Inactivos",
      value: stats.inactive,
      icon: UserX,
      color: "bg-amber-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-700",
    },
  ];

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Bienvenido/a, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-gray-500">
            Aquí tienes un resumen de tu actividad clínica.
          </p>
        </div>
        <Link
          to="/patients/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Nuevo Paciente
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, color, lightBg, textColor }) => (
          <article
            key={label}
            className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
          >
            <div className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
            <div className={`${lightBg} px-5 py-2`}>
              <p className={`text-xs font-medium ${textColor}`}>
                <TrendingUp className="mr-1 inline h-3 w-3" aria-hidden="true" />
                Datos actualizados
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Quick actions + Recent patients */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Activity className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Acciones Rápidas
          </h2>
          <div className="space-y-3">
            <Link
              to="/patients/new"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 transition hover:border-primary-300 hover:bg-primary-50"
            >
              <UserPlus className="h-5 w-5 text-primary-500" aria-hidden="true" />
              Registrar nuevo paciente
            </Link>
            <Link
              to="/patients"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 transition hover:border-primary-300 hover:bg-primary-50"
            >
              <Users className="h-5 w-5 text-accent-500" aria-hidden="true" />
              Ver todos los pacientes
            </Link>
          </div>
        </div>

        {/* Recent patients */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Clock className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Pacientes Recientes
          </h2>
          {recentPatients.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Aún no tienes pacientes registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-3 pr-4 font-semibold">Paciente</th>
                    <th className="pb-3 pr-4 font-semibold">DNI</th>
                    <th className="hidden pb-3 pr-4 font-semibold sm:table-cell">Diagnóstico</th>
                    <th className="pb-3 pr-4 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold">Actualizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <Link
                          to={`/patients/${p.id}`}
                          className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          {p.firstName} {p.lastName}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{p.dni}</td>
                      <td className="hidden py-3 pr-4 text-gray-600 sm:table-cell">
                        <span className="line-clamp-1">{p.diagnosis || "—"}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            p.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {p.status === "active" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{formatDate(p.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
