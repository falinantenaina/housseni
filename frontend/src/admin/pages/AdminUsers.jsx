import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAdminUser,
  fetchAdminUsers,
  updateUserRole,
} from "../../store/slices/adminSlice";
import AdminHeader from "../components/AdminHeader";
import AdminLayout from "../components/AdminLayout";

// ── Dialog de confirmation ─────────────────────────────────────────────────────
const ConfirmDialog = ({ open, title, desc, onConfirm, onCancel, danger }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-md w-full max-w-sm p-6 shadow-xl">
        <h3 className="font-ui font-bold text-foreground tracking-wide mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-6">{desc}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-secondary px-5 py-2 text-sm"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-colors ${
              danger
                ? "bg-destructive text-white hover:bg-destructive/90"
                : "btn-primary"
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page principale ────────────────────────────────────────────────────────────
const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, loading } = useSelector((s) => s.admin);
  const { authUser } = useSelector((s) => s.auth);
  console.log(authUser, "user: ", users);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null); // { type: 'delete' | 'role', user }

  const totalPages = Math.ceil(totalUsers / 10);

  useEffect(() => {
    dispatch(fetchAdminUsers(page));
  }, [dispatch, page]);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      roleFilter === "all" ||
      u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const admins = users.filter((u) => u.role?.toLowerCase() === "admin");
  const clients = users.filter((u) => u.role?.toLowerCase() !== "admin");

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === "delete") {
      dispatch(deleteAdminUser(confirm.user.id)).then(() => {
        if (users.length === 1 && page > 1) setPage((p) => p - 1);
        else dispatch(fetchAdminUsers(page));
      });
    } else {
      const newRole =
        confirm.user.role?.toLowerCase() === "admin" ? "User" : "Admin";
      dispatch(updateUserRole({ id: confirm.user.id, role: newRole })).then(
        () => dispatch(fetchAdminUsers(page)),
      );
    }
    setConfirm(null);
  };

  return (
    <AdminLayout>
      <AdminHeader title="Utilisateurs" />
      <main className="flex-1 p-6">
        {/* Cards récap */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="card-base p-4 text-center">
            <div className="font-display text-primary text-3xl">
              {totalUsers}
            </div>
            <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Total clients
            </div>
          </div>
          <div className="card-base p-4 text-center">
            <div className="font-display text-emerald-500 text-3xl">
              {admins.length}
            </div>
            <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Admins
            </div>
          </div>
          <div className="card-base p-4 text-center">
            <div className="font-display text-blue-500 text-3xl">
              {clients.length}
            </div>
            <div className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
              Clients
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base w-full pl-9 text-sm py-2"
            />
          </div>
          <div className="flex gap-2">
            {[
              ["all", "Tous"],
              ["admin", "Admins"],
              ["user", "Clients"],
            ].map(([r, label]) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`font-ui font-semibold text-xs tracking-widest uppercase px-3 py-2 rounded-md border transition-colors ${
                  roleFilter === r
                    ? "bg-primary border-primary text-white"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card-base overflow-hidden">
          {/* Header table + pagination */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <span className="font-ui text-xs text-muted-foreground tracking-widest uppercase">
              {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 btn-secondary rounded disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-muted-foreground font-ui">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 btn-secondary rounded disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground font-ui text-sm">
                  Aucun utilisateur trouvé
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    {[
                      "Utilisateur",
                      "Email",
                      "Rôle",
                      "Inscrit le",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-ui font-bold text-muted-foreground tracking-widest uppercase text-xs"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const isAdmin = user.role?.toLowerCase() === "admin";
                    const isSelf = user.id === authUser?.id;
                    const avatarUrl = user.avatar?.url || null;

                    return (
                      <tr
                        key={user.id}
                        className="border-t border-border hover:bg-secondary/30 transition-colors"
                      >
                        {/* Utilisateur */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-ui font-bold text-primary text-sm">
                                  {user.name?.[0]?.toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-ui font-semibold text-foreground text-sm tracking-wide flex items-center gap-1.5">
                                {user.name}
                                {isSelf && (
                                  <span className="text-[10px] text-primary font-normal">
                                    (vous)
                                  </span>
                                )}
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground">
                                #{(user.id || "").slice(-8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-muted-foreground font-ui text-xs">
                          {user.email}
                        </td>

                        {/* Rôle badge */}
                        <td className="px-4 py-3">
                          <div
                            className={`inline-flex items-center gap-1.5 font-ui font-bold text-xs px-2.5 py-1 rounded-md ${
                              isAdmin
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {isAdmin ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            {isAdmin ? "Admin" : "Client"}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-muted-foreground font-ui text-xs">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                "fr-FR",
                              )
                            : "—"}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* Toggle rôle */}
                            <button
                              disabled={isSelf}
                              onClick={() => setConfirm({ type: "role", user })}
                              title={
                                isSelf
                                  ? "Votre propre compte"
                                  : isAdmin
                                    ? "Rétrograder en Client"
                                    : "Promouvoir en Admin"
                              }
                              className={`p-1.5 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                                isAdmin
                                  ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                              }`}
                            >
                              {isAdmin ? (
                                <ShieldOff className="w-4 h-4" />
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                            </button>

                            {/* Supprimer */}
                            <button
                              disabled={isSelf}
                              onClick={() =>
                                setConfirm({ type: "delete", user })
                              }
                              title={
                                isSelf ? "Votre propre compte" : "Supprimer"
                              }
                              className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs font-ui text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" /> Promouvoir en Admin
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldOff className="w-3.5 h-3.5 text-destructive" /> Rétrograder
            en Client
          </span>
        </div>
      </main>

      {/* Dialogs de confirmation */}
      <ConfirmDialog
        open={confirm?.type === "delete"}
        title="Supprimer l'utilisateur ?"
        desc={`Cette action est irréversible. "${confirm?.user?.name}" sera définitivement supprimé.`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
        danger
      />
      <ConfirmDialog
        open={confirm?.type === "role"}
        title="Modifier le rôle ?"
        desc={
          confirm?.user?.role?.toLowerCase() === "admin"
            ? `"${confirm?.user?.name}" sera rétrogradé en Client et perdra l'accès au panel admin.`
            : `"${confirm?.user?.name}" sera promu Administrateur et aura accès au panel admin.`
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
