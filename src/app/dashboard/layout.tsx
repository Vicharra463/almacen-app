import type { Metadata } from 'next';
import '../../app/globals.css';
import Sidebar from '../../Components/sidebar';
import { StockUbicacionProvider } from '../context/ubicacionContex';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-300">
      <Sidebar />
      <main className="flex-1">
        <StockUbicacionProvider>        
          {children}
          </StockUbicacionProvider>
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';