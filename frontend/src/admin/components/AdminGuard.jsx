import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminGuard = ({ children }) => {
  const { authUser, isCheckingAuth } = useSelector((s) => s.auth);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (authUser.role !== "admin" && authUser.role !== "Admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="font-display text-primary text-8xl leading-none opacity-20 mb-4">403</div>
          <h2 className="font-ui font-bold text-foreground text-2xl tracking-widest mb-3">ACCÈS REFUSÉ</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas les droits d'accès à cette section.</p>
          <a href="/" className="btn-primary inline-block">RETOUR AU SITE</a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminGuard;
