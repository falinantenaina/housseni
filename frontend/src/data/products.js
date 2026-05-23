import outil from "../assets/outil.webp";
import peinture from "../assets/peinture.webp";
import plomberie from "../assets/plomberie.webp";
export const categories = [
  {
    id: "1",
    name: "Outillage",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
    icon: "🔧",
  },
  {
    id: "2",
    name: "Visserie & Fixation",
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400",
    icon: "🔩",
  },
  {
    id: "3",
    name: "Peinture",
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400",
    icon: "🎨",
  },
  {
    id: "4",
    name: "Plomberie",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    icon: "🚿",
  },
  {
    id: "5",
    name: "Électricité",
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400",
    icon: "⚡",
  },
  {
    id: "6",
    name: "Serrurerie",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    icon: "🔐",
  },
  {
    id: "7",
    name: "Quincaillerie",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400",
    icon: "⚙️",
  },
  {
    id: "8",
    name: "Construction",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400",
    icon: "🏗️",
  },
];

export const heroSlides = [
  {
    id: 1,
    title: "Outillage Professionnel",
    subtitle: "Qualité & Performance",
    description:
      "Perceuses, meuleuses, marteaux et tout l'outillage pour vos chantiers",
    cta: "Voir l'outillage",
    url: "/products?category=Outillage",
    bg: "#0D1B2E",
    image: outil,
  },
  {
    id: 2,
    title: "Peinture & Revêtement",
    subtitle: "Large Choix de Couleurs",
    description:
      "Peintures intérieures et extérieures, enduits, primaires et accessoires",
    cta: "Découvrir",
    url: "/products?category=Peinture",
    bg: "#fff",
    image: peinture,
  },
  {
    id: 3,
    title: "Plomberie & Sanitaire",
    subtitle: "Stock Disponible",
    description:
      "Tuyaux, raccords, robinetterie et tout le nécessaire pour vos installations",
    cta: "Voir les produits",
    url: "/products?category=Plomberie",
    bg: "#0A1929",
    image: plomberie,
  },
];
