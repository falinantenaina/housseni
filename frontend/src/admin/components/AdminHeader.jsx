import { Moon, Sun } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import { useTheme } from "../../contexts/ThemeContext";
import AdminNotifications from "./AdminNotifications";

const AdminHeader = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { authUser } = useSelector((s) => s.auth);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAllRead,
    markOneRead,
    clearAll,
    clearAllForce,
    refresh,
  } = useSocket();

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="font-ui font-bold text-xl text-foreground tracking-widest uppercase">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/"
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

        {/* Cloche de notifications — polling HTTP, compatible Passenger */}
        <AdminNotifications
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          markAllRead={markAllRead}
          markOneRead={markOneRead}
          clearAll={clearAll}
          clearAllForce={clearAllForce}
          refresh={refresh}
        />

        {authUser && (
          <Link
            to="/profil"
            className="flex items-center gap-2 pl-2 border-l border-border ml-1"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
              {authUser.avatar?.url ? (
                <img
                  src={authUser.avatar.url}
                  alt=""
                  className="w-full h-full object-cover"
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
