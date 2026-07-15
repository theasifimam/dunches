import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthGuard } from "@/components/AuthGuard";
export default function DashboardLayout({ children, }) {
    return (<AuthGuard>
      <div className="flex flex-col md:flex-row h-screen bg-[#FAF6F0] dark:bg-[#10140F] text-foreground transition-colors duration-500 md:p-4 md:gap-4 overflow-hidden relative font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 bg-card md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] md:border border-border/40 overflow-hidden relative z-10 pb-20 md:pb-0 h-full">
          <Topbar />
          <main className="flex-1 p-6 md:p-10 overflow-y-auto scrollbar-hide">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>);
}
