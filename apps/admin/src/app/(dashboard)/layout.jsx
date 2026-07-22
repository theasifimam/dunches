import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthGuard } from "@/components/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground transition-colors duration-500 md:p-3.5 md:gap-3 overflow-hidden relative font-sans">
        {/* Floating icon sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 pb-20 md:pb-0 h-full">
          <Topbar />
          <main className="flex-1 px-4 pb-4 md:px-7 md:pb-8 pt-4 overflow-y-auto scrollbar-hide">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
