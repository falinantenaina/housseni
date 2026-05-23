import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "../../store/slices/cartSlice";
import { closeCart } from "../../store/slices/popupSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);

  const total = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );

  if (!isCartOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => dispatch(closeCart())} />
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border z-50 animate-slide-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-ui font-bold text-lg tracking-wide text-foreground">
              MON PANIER
            </h2>
            {cart.length > 0 && (
              <span className="badge-primary">{cart.length}</span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
              <p className="font-ui text-muted-foreground text-center tracking-wide">
                Votre panier est vide
              </p>
              <button
                onClick={() => dispatch(closeCart())}
                className="btn-primary text-sm"
              >
                CONTINUER LES ACHATS
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 card-base">
                  <img
                    src={
                      item.images?.[0]?.url ||
                      item.image ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-sm border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-ui font-semibold text-foreground text-sm leading-tight line-clamp-2 tracking-wide">
                      {item.name}
                    </p>
                    <p className="text-primary font-ui font-bold text-sm mt-1">
                      {(item.price || 0).toLocaleString("fr-MG")} €
                    </p>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(decreaseQty(item.id))}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-ui font-semibold text-sm w-6 text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQty(item.id))}
                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-ui text-muted-foreground tracking-wide">
                SOUS-TOTAL
              </span>
              <span className="font-ui font-bold text-foreground">
                {total.toLocaleString("fr-MG")} €
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                to="/cart"
                onClick={() => dispatch(closeCart())}
                className="flex-1 btn-secondary text-center text-sm"
              >
                VOIR PANIER
              </Link>
              <Link
                to="/payment"
                onClick={() => dispatch(closeCart())}
                className="flex-1 btn-primary text-center text-sm flex items-center justify-center gap-1.5"
              >
                COMMANDER <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
