import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../store/slices/cartSlice";

const ProductSlider = ({ title, products }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const scroll = (dir) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products?.length) return null;

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="section-label">Nos produits</span>
          <h2 className="section-title text-4xl">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-2xl border border-border bg-card flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-2xl border border-border bg-card flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-72 snap-start group">
            <div className="card-base hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden rounded-3xl h-full flex flex-col">
              {/* Image */}
              <Link
                to={`/product/${product.id}`}
                className="relative block h-52 bg-secondary overflow-hidden"
              >
                <img
                  src={
                    product.images?.[0]?.url ||
                    product.image ||
                    "https://via.placeholder.com/400"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="bg-white text-destructive font-bold px-6 py-2 rounded-2xl text-sm tracking-wider">
                      RUPTURE DE STOCK
                    </span>
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <Link
                  to={`/product/${product.id}`}
                  className="font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors mb-3 flex-1"
                >
                  {product.name}
                </Link>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= Math.round(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.numReviews || 0})
                    </span>
                  </div>
                )}

                {/* Price + Add to cart */}
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {(product.price || 0).toLocaleString("fr-MG")} €
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(addToCart(product));
                      toast.success(`${product.name} ajouté au panier !`);
                    }}
                    disabled={product.stock === 0}
                    className="w-11 h-11 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;
