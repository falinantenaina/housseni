import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Image,
  Layers,
  LoaderCircle,
  Megaphone,
  Palette,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdminBanner,
  deleteAdminBanner,
  fetchAdminBanners,
  toggleAdminBanner,
} from "../../store/slices/bannerSlice";
import AdminHeader from "../components/AdminHeader";
import AdminLayout from "../components/AdminLayout";

//  Définition des layouts
const LAYOUTS = [
  {
    id: "promo_items",
    label: "Promo + Articles",
    description: "Texte coloré à gauche, liste produits à droite",
    icon: (
      <svg viewBox="0 0 80 44" className="w-full h-full">
        <rect
          x="0"
          y="0"
          width="28"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.8"
        />
        <rect
          x="31"
          y="6"
          width="13"
          height="32"
          rx="2"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="47"
          y="6"
          width="13"
          height="32"
          rx="2"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="63"
          y="6"
          width="13"
          height="32"
          rx="2"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>
    ),
    needsImage: false,
    needsItems: true,
    needsBgColor: true,
  },
  {
    id: "full_image",
    label: "Grande Image",
    description: "Image pleine largeur avec CTA optionnel",
    icon: (
      <svg viewBox="0 0 80 44" className="w-full h-full">
        <rect
          x="0"
          y="0"
          width="80"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M0 30 Q20 20 40 28 Q60 36 80 24 L80 44 L0 44Z"
          fill="currentColor"
          opacity="0.5"
        />
        <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.6" />
      </svg>
    ),
    needsImage: true,
    needsItems: false,
    needsBgColor: false,
  },
  {
    id: "text_image",
    label: "Texte | Image",
    description: "Texte et CTA à gauche, image à droite",
    icon: (
      <svg viewBox="0 0 80 44" className="w-full h-full">
        <rect
          x="0"
          y="0"
          width="36"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.8"
        />
        <rect
          x="39"
          y="0"
          width="41"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="5"
          y="10"
          width="22"
          height="3"
          rx="1.5"
          fill="white"
          opacity="0.7"
        />
        <rect
          x="5"
          y="17"
          width="16"
          height="2"
          rx="1"
          fill="white"
          opacity="0.5"
        />
        <rect
          x="5"
          y="28"
          width="14"
          height="6"
          rx="3"
          fill="white"
          opacity="0.4"
        />
      </svg>
    ),
    needsImage: true,
    needsItems: false,
    needsBgColor: true,
  },
  {
    id: "image_text",
    label: "Image | Texte",
    description: "Image à gauche, texte et CTA à droite",
    icon: (
      <svg viewBox="0 0 80 44" className="w-full h-full">
        <rect
          x="0"
          y="0"
          width="41"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="44"
          y="0"
          width="36"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.8"
        />
        <rect
          x="49"
          y="10"
          width="22"
          height="3"
          rx="1.5"
          fill="white"
          opacity="0.7"
        />
        <rect
          x="49"
          y="17"
          width="16"
          height="2"
          rx="1"
          fill="white"
          opacity="0.5"
        />
        <rect
          x="49"
          y="28"
          width="14"
          height="6"
          rx="3"
          fill="white"
          opacity="0.4"
        />
      </svg>
    ),
    needsImage: true,
    needsItems: false,
    needsBgColor: true,
  },
  {
    id: "centered_text",
    label: "Grand Texte Centré",
    description: "Titre géant au centre, fond couleur ou image",
    icon: (
      <svg viewBox="0 0 80 44" className="w-full h-full">
        <rect
          x="0"
          y="0"
          width="80"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.15"
        />
        <rect
          x="10"
          y="12"
          width="60"
          height="5"
          rx="2.5"
          fill="currentColor"
          opacity="0.7"
        />
        <rect
          x="22"
          y="21"
          width="36"
          height="3"
          rx="1.5"
          fill="currentColor"
          opacity="0.5"
        />
        <rect
          x="28"
          y="30"
          width="24"
          height="6"
          rx="3"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    ),
    needsImage: false,
    needsItems: false,
    needsBgColor: true,
    acceptsOptionalImage: true,
  },
  {
    id: "image_overlay",
    label: "Image + Overlay",
    description: "Image de fond avec texte et CTA superposés",
    icon: (
      <svg viewBox="0 0 80 44" className="w-full h-full">
        <rect
          x="0"
          y="0"
          width="80"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="0"
          y="0"
          width="40"
          height="44"
          rx="3"
          fill="currentColor"
          opacity="0.5"
        />
        <rect
          x="6"
          y="10"
          width="26"
          height="4"
          rx="2"
          fill="white"
          opacity="0.8"
        />
        <rect
          x="6"
          y="18"
          width="18"
          height="2.5"
          rx="1.25"
          fill="white"
          opacity="0.6"
        />
        <rect
          x="6"
          y="28"
          width="16"
          height="6"
          rx="3"
          fill="white"
          opacity="0.5"
        />
      </svg>
    ),
    needsImage: true,
    needsItems: false,
    needsBgColor: false,
  },
];

