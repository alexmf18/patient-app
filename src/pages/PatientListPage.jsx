import { useState } from "react";
import { Link } from "react-router-dom";
import { usePatients } from "../context/PatientContext";
import {
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Users,
} from "lucide-react";

const PAGE_SIZE = 8;

export default function PatientListPage() {
  const { patients, deletePatient, searchTerm } = usePatients();
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const totalPages = Math.max(1, Math.ceil(patients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = patients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleDelete(id) {
    deletePatient(id);
    setConfirmDelete(null);
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pacientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            {patients.length} paciente{patients.length !== 1 && "s"}
            {searchTerm && ` encontrado${patients.length !== 1 ? "s" : ""} para "${searchTerm}"`}
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

      {/* Table */}
      {patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-sm ring-1 ring-gray-200">
          <Users className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-700">No se encontraron pacientes</h2>
          <p className="mt-1 text-sm text-gray-400">
            {searchTerm
              ? "Prueba con otros términos de búsqueda."
              : "Comienza registrando tu primer paciente."}
          </p>
          {!searchTerm && (
            <Link
              to="/patients/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Registrar Paciente
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Lista de pacientes">
              <thead className="border-b border-gray-200 bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 sm:px-6">Paciente</th>
                  <th className="hidden px-4 py-3 font-semibold text-gray-700 md:table-cell">DNI</th>
                  <th className="hidden px-4 py-3 font-semibold text-gray-700 lg:table-cell">Diagnóstico</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
                  <th className="hidden px-4 py-3 font-semibold text-gray-700 sm:table-cell">Fecha</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 sm:px-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((p) => (
                  <tr key={p.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3.5 sm:px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {p.firstName} {p.lastName}
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">{p.dni}</p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3.5 text-gray-600 md:table-cell">{p.dni}</td>
                    <td className="hidden max-w-[200px] truncate px-4 py-3.5 text-gray-600 lg:table-cell">
                      {p.diagnosis || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3.5 text-gray-500 sm:table-cell">
                      {formatDate(p.updatedAt)}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/patients/${p.id}`}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-primary-50 hover:text-primary-600"
                          aria-label={`Ver detalles de ${p.firstName} ${p.lastName}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/patients/${p.id}/edit`}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600"
                          aria-label={`Editar ${p.firstName} ${p.lastName}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Eliminar ${p.firstName} ${p.lastName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
              <p className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar eliminación"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-gray-900">
              Eliminar paciente
            </h2>
            <p className="mb-6 text-center text-sm text-gray-500">
              ¿Estás seguro de que deseas eliminar este paciente? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
