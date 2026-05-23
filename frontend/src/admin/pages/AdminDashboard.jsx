import {
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAdminStats } from "../../store/slices/adminSlice";
import AdminHeader from "../components/AdminHeader";
import AdminLayout from "../components/AdminLayout";
import { StatCard } from "../components/dashboard/StatCard";

const getLastNMonths = (n) => {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString("fr-FR", { month: "short", year: "2-digit" }));
  }
  return months;
};

const formatAr = (n) => {
  if (!n) return "0 €";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M €";
  if (n >= 1000) return (n / 1000).toFixed(0) + "k €";
  return n + " €";
};

const STATUS_COLORS = {
  "En cours": "#3b82f6",
  Confirmé: "#f59e0b",
  Livré: "#22c55e",
  Annulé: "#ef4444",
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    loading,
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUsers,
    monthlySales,
    orderStatusCounts,
    topSellingProducts,
    lowStockProducts,
    newUsersThisMonth,
    currentMonthSales,
    revenueGrowth,
  } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const months = getLastNMonths(6);
  const salesData = months.map((m, i) => ({
    month: m,
    ventes: monthlySales?.[i] || 0,
  }));

  const statusData = Object.entries(orderStatusCounts || {}).map(
    ([name, value]) => ({
      name,
      value: parseInt(value) || 0,
    }),
  );

  const topProducts = (topSellingProducts || []).slice(0, 5).map((p) => ({
    name:
      p.name?.substring(0, 15) + (p.name?.length > 15 ? "…" : "") || "Produit",
    ventes: p.totalSold || 0,
  }));

  if (loading) {
    return (
      <AdminLayout>
        <AdminHeader title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard
            icon={Wallet}
            label="Vente total"
            value={formatAr(totalRevenueAllTime)}
            color="primary"
          />
          <StatCard
            icon={TrendingUp}
            label="Aujourd'hui"
            value={formatAr(todayRevenue)}
            sub={`Hier: ${formatAr(yesterdayRevenue)}`}
            color="green"
          />
          <StatCard
            icon={ShoppingBag}
            label="Ce mois"
            value={formatAr(currentMonthSales)}
            sub={revenueGrowth}
            trend="up"
            color="blue"
          />
          <StatCard
            icon={Users}
            label="Utilisateurs"
            value={totalUsers || 0}
            sub={`+${newUsersThisMonth || 0} ce mois`}
            color="yellow"
          />
          <StatCard
            icon={PackageCheck}
            label="Commandes"
            value={statusData.reduce((a, s) => a + s.value, 0)}
            color="primary"
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly sales line chart */}
          <div className="lg:col-span-2 card-base p-5">
            <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4">
              Ventes mensuelles (6 mois)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesData}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontFamily: "Barlow Condensed" }}
                />
                <YAxis
                  tickFormatter={(v) => (v >= 1000 ? v / 1000 + "k" : v)}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip formatter={(v) => [formatAr(v), "Ventes"]} />
                <Line
                  type="monotone"
                  dataKey="ventes"
                  stroke="hsl(213,80%,42%)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order status pie */}
          <div className="card-base p-5">
            <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4">
              Statut Commandes
            </h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={STATUS_COLORS[entry.name] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm font-ui">
                Aucune donnée
              </div>
            )}
          </div>
        </div>

        {/* Charts row 2 */}
        {topProducts.length > 0 && (
          <div className="card-base p-5">
            <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4">
              Top Produits (ventes)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 11, fontFamily: "Barlow Condensed" }}
                />
                <Tooltip />
                <Bar
                  dataKey="ventes"
                  fill="hsl(213,80%,42%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top selling products table */}
        {(topSellingProducts || []).length > 0 && (
          <div className="card-base overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm">
                Produits les plus vendus
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    {["Produit", "Catégorie", "Prix", "Vendus", "Stock"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 font-ui font-bold text-muted-foreground tracking-widest uppercase text-xs"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.slice(0, 8).map((p, i) => (
                    <tr
                      key={i}
                      className="border-t border-border hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && (
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-8 h-8 rounded border border-border object-cover bg-secondary"
                            />
                          )}
                          <span className="font-ui font-semibold text-foreground truncate max-w-[160px]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge-outline text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-ui font-bold text-primary">
                        {(p.price || 0).toLocaleString("fr-MG")} €
                      </td>
                      <td className="px-4 py-3 font-ui text-foreground">
                        {p.totalSold || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-ui text-xs font-semibold ${(p.stock || 0) > 5 ? "text-emerald-500" : "text-destructive"}`}
                        >
                          {p.stock || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
