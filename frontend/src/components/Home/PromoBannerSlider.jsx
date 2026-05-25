import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchActiveBanner } from "../../store/slices/bannerSlice";

//  Helpers
const CtaButton = ({ cta_url, cta_text, variant = "outline-white" }) => {
  const base =
    "mt-5 self-start font-ui font-bold text-sm px-5 py-2 rounded-full transition-colors";
  const styles = {
    "outline-white":
      "border-2 border-white text-white hover:bg-white hover:text-primary",
    "outline-primary":
      "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    "solid-white": "bg-white text-primary hover:bg-white/90",
    "solid-primary": "bg-primary text-white hover:bg-primary/90",
  };
  return (
    <Link to={cta_url || "/products"} className={`${base} ${styles[variant]}`}>
      {cta_text || "J'en profite"}
    </Link>
  );
};

const Badge = ({ badge_text }) => {
  if (!badge_text) return null;
  const [line1, line2] = badge_text.split("\n");
  return (
    <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-center shadow-lg z-10 border-4 border-white">
      <span className="font-display text-primary text-lg leading-none">
        {line1}
      </span>
      {line2 && (
        <span className="text-primary text-[9px] font-bold leading-tight px-1">
          {line2}
        </span>
      )}
    </div>
  );
};

//  Layout 1 : promo_items
// Panneau coloré gauche + grille de produits droite (layout originel)
const PromoItemsSlide = ({ banner }) => {
  const {
    title,
    subtitle,
    badge_text,
    date_range,
    cta_text,
    cta_url,
    items = [],
    bg_color,
  } = banner;

  return (
    <div className="w-full bg-white border border-border rounded-xl overflow-hidden shadow-sm flex items-stretch min-h-[200px]">
      {/* Gauche — texte promo */}
      <div
        className="bg-primary flex flex-col justify-center px-8 py-6 min-w-[240px] relative shrink-0"
        style={bg_color ? { backgroundColor: bg_color } : {}}
      >
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
        <Badge badge_text={badge_text} />
        <CtaButton
          cta_url={cta_url}
          cta_text={cta_text}
          variant="outline-white"
        />
      </div>

      {/* Séparateur */}
      <div
        className="w-5 bg-primary shrink-0"
        style={bg_color ? { backgroundColor: bg_color } : {}}
      />

      {/* Droite — produits */}
      <div className="flex-1 flex items-center overflow-x-auto divide-x divide-border">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center px-6 py-4 min-w-[160px] gap-1"
          >
            <p className="font-ui font-bold text-foreground text-sm tracking-wide text-center leading-tight">
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
                className="h-20 w-auto object-contain my-1"
              />
            )}
            <div className="text-center mt-1">
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
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground/30 text-sm">
            Aucun article
          </div>
        )}
      </div>
    </div>
  );
};

//  Layout 2 : full_image
// Grande image pleine largeur, CTA optionnel en bas
const FullImageSlide = ({ banner }) => {
  const { bg_image_url, title, cta_text, cta_url } = banner;
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm min-h-[200px] relative">
      {bg_image_url ? (
        <img
          src={bg_image_url}
          alt={title}
          className="w-full h-full object-cover absolute inset-0"
          style={{ minHeight: 200 }}
        />
      ) : (
        <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5" />
      )}
      {/* Overlay léger en bas pour la lisibilité du CTA */}
      {(title || cta_text) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex items-end justify-between">
          {title && (
            <h2 className="font-display text-white text-4xl tracking-widest drop-shadow">
              {title}
            </h2>
          )}
          {cta_text && (
            <Link
              to={cta_url || "/products"}
              className="border-2 border-white text-white font-ui font-bold text-sm px-5 py-2 rounded-full hover:bg-white hover:text-primary transition-colors"
            >
              {cta_text}
            </Link>
          )}
        </div>
      )}
      {/* Spacer pour donner de la hauteur */}
      <div className="relative min-h-[220px]" />
    </div>
  );
};

//  Layout 3 : text_image
// Texte/CTA à gauche, image à droite (50/50)
const TextImageSlide = ({ banner }) => {
  const {
    title,
    subtitle,
    date_range,
    cta_text,
    cta_url,
    bg_image_url,
    bg_color,
  } = banner;
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm flex items-stretch min-h-[200px] border border-border">
      {/* Gauche — texte */}
      <div
        className="bg-primary flex flex-col justify-center px-10 py-8 flex-1 relative"
        style={bg_color ? { backgroundColor: bg_color } : {}}
      >
        <h2 className="font-display text-white text-5xl tracking-widest leading-none mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/80 text-base font-ui tracking-wide">
            {subtitle}
          </p>
        )}
        {date_range && (
          <p className="text-white/60 text-sm font-ui mt-2">{date_range}</p>
        )}
        {cta_text && (
          <CtaButton
            cta_url={cta_url}
            cta_text={cta_text}
            variant="outline-white"
          />
        )}
      </div>
      {/* Droite — image */}
      <div className="flex-1 relative overflow-hidden">
        {bg_image_url ? (
          <img
            src={bg_image_url}
            alt={title}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground/30 text-sm">Image</span>
          </div>
        )}
        <div className="relative min-h-[220px]" />
      </div>
    </div>
  );
};