const getLayoutMeta = (id) => LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];

//  Sélecteur de layout
const LayoutPicker = ({ value, onChange }) => (
  <div>
    <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
      <Layers className="w-3.5 h-3.5" /> Type de bannière
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {LAYOUTS.map((layout) => (
        <button
          key={layout.id}
          type="button"
          onClick={() => onChange(layout.id)}
          className={`flex flex-col gap-2 p-3 rounded-xl border-2 text-left transition-all ${
            value === layout.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-secondary/50"
          }`}
        >
          <div
            className={`w-full h-10 ${value === layout.id ? "text-primary" : "text-muted-foreground"}`}
          >
            {layout.icon}
          </div>
          <div>
            <p
              className={`font-ui font-bold text-xs tracking-wide ${value === layout.id ? "text-primary" : "text-foreground"}`}
            >
              {layout.label}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              {layout.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

//  Upload image principale
const BgImageUpload = ({
  preview,
  onChange,
  label = "Image de la bannière",
}) => {
  const fileRef = useRef();
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          onChange(file, URL.createObjectURL(file));
        }}
      />
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors relative"
        style={{ minHeight: 120 }}
      >
        {preview ? (
          <img src={preview} alt="" className="w-full h-40 object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground/50">
            <Image className="w-8 h-8" />
            <span className="text-xs">Cliquer pour uploader</span>
          </div>
        )}
        {preview && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 hover:opacity-100 text-white text-xs font-ui font-semibold bg-black/50 px-3 py-1 rounded-full transition-opacity">
              Changer
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

//  Aperçu miniature
const BannerPreviewMini = ({ banner }) => {
  const layout = banner.layout || "promo_items";
  const {
    title,
    subtitle,
    cta_text,
    items = [],
    bg_color,
    bgImagePreview,
  } = banner;

  // Couleur de fond calculée
  const panelStyle = bg_color ? { backgroundColor: bg_color } : {};

  if (layout === "full_image") {
    return (
      <div className="w-full rounded-lg overflow-hidden min-h-[80px] relative border border-border">
        {bgImagePreview ? (
          <img
            src={bgImagePreview}
            alt=""
            className="w-full h-20 object-cover"
          />
        ) : (
          <div className="w-full h-20 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
            <Image className="w-5 h-5 text-muted-foreground/30" />
          </div>
        )}
        {title && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
            <p className="font-display text-white text-sm tracking-widest truncate">
              {title}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (layout === "centered_text") {
    return (
      <div
        className="w-full rounded-lg overflow-hidden min-h-[80px] flex flex-col items-center justify-center text-center px-4 py-4 relative border border-border"
        style={
          !bgImagePreview
            ? { backgroundColor: bg_color || "var(--color-primary)" }
            : {}
        }
      >
        {bgImagePreview && (
          <>
            <img
              src={bgImagePreview}
              alt=""
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
        <div className="relative z-10">
          <p className="font-display text-white text-xl tracking-widest leading-none drop-shadow">
            {title || "TITRE"}
          </p>
          {subtitle && (
            <p className="text-white/70 text-[9px] mt-1">{subtitle}</p>
          )}
          {cta_text && (
            <div className="mt-2 inline-block border border-white/60 text-white text-[8px] px-2 py-0.5 rounded-full">
              {cta_text}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (layout === "text_image" || layout === "image_text") {
    const isTextLeft = layout === "text_image";
    const textBlock = (
      <div
        className="flex flex-col justify-center px-3 py-2 flex-1 bg-primary"
        style={panelStyle}
      >
        <p className="font-display text-white text-sm tracking-widest leading-none truncate">
          {title || "TITRE"}
        </p>
        {subtitle && (
          <p className="text-white/60 text-[8px] mt-0.5 truncate">{subtitle}</p>
        )}
        {cta_text && (
          <div className="mt-1.5 self-start border border-white/60 text-white text-[7px] px-1.5 py-0.5 rounded-full">
            {cta_text}
          </div>
        )}
      </div>
    );
    const imgBlock = (
      <div className="flex-1 relative overflow-hidden min-h-[80px]">
        {bgImagePreview ? (
          <img
            src={bgImagePreview}
            alt=""
            className="w-full h-full object-cover absolute inset-0"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center min-h-[80px]">
            <Image className="w-4 h-4 text-muted-foreground/20" />
          </div>
        )}
      </div>
    );
    return (
      <div className="w-full rounded-lg overflow-hidden flex items-stretch min-h-[80px] border border-border">
        {isTextLeft ? textBlock : imgBlock}
        {isTextLeft ? imgBlock : textBlock}
      </div>
    );
  }

  if (layout === "image_overlay") {
    return (
      <div className="w-full rounded-lg overflow-hidden min-h-[80px] relative border border-border">
        {bgImagePreview ? (
          <img
            src={bgImagePreview}
            alt=""
            className="w-full h-20 object-cover"
          />
        ) : (
          <div className="w-full h-20 bg-gradient-to-r from-primary to-primary/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-3 py-2">
          <p className="font-display text-white text-sm tracking-widest leading-none drop-shadow truncate">
            {title || "TITRE"}
          </p>
          {subtitle && (
            <p className="text-white/70 text-[8px] mt-0.5 truncate">
              {subtitle}
            </p>
          )}
          {cta_text && (
            <div className="mt-1.5 self-start border border-white/60 text-white text-[7px] px-1.5 py-0.5 rounded-full">
              {cta_text}
            </div>
          )}
        </div>
      </div>
    );
  }

  // promo_items (default)
  return (
    <div className="w-full bg-white border border-border rounded-lg overflow-hidden flex items-stretch min-h-[80px] text-xs pointer-events-none select-none">
      <div
        className="bg-primary flex flex-col justify-center px-3 py-2 min-w-[90px] relative shrink-0"
        style={panelStyle}
      >
        <p className="font-display text-white text-lg leading-none tracking-widest truncate">
          {title || "PROMO"}
        </p>
        {subtitle && (
          <p className="text-white/70 text-[8px] mt-0.5 truncate">{subtitle}</p>
        )}
        <div className="mt-1.5 self-start border border-white/60 text-white text-[7px] px-1.5 py-0.5 rounded-full">
          {cta_text || "J'en profite"}
        </div>
      </div>
      <div className="w-2 bg-primary shrink-0" style={panelStyle} />
      <div className="flex-1 flex items-center divide-x divide-border overflow-hidden">
        {items.slice(0, 3).map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center px-2 py-1.5 min-w-[60px] gap-1"
          >
            <p className="font-bold text-foreground text-[8px] text-center leading-tight truncate w-full">
              {item.label || "Produit"}
            </p>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="h-7 w-auto object-contain"
              />
            ) : (
              <div className="h-7 w-10 bg-secondary rounded flex items-center justify-center">
                <Image className="w-2.5 h-2.5 text-muted-foreground/30" />
              </div>
            )}
            {item.promo_price && (
              <p className="text-primary font-bold text-[8px]">
                {Number(item.promo_price).toLocaleString("fr-MG")} €
              </p>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground/30 text-[9px] px-2">
            Aucun article
          </div>
        )}
      </div>
    </div>
  );
};

//  Item formulaire (pour promo_items)
const ItemForm = ({ item, index, onChange, onRemove, totalItems }) => {
  const fileRef = useRef();
  const [preview, setPreview] = useState(item.image_url || null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(index, { ...item, imageFile: file, image_url: url });
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-secondary/30 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-ui font-bold text-xs tracking-widest uppercase text-muted-foreground">
          Article {index + 1}
        </span>
        {totalItems > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Nom *
          </label>
          <input
            type="text"
            value={item.label}
            onChange={(e) =>
              onChange(index, { ...item, label: e.target.value })
            }
            placeholder="Ex: Carrelage Sol"
            className="input-base w-full text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Sous-titre
          </label>
          <input
            type="text"
            value={item.sublabel || ""}
            onChange={(e) =>
              onChange(index, { ...item, sublabel: e.target.value })
            }
            placeholder="Ex: 30×60cm"
            className="input-base w-full text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Prix original
          </label>
          <input
            type="number"
            step="any"
            value={item.original_price || ""}
            onChange={(e) =>
              onChange(index, { ...item, original_price: e.target.value })
            }
            placeholder="55 000"
            className="input-base w-full text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Prix promo
          </label>
          <input
            type="number"
            step="any"
            value={item.promo_price || ""}
            onChange={(e) =>
              onChange(index, { ...item, promo_price: e.target.value })
            }
            placeholder="27 500"
            className="input-base w-full text-sm py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">
          Image du produit
        </label>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          className="hidden"
          onChange={handleFile}
        />
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt=""
                className="h-12 w-auto object-contain rounded"
              />
              <span className="text-xs text-muted-foreground">
                Cliquer pour changer
              </span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center shrink-0">
                <Image className="w-5 h-5 text-muted-foreground/40" />
              </div>
              <span className="text-xs text-muted-foreground">
                Cliquer pour uploader
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

//  Formulaire de création
const CreateForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.banner);

  const [layout, setLayout] = useState("promo_items");
  const layoutMeta = getLayoutMeta(layout);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    badge_text: "",
    date_range: "",
    cta_text: "J'en profite",
    cta_url: "/products",
    bg_color: "",
  });

  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(null);

  const [items, setItems] = useState([
    {
      label: "",
      sublabel: "",
      original_price: "",
      promo_price: "",
      imageFile: null,
      image_url: null,
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    if (items.length >= 5) return;
    setItems([
      ...items,
      {
        label: "",
        sublabel: "",
        original_price: "",
        promo_price: "",
        imageFile: null,
        image_url: null,
      },
    ]);
  };

  const updateItem = (index, updated) =>
    setItems(items.map((it, i) => (i === index ? updated : it)));

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const data = new FormData();
    data.append("layout", layout);
    Object.entries(form).forEach(([k, v]) => data.append(k, v || ""));

    if (bgImageFile) data.append("bg_image", bgImageFile);

    if (layoutMeta.needsItems) {
      data.append(
        "items",
        JSON.stringify(
          items.map(({ label, sublabel, original_price, promo_price }) => ({
            label,
            sublabel,
            original_price,
            promo_price,
          })),
        ),
      );
      items.forEach((item, i) => {
        if (item.imageFile) data.append(`item_image_${i}`, item.imageFile);
      });
    } else {
      data.append("items", JSON.stringify([]));
    }

    dispatch(createAdminBanner(data)).then((res) => {
      if (!res.error) onClose();
    });
  };

  const previewBanner = {
    ...form,
    layout,
    bgImagePreview,
    items: items.map((it) => ({ ...it, id: Math.random() })),
  };

  // Champs communs : titre, sous-titre, CTA, dates
  const showCta = layout !== "full_image";
  const showDates = true;
  const showBadge = layout === "promo_items";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Megaphone className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="font-ui font-bold text-lg tracking-wide">
                Nouvelle Bannière
              </h2>
              <p className="text-xs text-muted-foreground">
                {layoutMeta.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 text-xs font-ui font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {showPreview ? "Masquer" : "Aperçu"}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-xl text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Aperçu */}
          {showPreview && (
            <div className="rounded-xl overflow-hidden border border-border">
              <div className="px-3 py-2 bg-secondary/50 border-b border-border">
                <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase">
                  Aperçu en temps réel
                </p>
              </div>
              <div className="p-3">
                <BannerPreviewMini banner={previewBanner} />
              </div>
            </div>
          )}

          {/* Sélecteur de layout */}
          <LayoutPicker
            value={layout}
            onChange={(l) => {
              setLayout(l);
              setBgImageFile(null);
              setBgImagePreview(null);
            }}
          />

          {/* Image principale */}
          {(layoutMeta.needsImage || layoutMeta.acceptsOptionalImage) && (
            <div>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
                <Image className="w-3.5 h-3.5" /> Image
                {layoutMeta.acceptsOptionalImage && (
                  <span className="text-[10px] normal-case text-muted-foreground/60 ml-1">
                    (optionnelle)
                  </span>
                )}
              </p>
              <BgImageUpload
                preview={bgImagePreview}
                label={
                  layout === "full_image"
                    ? "Image pleine largeur *"
                    : layout === "centered_text"
                      ? "Image de fond (optionnel)"
                      : "Image (droite/gauche) *"
                }
                onChange={(file, url) => {
                  setBgImageFile(file);
                  setBgImagePreview(url);
                }}
              />
            </div>
          )}

          {/* Infos texte */}
          <div>
            <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" /> Texte de la bannière
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={layout === "centered_text" ? "sm:col-span-2" : ""}
              >
                <label className="block text-sm font-medium mb-1.5">
                  Titre principal *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={
                    layout === "centered_text"
                      ? "Ex: SOLDES D'ÉTÉ"
                      : "Ex: PROMO"
                  }
                  className="input-base w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                  placeholder="Ex: Offres exceptionnelles"
                  className="input-base w-full"
                />
              </div>
              {showDates && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Dates
                  </label>
                  <input
                    type="text"
                    value={form.date_range}
                    onChange={(e) =>
                      setForm({ ...form, date_range: e.target.value })
                    }
                    placeholder="Ex: Du 30 avril au 31 mai"
                    className="input-base w-full"
                  />
                </div>
              )}
              {showBadge && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Badge rond
                    <span className="ml-1 text-xs text-muted-foreground">
                      (saut de ligne = 2e ligne)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.badge_text}
                    onChange={(e) =>
                      setForm({ ...form, badge_text: e.target.value })
                    }
                    placeholder={"Ex: Jusqu'à 50%\nde remise"}
                    className="input-base w-full"
                  />
                </div>
              )}
              {showCta && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Texte du bouton
                    </label>
                    <input
                      type="text"
                      value={form.cta_text}
                      onChange={(e) =>
                        setForm({ ...form, cta_text: e.target.value })
                      }
                      placeholder="Ex: J'en profite"
                      className="input-base w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Lien du bouton
                    </label>
                    <input
                      type="text"
                      value={form.cta_url}
                      onChange={(e) =>
                        setForm({ ...form, cta_url: e.target.value })
                      }
                      placeholder="Ex: /products?featured=true"
                      className="input-base w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Couleur de fond */}
          {layoutMeta.needsBgColor && (
            <div>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" /> Couleur
                {layout !== "centered_text" && (
                  <span className="text-[10px] normal-case text-muted-foreground/60 ml-1">
                    (panneau coloré — laissez vide pour la couleur primaire)
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.bg_color || "#000000"}
                  onChange={(e) =>
                    setForm({ ...form, bg_color: e.target.value })
                  }
                  className="h-10 w-16 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={form.bg_color}
                  onChange={(e) =>
                    setForm({ ...form, bg_color: e.target.value })
                  }
                  placeholder="Ex: #e63946 ou laissez vide"
                  className="input-base flex-1 font-mono text-sm"
                />
                {form.bg_color && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, bg_color: "" })}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Articles produits */}
          {layoutMeta.needsItems && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Articles ({items.length}/5)
                </p>
                {items.length < 5 && (
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1.5 text-xs font-ui font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter un article
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <ItemForm
                    key={i}
                    item={item}
                    index={i}
                    onChange={updateItem}
                    onRemove={removeItem}
                    totalItems={items.length}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim()}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                "CRÉER LA BANNIÈRE"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

//  Carte bannière
const BannerCard = ({ banner }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const layoutMeta = getLayoutMeta(banner.layout || "promo_items");

  const handleToggle = async () => {
    setToggling(true);
    await dispatch(toggleAdminBanner(banner.id));
    setToggling(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer la bannière "${banner.title}" ?`)) return;
    setDeleting(true);
    await dispatch(deleteAdminBanner(banner.id));
  };

  return (
    <div
      className={`card-base overflow-hidden transition-all duration-200 ${banner.is_active ? "border-primary/40" : ""}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${banner.is_active ? "bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" : "bg-border"}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-ui font-bold text-foreground tracking-wide">
              {banner.title}
            </h3>
            <span className="text-[10px] font-ui font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              {layoutMeta.label}
            </span>
            {banner.badge_text && (
              <span className="text-[10px] font-ui font-semibold bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/30">
                {banner.badge_text.replace("\n", " ")}
              </span>
            )}
            {banner.is_active ? (
              <span className="text-[10px] font-ui font-semibold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">
                Actif · slider
              </span>
            ) : (
              <span className="text-[10px] font-ui font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                Inactif
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {banner.date_range && (
              <p className="text-xs text-muted-foreground">
                {banner.date_range}
              </p>
            )}
            {layoutMeta.needsItems && (
              <p className="text-xs text-muted-foreground">
                {(banner.items || []).length} article
                {(banner.items || []).length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex items-center gap-1.5 text-xs font-ui font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              banner.is_active
                ? "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {toggling ? (
              <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
            ) : banner.is_active ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {banner.is_active ? "Désactiver" : "Activer"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
          >
            {deleting ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border p-4 animate-fade-up space-y-4">
          <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase">
            Aperçu
          </p>
          <BannerPreviewMini
            banner={{ ...banner, bgImagePreview: banner.bg_image_url }}
          />

          {(banner.items || []).length > 0 && (
            <div>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-2">
                Articles
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {banner.items.map((item, i) => (
                  <div
                    key={item.id || i}
                    className="border border-border rounded-lg p-3 text-center space-y-1.5"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt=""
                        className="h-12 w-auto object-contain mx-auto"
                      />
                    ) : (
                      <div className="h-12 w-full bg-secondary rounded flex items-center justify-center">
                        <Image className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    )}
                    <p className="font-ui font-bold text-foreground text-xs leading-tight">
                      {item.label}
                    </p>
                    {item.sublabel && (
                      <p className="text-muted-foreground text-[10px]">
                        {item.sublabel}
                      </p>
                    )}
                    {item.original_price && (
                      <p className="text-muted-foreground text-[10px] line-through">
                        {Number(item.original_price).toLocaleString("fr-MG")} €
                      </p>
                    )}
                    {item.promo_price && (
                      <p className="text-primary font-bold text-xs">
                        {Number(item.promo_price).toLocaleString("fr-MG")} €
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

//  Page principale
const AdminBanners = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((s) => s.banner);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminBanners());
  }, [dispatch]);

  const activeBanners = banners.filter((b) => b.is_active);
  const inactiveBanners = banners.filter((b) => !b.is_active);

  return (
    <AdminLayout>
      <AdminHeader title="Bannières Promo" />

      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="grid grid-cols-3 gap-3 flex-1">
            <div className="card-base p-4 text-center">
              <p className="font-display text-primary text-3xl">
                {banners.length}
              </p>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                Total
              </p>
            </div>
            <div className="card-base p-4 text-center">
              <p className="font-display text-emerald-500 text-3xl">
                {activeBanners.length}
              </p>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                Actives
              </p>
            </div>
            <div className="card-base p-4 text-center">
              <p className="font-display text-muted-foreground text-3xl">
                {inactiveBanners.length}
              </p>
              <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
                Inactives
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> NOUVELLE BANNIÈRE
          </button>
        </div>

        {activeBanners.length > 1 && (
          <div className="mb-5 flex items-center gap-2 text-sm text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
            <Layers className="w-4 h-4 shrink-0" />
            <span className="font-ui">
              <strong>{activeBanners.length} bannières actives</strong> — elles
              s'affichent en slider automatique sur le site.
            </span>
          </div>
        )}
        {activeBanners.length === 1 && (
          <div className="mb-5 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
            <Eye className="w-4 h-4 shrink-0" />
            <span className="font-ui">
              <strong>1 bannière active</strong> — affichée en fixe sur le site.
              Activez-en plusieurs pour un slider.
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="font-ui font-bold text-xl text-foreground tracking-wide mb-2">
              Aucune bannière
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Créez votre première bannière promotionnelle.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" /> CRÉER UNE BANNIÈRE
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeBanners.length > 0 && (
              <div>
                <p className="font-ui text-xs text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Bannières actives — visibles sur le site
                </p>
                <div className="space-y-3">
                  {activeBanners.map((b) => (
                    <BannerCard key={b.id} banner={b} />
                  ))}
                </div>
              </div>
            )}
            {inactiveBanners.length > 0 && (
              <div>
                <p className="font-ui text-xs text-muted-foreground tracking-widests uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-border" />
                  Bannières inactives
                </p>
                <div className="space-y-3">
                  {inactiveBanners.map((b) => (
                    <BannerCard key={b.id} banner={b} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showCreate && <CreateForm onClose={() => setShowCreate(false)} />}
    </AdminLayout>
  );
};

export default AdminBanners;
