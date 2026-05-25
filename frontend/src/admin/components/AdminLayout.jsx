import { SocketProvider } from "../../contexts/SocketContext";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <SocketProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </SocketProvider>
  );
};

export default AdminLayout;
