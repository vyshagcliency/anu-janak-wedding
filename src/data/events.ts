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
    date: "April 24, 2026",
    time: "5:00 PM – 10:00 PM",
    venue: "The Sunset Terrace",
    venueAddress: "123 Celebration Drive, Venue City",
    venueMapUrl: "https://maps.google.com/?q=The+Sunset+Terrace",
    dressCode: "Bright & Bold — think carnival colors!",
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
    title: "Sangeet M\u00e9lange",
    date: "April 25, 2026",
    time: "7:00 PM – 12:00 AM",
    venue: "The Grand Ballroom",
    venueAddress: "456 Harmony Lane, Venue City",
    venueMapUrl: "https://maps.google.com/?q=The+Grand+Ballroom",
    dressCode: "Glamorous & Shimmery — dark tones with sparkle",
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
    date: "April 26, 2026",
    time: "8:00 AM – 2:00 PM",
    venue: "The Sacred Garden",
    venueAddress: "789 Blessing Boulevard, Venue City",
    venueMapUrl: "https://maps.google.com/?q=The+Sacred+Garden",
    dressCode: "Traditional & Elegant — soft pastels welcome",
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
    title: "Reception",
    date: "April 26, 2026",
    time: "7:00 PM – 11:00 PM",
    venue: "The Crystal Pavilion",
    venueAddress: "321 Starlight Road, Venue City",
    venueMapUrl: "https://maps.google.com/?q=The+Crystal+Pavilion",
    dressCode: "Black Tie — sophisticated and polished",
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
