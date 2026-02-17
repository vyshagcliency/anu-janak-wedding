export interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  venueMapUrl: string;
  dressCode: string;
  colors: { hex: string; name: string }[];
  timeOfDay: "sunset" | "night" | "morning" | "evening";
  bgImage: string;
  imageRevealType: "circle" | "slide" | "fade" | "blur";
}

export const EVENTS: WeddingEvent[] = [
  {
    id: "sundowner",
    title: "Sundowner Carnival",
    date: "Friday, April 24, 2026",
    time: "3:30 PM onwards",
    venue: "The Leaf, Poomala",
    venueAddress: "The Leaf, Poomala",
    venueMapUrl: "https://share.google/1fN4rknlVSPCqqrbU",
    dressCode: "Festive Ethnic",
    colors: [
      { hex: "#E91E63", name: "Pink" },
      { hex: "#F44336", name: "Red" },
      { hex: "#9C27B0", name: "Violet" },
      { hex: "#FF9800", name: "Orange" },
      { hex: "#4CAF50", name: "Green" },
      { hex: "#2196F3", name: "Blue" },
    ],
    timeOfDay: "sunset",
    bgImage: "/images/events/sundowner/placeholder.webp",
    imageRevealType: "circle",
  },
  {
    id: "sangeet",
    title: "Sangeet Mélange",
    date: "Friday, April 24, 2026",
    time: "6:30 PM – 10:30 PM",
    venue: "The Leaf, Poomala",
    venueAddress: "The Leaf, Poomala",
    venueMapUrl: "https://share.google/1fN4rknlVSPCqqrbU",
    dressCode: "Sparkle and Shine — Cocktail Attire",
    colors: [
      { hex: "#1565C0", name: "Blue" },
      { hex: "#2E7D32", name: "Green" },
      { hex: "#212121", name: "Black" },
      { hex: "#C62828", name: "Red" },
      { hex: "#FFD700", name: "Golden" },
      { hex: "#6A1B9A", name: "Purple" },
      { hex: "#BDBDBD", name: "Silver" },
    ],
    timeOfDay: "night",
    bgImage: "/images/events/sangeet/placeholder.webp",
    imageRevealType: "slide",
  },
  {
    id: "wedding",
    title: "Wedding Ceremony",
    date: "Sunday, April 26, 2026",
    time: "11:00 AM onwards",
    venue: "Gokulam Park, Guruvayur",
    venueAddress: "Gokulam Park, Guruvayur",
    venueMapUrl: "https://share.google/Q8iyUCIuGkN3TrjnZ",
    dressCode: "Traditional Attire — Colors of your choice",
    colors: [
      { hex: "#E8D5B0", name: "Champagne" },
      { hex: "#F0DDD5", name: "Blush" },
      { hex: "#C9A96E", name: "Gold" },
      { hex: "#FFFFFF", name: "White" },
      { hex: "#D4A833", name: "Amber" },
      { hex: "#F5E6D3", name: "Ivory" },
    ],
    timeOfDay: "morning",
    bgImage: "/images/events/wedding/placeholder.webp",
    imageRevealType: "fade",
  },
  {
    id: "reception",
    title: "Wedding Reception",
    date: "Monday, April 27, 2026",
    time: "6:30 PM – 10:30 PM",
    venue: "Blue Serene Resorts, Thoyakkavu",
    venueAddress: "Blue Serene Resorts, Thoyakkavu",
    venueMapUrl: "https://share.google/hkCLwZBFRdU5uSext",
    dressCode: "Reception Western Attire — Colors of your choice",
    colors: [
      { hex: "#1A1A2E", name: "Midnight" },
      { hex: "#C9A96E", name: "Gold" },
      { hex: "#800020", name: "Burgundy" },
      { hex: "#2C2C2C", name: "Charcoal" },
      { hex: "#E8D5B0", name: "Champagne" },
      { hex: "#4A0E0E", name: "Deep Maroon" },
    ],
    timeOfDay: "evening",
    bgImage: "/images/events/reception/placeholder.webp",
    imageRevealType: "blur",
  },
];
