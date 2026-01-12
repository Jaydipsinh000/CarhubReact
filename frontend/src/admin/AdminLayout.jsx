import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50/50 font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-slate-950 z-50 hidden lg:block shadow-2xl overflow-y-auto scrollbar-hide">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <AdminHeader />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 relative overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
