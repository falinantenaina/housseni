import { Eye, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${product.name} ×${quantity} ajouté au panier !`);

    setQuantity(1);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="group bg-white border border-border rounded-md overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/3] bg-secondary overflow-hidden"
      >
        <img
          src={
            product.images?.[0]?.url ||
            product.image ||
            "https://via.placeholder.com/400"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            -{discount}%
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            NOUVEAU
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-white text-destructive font-bold px-5 py-1.5 rounded text-sm">
              RUPTURE
            </span>
          </div>
        )}

        {/* Quick view */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {product.category?.name && (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            {product.category.name}
          </span>
        )}

        <Link
          to={`/product/${product.id}`}
          className="font-medium text-foreground text-sm leading-tight line-clamp-2 mb-3 flex-1 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i <= Math.round(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {(product.price || 0).toLocaleString("fr-MG")} €
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                {product.originalPrice.toLocaleString("fr-MG")} €
              </span>
            )}
          </div>
        </div>

        {/* Quantity + Add Button */}
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center hover:bg-secondary active:bg-secondary transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-medium text-sm border-x border-border">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-secondary active:bg-secondary transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 btn-primary py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden xs:inline">Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
