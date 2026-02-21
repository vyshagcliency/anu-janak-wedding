export interface WeddingEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  venueMapUrl: string;
  dressCode: string;
  colors: { hex: string; name: string }[];
  timeOfDay: "sunset" | "night" | "morning" | "evening";
  photos: string[];
  attireImages: string[];
}

export const EVENTS: WeddingEvent[] = [
  {
    id: "sundowner",
    title: "Sundowner Carnival",
    subtitle: "An afternoon of warmth and colour",
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
    photos: [
      "/images/events/sundowner/photo3.jpg",
      "/images/events/sundowner/photo4.jpg",
      "/images/events/sundowner/photo5.jpg",
      "/images/events/sundowner/photo6.jpg",
    ],
    attireImages: ["/images/events/attire/sundowner-ref.webp"],
  },
  {
    id: "sangeet",
    title: "Sangeet Mélange",
    subtitle: "An evening of music and celebration",
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
    photos: [
      "/images/events/sangeet/photo1.jpg",
      "/images/events/sangeet/photo2.jpg",
      "/images/events/sangeet/photo3.jpg",
      "/images/events/sangeet/photo4.jpg",
    ],
    attireImages: ["/images/events/attire/sangeet-ref.webp"],
  },
  {
    id: "wedding",
    title: "Wedding Ceremony",
    subtitle: "The sacred union",
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
    photos: [
      "/images/events/wedding/photo1.jpg",
      "/images/events/wedding/photo2.jpg",
      "/images/events/wedding/photo3.jpg",
      "/images/events/wedding/photo4.jpg",
    ],
    attireImages: ["/images/events/attire/wedding-ref.webp"],
  },
  {
    id: "reception",
    title: "Wedding Reception",
    subtitle: "An elegant close to the celebration",
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
    photos: [
      "/images/events/reception/photo1.jpg",
      "/images/events/reception/photo2.jpg",
      "/images/events/reception/photo3.jpg",
      "/images/events/reception/photo4.jpg",
      "/images/events/reception/photo5.jpg",
      "/images/events/reception/photo6.jpg",
    ],
    attireImages: ["/images/events/attire/reception-ref.webp"],
  },
];
