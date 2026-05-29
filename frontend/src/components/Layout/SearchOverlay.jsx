import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((state) => state.popup);

  // Catégories réelles depuis le store (chargées au montage de Home)
  const { categories } = useSelector((state) => state.admin);

  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    dispatch(closeSearchBar());
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
  };

  const handleCategory = (cat) => {
    dispatch(closeSearchBar());
    // On passe le nom : Products.jsx le résout en id via l'API categories
    navigate(`/products?category=${encodeURIComponent(cat.name)}`);
  };

  if (!isSearchBarOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => dispatch(closeSearchBar())} />
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 sm:p-6 animate-slide-down">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-lg flex-1">
              Recherche
            </h2>
            <button
              onClick={() => dispatch(closeSearchBar())}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              placeholder="Rechercher un produit, une catégorie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-base w-full pl-12 pr-12 py-3.5 text-base"
            />
            {query.trim() && (
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Catégories réelles */}
          {categories.length > 0 && (
            <div className="mt-4">
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2">
                Catégories populaires
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategory(cat)}
                    className="badge-outline hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer text-sm py-1 px-3"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
