import { Filter, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AISearchModal from "../components/Products/AISearchModal";
import Pagination from "../components/Products/Pagination";
import ProductCard from "../components/Products/ProductCard";
import { axiosInstance } from "../lib/axios";
import { fetchProducts } from "../store/slices/productSlice";

const PRICE_RANGES = [
  { label: "Tous les prix", min: 0, max: 0 },
  { label: "< 20 €", min: 0, max: 20 },
  { label: "20 – 50 €", min: 20, max: 50 },
  { label: "50 – 100 €", min: 50, max: 100 },
  { label: "> 100 €", min: 100, max: 0 },
];

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, loading, totalProducts } = useSelector((s) => s.product);

  // ── Filtres locaux ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // id UUID
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [featured, setFeatured] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const perPage = 20;

  // ── Chargement des catégories ───────────────────────────────────────────────
  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error);
  }, []);

  // ── Sync URL → state ────────────────────────────────────────────────────────
  // On lit les paramètres URL et on les applique dès que les catégories sont
  // disponibles (nécessaire pour résoudre le nom de catégorie en UUID).
  const prevSearch = useRef("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryName = params.get("category") || "";
    const searchParam = params.get("search") || "";
    const featuredParam = params.get("featured") === "true";

    setSearch(searchParam);
    setFeatured(featuredParam);
    setPage(1);

    if (categoryName && categories.length > 0) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
      );
      setSelectedCategory(match?.id || "");
    } else if (!categoryName) {
      setSelectedCategory("");
    }
  }, [location.search, categories]);

  // ── Fetch produits ──────────────────────────────────────────────────────────
  // On lit DIRECTEMENT les paramètres URL pour ne jamais être déphasé par rapport
  // au state React (qui peut être mis à jour un tick plus tard).
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryName = urlParams.get("category") || "";
    const searchParam = urlParams.get("search") || "";
    const featuredParam = urlParams.get("featured") === "true";

    // Résoudre le nom de catégorie en UUID si les catégories sont chargées
    let categoryId = selectedCategory;
    if (categoryName && categories.length > 0) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
      );
      categoryId = match?.id || "";
    }

    const range = PRICE_RANGES[priceRange];

    const params = {
      page,
      limit: perPage,
      sort: sortBy,
      ...(searchParam && { search: searchParam }),
      ...(categoryId && { category_id: categoryId }),
      ...(featuredParam && { featured: "true" }),
      ...(range.min && { minPrice: range.min }),
      ...(range.max && { maxPrice: range.max }),
    };

    dispatch(fetchProducts(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.search,
    categories,
    page,
    priceRange,
    sortBy,
    selectedCategory,
    featured,
  ]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setPriceRange(0);
    setSortBy("newest");
    setFeatured(false);
    setPage(1);
    navigate("/products");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    setPage(1);
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/products");
    }
  };

  const totalPages = Math.ceil(totalProducts / perPage);

  // ── Label du titre ──────────────────────────────────────────────────────────
  const urlParams = new URLSearchParams(location.search);
  const categoryName = urlParams.get("category") || "";
  const searchParam = urlParams.get("search") || "";

  const pageTitle = featured
    ? "COUPS DE CŒUR"
    : categoryName
      ? categoryName.toUpperCase()
      : searchParam
        ? `"${searchParam}"`
        : "TOUS LES PRODUITS";

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label">CATALOGUE</span>
            <h1 className="section-title text-4xl lg:text-5xl">{pageTitle}</h1>
            <p className="text-muted-foreground mt-1">
              {totalProducts} produit{totalProducts > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block mb-10`}>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Recherche texte */}
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-base w-full pl-12 py-3.5"
                />
                {/* Bouton submit invisible pour valider avec Entrée */}
                <button type="submit" className="hidden" />
              </form>

              {/* Catégorie */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedCategory(id);
                    setPage(1);
                    if (id) {
                      const cat = categories.find((c) => c.id === id);
                      navigate(
                        cat
                          ? `/products?category=${encodeURIComponent(cat.name)}`
                          : "/products",
                      );
                    } else {
                      navigate("/products");
                    }
                  }}
                  className="input-base w-full py-3.5"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coups de cœur */}
              <div className="lg:w-52">
                <select
                  value={featured ? "true" : ""}
                  onChange={(e) => {
                    const val = e.target.value === "true";
                    setFeatured(val);
                    setPage(1);
                    navigate(val ? "/products?featured=true" : "/products");
                  }}
                  className="input-base w-full py-3.5"
                >
                  <option value="">Tous les produits</option>
                  <option value="true">⭐ Coups de cœur</option>
                </select>
              </div>

              {/* Tri */}
              <div className="lg:w-52">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="input-base w-full py-3.5"
                >
                  <option value="newest">Nouveautés</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>

              {/* Fourchette de prix */}
              <div className="lg:w-60">
                <select
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setPage(1);
                  }}
                  className="input-base w-full py-3.5"
                >
                  {PRICE_RANGES.map((range, i) => (
                    <option key={i} value={i}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={clearFilters}
                className="btn-secondary px-6 flex items-center gap-2 self-end lg:self-center"
              >
                <X className="w-4 h-4" /> Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Bouton filtres mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 btn-secondary px-5 py-3"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? "Masquer les filtres" : "Filtres"}
          </button>
        </div>

        {/* Grille produits */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-secondary animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">
              Aucun produit trouvé
            </h3>
            {searchParam && (
              <p className="text-muted-foreground mb-2">
                pour la recherche «&nbsp;{searchParam}&nbsp;»
              </p>
            )}
            <button onClick={clearFilters} className="btn-primary mt-6">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <AISearchModal />
    </div>
  );
};

export default Products;
