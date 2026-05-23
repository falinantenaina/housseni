import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchActiveBanner } from "../store/slices/bannerSlice";

const PromoBanner = () => {
  const dispatch = useDispatch();
  const { activeBanner } = useSelector((s) => s.banner);

  useEffect(() => {
    dispatch(fetchActiveBanner());
  }, [dispatch]);

  if (!activeBanner) return null;

  const {
    title,
    subtitle,
    badge_text,
    date_range,
    cta_text,
    cta_url,
    items = [],
  } = activeBanner;

  return (
    <div className="w-full bg-white border border-border rounded-xl overflow-hidden shadow-sm my-6">
      <div className="flex items-stretch min-h-[200px]">
        {/* Partie gauche — texte promo */}
        <div className="bg-primary flex flex-col justify-center px-8 py-6 min-w-[260px] relative">
          <h2 className="font-display text-white text-5xl tracking-widest leading-none mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/80 text-sm font-ui tracking-wide">
              {subtitle}
            </p>
          )}
          {date_range && (
            <p className="text-white/70 text-xs font-ui mt-1">{date_range}</p>
          )}

          {badge_text && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-center shadow-lg z-10">
              <span className="font-display text-primary text-xl leading-none">
                {badge_text.split(" ")[0]}
              </span>
              <span className="text-primary text-[10px] font-bold leading-tight">
                {badge_text.split(" ").slice(1).join(" ")}
              </span>
            </div>
          )}

          <Link
            to={cta_url || "/products"}
            className="mt-4 self-start border-2 border-white text-white font-ui font-bold text-sm px-5 py-2 rounded-full hover:bg-white hover:text-primary transition-colors"
          >
            {cta_text || "J'en profite"}
          </Link>
        </div>

        {/* Séparateur */}
        <div className="w-4 bg-primary" />

        {/* Partie droite — produits */}
        <div className="flex-1 flex items-center divide-x divide-border overflow-x-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center px-8 py-4 min-w-[180px] gap-2"
            >
              <p className="font-ui font-bold text-foreground text-sm tracking-wide text-center">
                {item.label}
              </p>
              {item.sublabel && (
                <p className="text-muted-foreground text-xs text-center">
                  {item.sublabel}
                </p>
              )}
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.label}
                  className="h-24 w-auto object-contain my-1"
                />
              )}
              <div className="text-center">
                {item.original_price && (
                  <p className="text-muted-foreground text-xs line-through">
                    {Number(item.original_price).toLocaleString("fr-MG")} €
                  </p>
                )}
                {item.promo_price && (
                  <p className="text-primary font-display text-xl tracking-wide">
                    {Number(item.promo_price).toLocaleString("fr-MG")} €
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
