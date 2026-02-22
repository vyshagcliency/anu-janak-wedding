export interface SubEvent {
  name: string;
  venue: string;
  venueMapUrl?: string;
  time: string;
}

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
  subEvents?: SubEvent[];
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
    attireImages: ["/images/events/attire/sundowner-ref.png"],
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
    dressCode: "Sparkle and Shine — Cocktail Attire (Indo-Western Chic)",
    colors: [
      { hex: "#0D47A1", name: "Dark Blue" },
      { hex: "#1B5E20", name: "Dark Green" },
      { hex: "#000000", name: "Black" },
      { hex: "#5D0F0D", name: "Maroon" },
      { hex: "#B8860B", name: "Golden" },
      { hex: "#4A148C", name: "Purple" },
      { hex: "#757575", name: "Silver" },
    ],
    timeOfDay: "night",
    photos: [
      "/images/events/sangeet/photo1.jpg",
      "/images/events/sangeet/photo2.jpg",
      "/images/events/sangeet/photo3.jpg",
      "/images/events/sangeet/photo4.jpg",
    ],
    attireImages: ["/images/events/attire/sangeet-ref.png"],
  },
  {
    id: "wedding",
    title: "Wedding Ceremony",
    subtitle: "The sacred union",
    date: "Sunday, April 26, 2026",
    time: "7:30 AM onwards",
    venue: "Gokulam Park - East Nada, Guruvayur",
    venueAddress: "Gokulam Park - East Nada, Guruvayur",
    venueMapUrl: "https://share.google/Q8iyUCIuGkN3TrjnZ",
    dressCode: "Traditional Attire — Colors of your choice",
    colors: [],
    timeOfDay: "morning",
    subEvents: [
      {
        name: "Thaalikettu",
        venue: "Sree Krishna Temple, Guruvayur",
        time: "7:30 AM – 8:00 AM",
      },
      {
        name: "Wedding Ceremony & Lunch thereafter",
        venue: "Gokulam Park - East Nada, Guruvayur",
        venueMapUrl: "https://share.google/Q8iyUCIuGkN3TrjnZ",
        time: "11:00 AM onwards",
      },
    ],
    photos: [
      "/images/events/wedding/photo1.jpg",
      "/images/events/wedding/photo2.jpg",
      "/images/events/wedding/photo3.jpg",
      "/images/events/wedding/photo4.jpg",
    ],
    attireImages: ["/images/events/attire/wedding-ref.jpeg"],
  },
  {
    id: "reception",
    title: "Wedding Reception",
    subtitle: "An elegant close to the celebration",
    date: "Monday, April 27, 2026",
    time: "6:30 PM onwards",
    venue: "Blue Serene Resorts, Thoyakkavu",
    venueAddress: "Blue Serene Resorts, Thoyakkavu",
    venueMapUrl: "https://share.google/hkCLwZBFRdU5uSext",
    dressCode: "Reception Western Attire — Colors of your choice",
    colors: [],
    timeOfDay: "evening",
    photos: [
      "/images/events/reception/photo1.jpg",
      "/images/events/reception/photo2.jpg",
      "/images/events/reception/photo3.jpg",
      "/images/events/reception/photo4.jpg",
    ],
    attireImages: ["/images/events/attire/reception-ref.png"],
  },
];
