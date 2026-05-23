import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const subtotal = cart.reduce(
    (a, i) => a + (i.price || 0) * (i.quantity || 1),
    0,
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  console.log(cart);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-[88px] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="font-ui font-bold text-2xl text-foreground tracking-wide mb-2">
            PANIER VIDE
          </h2>
          <p className="text-muted-foreground mb-6">
            Découvrez notre catalogue de produits
          </p>
          <Link to="/products" className="btn-primary">
            VOIR LES PRODUITS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <span className="section-label">Commande</span>
          <h1 className="section-title">MON PANIER</h1>
          <span className="accent-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="card-base p-4 flex gap-4">
                <img
                  src={
                    item.images?.[0].url ||
                    item.image ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-sm border border-border bg-secondary shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-ui font-semibold text-foreground text-sm tracking-wide hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.category?.name && (
                    <span className="product-tag">{item.category.name}</span>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded overflow-hidden">
                      <button
                        onClick={() => dispatch(decreaseQty(item.id))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-ui font-bold text-sm">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQty(item.id))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-ui font-bold text-primary text-base">
                      {(
                        (item.price || 0) * (item.quantity || 1)
                      ).toLocaleString("fr-MG")}{" "}
                      €
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card-base p-5 sticky top-24">
              <h2 className="font-ui font-bold text-foreground tracking-widest uppercase text-sm mb-4 pb-4 border-b border-border">
                RÉCAPITULATIF
              </h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-ui">
                    Sous-total ({cart.length} article
                    {cart.length > 1 ? "s" : ""})
                  </span>
                  <span className="font-ui font-medium">
                    {subtotal.toLocaleString("fr-MG")} €
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-ui">
                    Livraison
                  </span>
                  <span className="font-ui font-medium">
                    {shipping.toLocaleString("fr-MG")} €
                  </span>
                </div>
              </div>
              <div className="flex justify-between mb-6">
                <span className="font-ui font-bold text-foreground tracking-wide">
                  TOTAL
                </span>
                <span className="font-ui font-bold text-primary text-lg">
                  {total.toLocaleString("fr-MG")} €
                </span>
              </div>
              <Link
                to="/payment"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
              >
                PASSER LA COMMANDE <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link
                to="/products"
                className="btn-secondary w-full text-center mt-2 block py-2.5 text-sm"
              >
                CONTINUER LES ACHATS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
