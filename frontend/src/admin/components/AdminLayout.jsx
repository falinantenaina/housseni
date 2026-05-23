import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
};

export default AdminLayout;
