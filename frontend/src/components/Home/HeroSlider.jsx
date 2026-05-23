import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { heroSlides } from "../../data/products";

const icons = ["🔧", "🎨", "🚿"];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setCurrent((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => setAnimating(false), 400);
    }, 6000);

    return () => clearInterval(t);
  }, []);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 400);
  };

  const slide = heroSlides[current];

  // Configuration par slide
  const slideConfig = {
    0: {
      // Outillage - fond sombre
      textColor: "text-white",
      accentColor: "text-primary",
      overlay: "bg-gradient-to-r from-black/60 via-black/40 to-transparent",
      titleShadow: "drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]",
    },
    1: {
      // Peinture - fond clair/complexe
      textColor: "text-white",
      accentColor: "text-white",
      overlay:
        "bg-gradient-to-r from-[#0059b3]/70 via-[#0059b3]/50 to-black/30",
      titleShadow: "drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]",
    },
    2: {
      // Plomberie - fond clair
      textColor: "text-[#0A1929]",
      accentColor: "text-primary",
      overlay: "bg-gradient-to-r from-white/70 via-white/40 to-transparent",
      titleShadow: "drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]",
    },
  };

  const config = slideConfig[current] || slideConfig[0];

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ height: "480px" }}
    >
      {/* Image de fond */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay dynamique selon le slide */}
      <div
        className={`absolute inset-0 ${config.overlay} transition-all duration-700`}
      />

      {/* Accent bleu à droite */}
      <div className="absolute right-0 top-0 bottom-0 w-3 bg-primary" />

      {/* Contenu */}
      <div className="relative h-full flex items-center px-6 sm:px-10 lg:px-16">
        <div className="max-w-xl w-full">
          {/* Sous-titre */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl drop-shadow-md">{icons[current]}</span>
            <span
              className={`font-ui font-bold tracking-widest text-sm uppercase border-l-2 border-primary pl-3 ${config.textColor}`}
            >
              {slide.subtitle}
            </span>
          </div>

          {/* Titre principal */}
          <h1
            className={`font-bold leading-none mb-4 ${config.textColor} ${config.titleShadow}`}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.8rem, 7.5vw, 5.2rem)",
              letterSpacing: "0.03em",
            }}
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p
            className={`text-base sm:text-lg mb-8 max-w-md leading-relaxed font-medium ${config.textColor}`}
          >
            {slide.description}
          </p>

          {/* Boutons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={slide.url}
              className="btn-primary flex items-center gap-2 text-base py-3.5 px-7 font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              {slide.cta}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/products"
              className={`font-ui font-semibold text-sm tracking-wide hover:underline ${config.textColor}`}
            >
              Tout voir →
            </Link>
          </div>
        </div>
      </div>

      {/* Indicateurs en bas */}
      <div className="absolute bottom-6 left-6 sm:left-10 flex items-center gap-4 z-10">
        <div className="flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-10 bg-primary"
                  : "w-3 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
        <span
          className={`font-display text-sm font-medium ${config.textColor}`}
        >
          {String(current + 1).padStart(2, "0")} / 03
        </span>
      </div>

      {/* Flèches */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-10">
        <button
          onClick={() =>
            goTo((current - 1 + heroSlides.length) % heroSlides.length)
          }
          className="w-10 h-10 rounded-lg border border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => goTo((current + 1) % heroSlides.length)}
          className="w-10 h-10 rounded-lg border border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
