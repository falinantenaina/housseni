import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminCategories } from "../../store/slices/adminSlice";

const CategoryGrid = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Découvrir</span>
            <h2 className="section-title text-4xl">NOS CATÉGORIES</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="section-label">Découvrir</span>
          <h2 className="section-title text-4xl">NOS CATÉGORIES</h2>
        </div>

        <Link
          to="/products"
          className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group"
        >
          Voir tout le catalogue
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            className="group relative h-[260px] rounded-xl overflow-hidden bg-card border border-border hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Image Background */}
            <div className="relative flex-1 overflow-hidden">
              {category.image?.url ? (
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground text-4xl">
                  📦
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 group-hover:via-black/40" />
            </div>

            {/* Content */}
            <div className="p-5 bg-white dark:bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
