import {
  ChevronRight,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "../components/Products/ProductCard"; // ← Important
import { addToCart } from "../store/slices/cartSlice";
import {
  fetchProductById,
  fetchSimilarProducts,
} from "../store/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    productDetails: product,
    productReviews,
    loading,
    similarProducts,
  } = useSelector((state) => state.product);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // Charger les produits similaires quand le produit est chargé
  useEffect(() => {
    if (product?.category?.id) {
      dispatch(fetchSimilarProducts(product.category.id));
    }
  }, [product?.category?.id, dispatch]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    toast.success(
      `${qty} × ${product.name} ajouté${qty > 1 ? "s" : ""} au panier !`,
    );
  };

  if (loading || !product?.id) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.image || "https://via.placeholder.com/600"];
  const hasDescription =
    product.description && product.description.trim().length > 15;

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary">
            Catalogue
          </Link>
          {product.category?.name && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link
                to={`/products?category=${product.category.name}`}
                className="hover:text-primary"
              >
                {product.category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-border aspect-square mb-4">
              <img
                src={images[activeImg]?.url || images[activeImg]}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
              {product.stock === 0 && (
                <div className="absolute top-6 right-6 bg-destructive text-white text-sm font-bold px-5 py-2 rounded-full">
                  RUPTURE DE STOCK
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      i === activeImg
                        ? "border-primary shadow"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img?.url || img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Produit */}
          <div className="space-y-6">
            {product.category?.name && (
              <span className="badge-outline">{product.category.name}</span>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-border"}`}
                    />
                  ))}
                  <span className="text-muted-foreground">
                    ({productReviews.length} avis)
                  </span>
                </div>
              )}

              <div>
                <span className="text-4xl font-bold text-primary">
                  {(product.price || 0).toLocaleString("fr-MG")} €
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 ${product.stock !== 0 ? "text-emerald-600" : "text-destructive"}`}
            >
              <Package className="w-5 h-5" />
              {product.stock !== 0 ? `En stock` : "Indisponible"}
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 font-medium border-b-2 transition-colors ${activeTab === "description" ? "border-primary" : "border-transparent text-muted-foreground"}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-4 font-medium border-b-2 transition-colors ${activeTab === "specs" ? "border-primary" : "border-transparent text-muted-foreground"}`}
                >
                  Caractéristiques
                </button>
              </div>
            </div>

            <div className="min-h-[140px] text-muted-foreground leading-relaxed">
              {activeTab === "description" ? (
                hasDescription ? (
                  product.description
                ) : (
                  "Aucune description disponible pour ce produit."
                )
              ) : product.specifications &&
                Object.keys(product.specifications).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                "Aucune caractéristique disponible."
              )}
            </div>

            {/* Ajout au panier */}
            {(product.stock === null || product.stock > 0) && (
              <div className="flex gap-4 pt-4">
                <div className="flex border border-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-5 py-3 hover:bg-secondary"
                  >
                    <Minus />
                  </button>
                  <span className="px-8 py-3 font-semibold text-lg border-x">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) =>
                        product.stock ? Math.min(product.stock, q + 1) : q + 1,
                      )
                    }
                    className="px-5 py-3 hover:bg-secondary"
                  >
                    <Plus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  AJOUTER AU PANIER
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==================== PRODUITS SIMILAIRES ==================== */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarProducts
                .filter((p) => p.id !== product.id) // Exclure le produit actuel
                .slice(0, 5)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        )}

        {/* A AJOUTER SI NECESSAIRE */}
        {/* Reviews */}
        {/* <ReviewsContainer product={product} productReviews={productReviews} /> */}
      </div>
    </div>
  );
};

export default ProductDetail;
