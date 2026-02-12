import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { usePatients } from "../context/PatientContext";
import { Search } from "lucide-react";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { searchTerm, setSearchTerm } = usePatients();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
          {/* Spacer for mobile hamburger */}
          <div className="w-10 lg:hidden" />

          {/* Search bar */}
          <div className="relative flex-1 max-w-xl">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Buscar pacientes por nombre, DNI o diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-700 placeholder-gray-400 transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              aria-label="Buscar pacientes"
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
