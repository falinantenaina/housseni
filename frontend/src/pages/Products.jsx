import { Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AISearchModal from "../components/Products/AISearchModal";
import Pagination from "../components/Products/Pagination";
import ProductCard from "../components/Products/ProductCard";
import { axiosInstance } from "../lib/axios";
import { fetchProducts } from "../store/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, loading, totalProducts } = useSelector(
    (state) => state.product,
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [featured, setFeatured] = useState(false); // ← AJOUT
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  console.log(selectedCategory);

  const perPage = 20;

  const PRICE_RANGES = [
    { label: "Tous les prix", min: 0, max: 0 },
    { label: "< 20 €", min: 0, max: 20 },
    { label: "20 – 50 €", min: 20, max: 50 },
    { label: "50 – 100 €", min: 50, max: 100 },
    { label: "> 100€", min: 100, max: 0 },
  ];

  // 1. Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error("Erreur chargement catégories", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Sync URL → state (dépend de `categories` pour résoudre le nom → id)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const categoryName = params.get("category"); // ex: "Bois & Panneaux"
    const searchParam = params.get("search"); // ex: "tole"
    const featuredParam = params.get("featured"); // ex: "true"

    setSearch(searchParam || "");
    setFeatured(featuredParam === "true");

    // Le backend attend un category_id (UUID), mais l'URL contient le nom
    // → on cherche l'id correspondant dans la liste des catégories
    if (categoryName && categories.length > 0) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
      );
      setSelectedCategory(match?.id || "");
    } else if (!categoryName) {
      setSelectedCategory("");
    }
  }, [location.search, categories]); // ← categories en dépendance !

  // 3. Fetch produits (se déclenche quand un filtre change)
  useEffect(() => {
    const range = PRICE_RANGES[priceRange];
    const params = {
      page,
      limit: perPage,
      sort: sortBy,
      ...(search && { search }),
      ...(selectedCategory && { category_id: selectedCategory }),
      ...(featured && { featured: "true" }), // ← AJOUT
      ...(range.min && { minPrice: range.min }),
      ...(range.max && { maxPrice: range.max }),
    };
    dispatch(fetchProducts(params));
  }, [page, search, selectedCategory, priceRange, sortBy, featured, dispatch]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setPriceRange(0);
    setSortBy("newest");
    setFeatured(false);
    setPage(1);
    navigate("/products");
  };

  const totalPages = Math.ceil(totalProducts / perPage);

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label">CATALOGUE</span>
            <h1 className="section-title text-4xl lg:text-5xl">
              {featured
                ? "COUPS DE CŒUR"
                : selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name ||
                    "Catégorie"
                  : "TOUS LES PRODUITS"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalProducts} produit{totalProducts > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block mb-10`}>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="input-base w-full pl-12 py-3.5"
                />
              </div>

              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
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

              {/* Filtre "Coups de cœur" visible */}
              <div className="lg:w-52">
                <select
                  value={featured ? "true" : ""}
                  onChange={(e) => {
                    setFeatured(e.target.value === "true");
                    setPage(1);
                  }}
                  className="input-base w-full py-3.5"
                >
                  <option value="">Tous les produits</option>
                  <option value="true">⭐ Coups de cœur</option>
                </select>
              </div>

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
                  {/*  <option value="rating">Mieux notés</option> */}
                </select>
              </div>

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

              <button
                onClick={clearFilters}
                className="btn-secondary px-6 flex items-center gap-2 self-end lg:self-center"
              >
                <X className="w-4 h-4" /> Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 btn-secondary px-5 py-3"
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        {/* Products Grid */}
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
