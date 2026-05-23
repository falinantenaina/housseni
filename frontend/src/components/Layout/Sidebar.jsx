import {
  HelpCircle,
  Home,
  Info,
  List,
  Package,
  Phone,
  ShoppingCart,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { closeSidebar } from "../../store/slices/popupSlice";

const navItems = [
  { label: "Accueil", path: "/", icon: Home },
  { label: "Produits", path: "/products", icon: Package },
  { label: "Mon Panier", path: "/cart", icon: ShoppingCart },
  { label: "Mes Commandes", path: "/orders", icon: List },
  { label: "À Propos", path: "/about", icon: Info },
  { label: "FAQ", path: "/faq", icon: HelpCircle },
  { label: "Contact", path: "/contact", icon: Phone },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.popup);
  const location = useLocation();

  if (!isSidebarOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => dispatch(closeSidebar())} />
      <div className="fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 animate-slide-left flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="font-display text-white text-lg leading-none">
                H
              </span>
            </div>
            <div>
              <div className="font-display text-foreground tracking-widest text-base leading-none">
                ETS HOUSSENI
              </div>
              <div className="font-ui text-muted-foreground text-xs tracking-widest uppercase">
                Quincaillerie
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeSidebar())}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 px-2">
            Navigation
          </p>
          <nav className="space-y-0.5 mb-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => dispatch(closeSidebar())}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-ui tracking-wide text-sm ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-center">
            <p className="font-ui text-xs text-muted-foreground">
              ☎ +262 639 28 37 68 • +262 269 60 43 71 • +262 639 28 17 66
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
