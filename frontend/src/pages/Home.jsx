import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import HeroSlider from "../components/Home/HeroSlider";
import { fetchAdminCategories } from "../store/slices/adminSlice";
import { addToCart } from "../store/slices/cartSlice";

import PromoBannerSlider from "../components/Home/PromoBannerSlider";
import {
  CategoryStripSkeleton,
  ProductGridSkeleton,
} from "../components/Layout/Skeleton";
import {
  fetchFeaturedProducts,
  fetchNewProducts,
  fetchTopRated,
} from "../store/slices/productSlice";

//  Carte produit
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const imgUrl = product.images?.[0]?.url || product.image;

  return (
    <div className="group card-base rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden bg-secondary aspect-square"
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
            COUP DE CŒUR
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors flex-1 mb-2"
        >
          {product.name}
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground">
              ({product.numReviews || 0})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <span className="text-lg font-bold text-primary">
            {(product.price || 0).toLocaleString("fr-MG")} €
          </span>
          <button
            onClick={() => {
              dispatch(addToCart(product));
              toast.success(`${product.name} ajouté au panier !`);
            }}
            className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ title, label, products, viewAllHref, loading }) => {
  if (loading) return <ProductGridSkeleton />;
  if (!products?.length) return null;
  return (
    <section className="py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="section-label">{label}</span>
          <h2 className="section-title text-3xl">{title}</h2>
        </div>
        <Link
          to={viewAllHref || "/products"}
          className="hidden sm:flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80 transition-colors group"
        >
          Voir tout{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.slice(0, 10).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="sm:hidden mt-4 text-center">
        <Link
          to={viewAllHref || "/products"}
          className="btn-secondary text-sm px-6 py-2"
        >
          Voir tout →
        </Link>
      </div>
    </section>
  );
};

const CategoryStrip = ({ categories, loading }) => {
  const ref = useRef(null);

  if (loading) return <CategoryStripSkeleton />;
  if (!categories?.length) return null;

  return (
    <section className="py-6 border-y border-border bg-secondary/30">
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Catégories</span>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 rounded-2xl border-2 border-border group-hover:border-primary overflow-hidden bg-secondary transition-colors">
              {cat.image?.url ? (
                <img
                  src={cat.image.url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  📦
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors text-center max-w-[72px] leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

//  Page principale
const Index = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { topRatedProducts, newProducts, featuredProducts } = useSelector(
    (s) => s.product,
  );
  const { categories } = useSelector((s) => s.admin);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(fetchTopRated()),
      dispatch(fetchNewProducts()),
      dispatch(fetchAdminCategories()),
      dispatch(fetchFeaturedProducts()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <div className="pt-[88px]">
        <div className="container mx-auto px-4 pt-6">
          <HeroSlider />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <PromoBannerSlider />
        <CategoryStrip categories={categories} loading={loading} />
        <ProductGrid
          label="Sélection"
          title="COUPS DE CŒUR"
          products={featuredProducts}
          viewAllHref="/products?featured=true"
          loading={loading}
        />
        <ProductGrid
          label="Arrivages"
          title="NOUVEAUTÉS"
          products={newProducts}
          viewAllHref="/products"
          loading={loading}
        />
        <ProductGrid
          label="Nos produits"
          title="MEILLEURES VENTES"
          products={topRatedProducts}
          viewAllHref="/products"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Index;
