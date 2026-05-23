import {
  ChevronDown,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import {
  openAuthPopup,
  toggleCart,
  toggleProfile,
  toggleSearchBar,
  toggleSidebar,
} from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Produits", path: "/products" },
    /* { label: "À Propos", path: "/about" }, */
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-1.5 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span className="font-ui tracking-wide">
            ☎ +262 639 28 37 68 • +262 269 60 43 71 • +262 639 28 17 66
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="ETS HOUSSENI" className="w-13 h-9" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-2xl font-bold tracking-tighter text-primary">
                  HOUSSENI
                </div>
                <p className="text-[10px] text-muted-foreground -mt-1">
                  Quincaillerie Générale
                </p>
              </div>
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="nav-link px-5 py-2.5 rounded-xl hover:bg-secondary font-medium transition-all active:scale-95"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-3 rounded-2xl hover:bg-secondary transition-all active:scale-95"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl hover:bg-secondary transition-all active:scale-95"
              title="Changer le thème"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-3 rounded-2xl hover:bg-secondary transition-all active:scale-95"
              title="Panier"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* User / Auth */}
            {authUser ? (
              <button
                onClick={() => dispatch(toggleProfile())}
                className="flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-2xl hover:bg-secondary transition-all"
              >
                {authUser.avatar ? (
                  <img
                    src={authUser.avatar.url}
                    alt={authUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">
                    {authUser.name?.split(" ")[0]}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <button
                onClick={() => dispatch(openAuthPopup())}
                className="btn-primary px-5 py-2.5 text-sm font-medium rounded-2xl"
              >
                Connexion
              </button>
            )}

            {/* Admin Button */}
            {authUser?.role?.toLowerCase() === "admin" && (
              <a
                href="/admin"
                className="hidden sm:block ml-2 px-4 py-2.5 text-xs font-semibold tracking-widest bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all"
              >
                ADMIN
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
