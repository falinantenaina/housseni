import {
  Building,
  ChevronRight,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Package,
  TicketSlash,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const navItems = [
  { label: "Tableau de bord", path: "/admin", icon: LayoutDashboard },
  { label: "Produits", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: Building },
  { label: "Commandes", path: "/admin/orders", icon: ListOrdered },
  { label: "Bannières", path: "/admin/banners", icon: TicketSlash },

  { label: "Utilisateurs", path: "/admin/users", icon: Users },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useSelector((s) => s.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`flex items-center gap-3 p-5 border-b border-border ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center shrink-0">
          <span className="font-display text-white text-xl leading-none">
            H
          </span>
        </div>
        {!collapsed && (
          <div>
            <div className="font-display text-foreground tracking-widest text-base leading-none">
              ADMIN
            </div>
            <div className="font-ui text-primary text-xs tracking-widest uppercase">
              ETS HOUSSENI
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2 px-2">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : ""}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 group relative ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && (
                <span className="font-ui font-semibold text-sm tracking-wide">
                  {item.label}
                </span>
              )}
              {!collapsed && isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-border">
        {!collapsed && authUser && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="font-ui font-bold text-primary text-xs">
                {authUser.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-ui font-bold text-foreground text-xs tracking-wide truncate">
                {authUser.name}
              </p>
              <p className="text-muted-foreground text-xs truncate">
                {authUser.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Déconnexion" : ""}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && (
            <span className="font-ui font-semibold text-sm tracking-wide">
              Déconnexion
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-card border border-border rounded-md text-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:hidden transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex flex-col h-screen bg-card border-r border-border sticky top-0 transition-all duration-300 ${collapsed ? "w-16" : "w-56"} shrink-0`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground z-10"
        >
          <ChevronRight
            className={`w-3 h-3 transition-transform ${collapsed ? "" : "rotate-180"}`}
          />
        </button>
        <NavContent />
      </div>
    </>
  );
};

export default AdminSidebar;
