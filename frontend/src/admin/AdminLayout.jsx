import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow sticky top-0 z-30">
          <AdminHeader />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-120px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
