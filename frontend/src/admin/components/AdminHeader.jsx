import { Bell, Moon, Sun } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const AdminHeader = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { authUser } = useSelector((s) => s.auth);

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="font-ui font-bold text-xl text-foreground tracking-widest uppercase">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={"/"}
          className="btn-primary px-1 py-1 lg:px-5 lg:py-2.5 text-sm font-medium rounded-2xl"
        >
          Boutique
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5" />
          ) : (
            <Moon className="w-4.5 h-4.5" />
          )}
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative">
          <Bell className="w-4.5 h-4.5" />
        </button>
        {authUser && (
          <Link
            to={"/profil"}
            className="flex items-center gap-2 pl-2 border-l border-border ml-1"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              {authUser.avatar ? (
                <img
                  src={authUser.avatar.url}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="font-display text-white text-sm">
                  {authUser.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="font-ui font-bold text-foreground text-xs tracking-wide">
                {authUser.name}
              </p>
              <p className="font-ui text-muted-foreground text-xs">Admin</p>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