//  Layout 4 : image_text
// Image à gauche, texte/CTA à droite (50/50)
const ImageTextSlide = ({ banner }) => {
  const {
    title,
    subtitle,
    date_range,
    cta_text,
    cta_url,
    bg_image_url,
    bg_color,
  } = banner;
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm flex items-stretch min-h-[200px] border border-border">
      {/* Gauche — image */}
      <div className="flex-1 relative overflow-hidden">
        {bg_image_url ? (
          <img
            src={bg_image_url}
            alt={title}
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground/30 text-sm">Image</span>
          </div>
        )}
        <div className="relative min-h-[220px]" />
      </div>
      {/* Droite — texte */}
      <div
        className="bg-primary flex flex-col justify-center px-10 py-8 flex-1"
        style={bg_color ? { backgroundColor: bg_color } : {}}
      >
        <h2 className="font-display text-white text-5xl tracking-widest leading-none mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/80 text-base font-ui tracking-wide">
            {subtitle}
          </p>
        )}
        {date_range && (
          <p className="text-white/60 text-sm font-ui mt-2">{date_range}</p>
        )}
        {cta_text && (
          <CtaButton
            cta_url={cta_url}
            cta_text={cta_text}
            variant="outline-white"
          />
        )}
      </div>
    </div>
  );
};

//  Layout 5 : centered_text
// Grand texte centré, fond couleur ou image
const CenteredTextSlide = ({ banner }) => {
  const {
    title,
    subtitle,
    date_range,
    cta_text,
    cta_url,
    bg_color,
    bg_image_url,
  } = banner;
  const hasBgImage = !!bg_image_url;
  return (
    <div
      className="w-full rounded-xl overflow-hidden shadow-sm flex flex-col items-center justify-center text-center min-h-[200px] px-12 py-10 relative border border-border"
      style={!hasBgImage && bg_color ? { backgroundColor: bg_color } : {}}
    >
      {hasBgImage && (
        <>
          <img
            src={bg_image_url}
            alt=""
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      {!hasBgImage && !bg_color && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
      )}
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="font-display text-white text-6xl md:text-7xl tracking-widest leading-none mb-4 drop-shadow-lg">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/85 text-lg font-ui tracking-wide max-w-lg">
            {subtitle}
          </p>
        )}
        {date_range && (
          <p className="text-white/60 text-sm font-ui mt-2">{date_range}</p>
        )}
        {cta_text && (
          <Link
            to={cta_url || "/products"}
            className="mt-6 border-2 border-white text-white font-ui font-bold text-sm px-8 py-2.5 rounded-full hover:bg-white hover:text-primary transition-colors"
          >
            {cta_text}
          </Link>
        )}
      </div>
    </div>
  );
};

//  Layout 6 : image_overlay
// Image de fond avec texte superposé à gauche
const ImageOverlaySlide = ({ banner }) => {
  const {
    title,
    subtitle,
    date_range,
    cta_text,
    cta_url,
    bg_image_url,
    bg_color,
  } = banner;
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm min-h-[220px] relative border border-border">
      {bg_image_url ? (
        <img
          src={bg_image_url}
          alt={title}
          className="w-full h-full object-cover absolute inset-0"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60"
          style={bg_color ? { background: bg_color } : {}}
        />
      )}
      {/* Dégradé gauche → transparent */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Contenu texte */}
      <div className="relative z-10 flex flex-col justify-center h-full px-10 py-8 min-h-[220px]">
        <h2 className="font-display text-white text-5xl tracking-widest leading-none mb-3 drop-shadow-lg">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/85 text-base font-ui tracking-wide max-w-md">
            {subtitle}
          </p>
        )}
        {date_range && (
          <p className="text-white/60 text-sm font-ui mt-2">{date_range}</p>
        )}
        {cta_text && (
          <Link
            to={cta_url || "/products"}
            className="mt-5 self-start border-2 border-white text-white font-ui font-bold text-sm px-5 py-2 rounded-full hover:bg-white hover:text-primary transition-colors"
          >
            {cta_text}
          </Link>
        )}
      </div>
    </div>
  );
};

//  Routeur de layout
const BannerSlide = ({ banner }) => {
  switch (banner.layout) {
    case "full_image":
      return <FullImageSlide banner={banner} />;
    case "text_image":
      return <TextImageSlide banner={banner} />;
    case "image_text":
      return <ImageTextSlide banner={banner} />;
    case "centered_text":
      return <CenteredTextSlide banner={banner} />;
    case "image_overlay":
      return <ImageOverlaySlide banner={banner} />;
    case "promo_items":
    default:
      return <PromoItemsSlide banner={banner} />;
  }
};

//  Slider
const PromoBannerSlider = () => {
  const dispatch = useDispatch();
  const { activeBanners } = useSelector((s) => s.banner);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    dispatch(fetchActiveBanner());
  }, [dispatch]);

  const prev = useCallback(
    () =>
      setCurrent((c) => (c - 1 + activeBanners.length) % activeBanners.length),
    [activeBanners.length],
  );

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % activeBanners.length),
    [activeBanners.length],
  );

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [activeBanners.length, next]);

  if (!activeBanners.length) return null;

  if (activeBanners.length === 1) {
    return (
      <div className="my-6">
        <BannerSlide banner={activeBanners[0]} />
      </div>
    );
  }

  return (
    <div className="my-6 relative group">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {activeBanners.map((banner) => (
            <div key={banner.id} className="min-w-full">
              <BannerSlide banner={banner} />
            </div>
          ))}
        </div>
      </div>

      {/* Flèches */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                   w-8 h-8 rounded-full bg-white/80 border border-border shadow
                   flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                   w-8 h-8 rounded-full bg-white/80 border border-border shadow
                   flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {activeBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-primary"
                : "w-2 bg-border hover:bg-primary/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBannerSlider;
