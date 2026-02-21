export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "venue" | "attire" | "logistics";
  attireImages?: string[];
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "arrival",
    question: "What time should I arrive for each event?",
    answer:
      "About 30 minutes before each event is perfect — plenty of time to get seated and enjoy the setting.",
    category: "general",
  },
  {
    id: "dresscode-sundowner",
    question: "What should I wear to the Sundowner Carnival?",
    answer:
      "Festive Ethnic! Embrace bold, bright colors — think Pink, Red, Violet, Orange, Green, and Blue. It's a vibrant carnival-themed evening, so go all out with color.",
    category: "attire",
    attireImages: [
      "/images/events/attire/sundowner-ref.webp",
    ],
  },
  {
    id: "dresscode-sangeet",
    question: "What should I wear to the Sangeet?",
    answer:
      "Sparkle and Shine! Cocktail attire in dark hues with shimmer — Blue, Green, Black, Red, Golden, Purple, or Silver. Think glamorous and dazzling.",
    category: "attire",
    attireImages: [
      "/images/events/attire/sangeet-ref.webp",
    ],
  },
  {
    id: "dresscode-wedding",
    question: "What should I wear to the Wedding Ceremony?",
    answer:
      "Traditional attire — sarees, lehengas, sherwanis, or formal suits. Colors are your choice, so wear what makes you feel special!",
    category: "attire",
    attireImages: [
      "/images/events/attire/wedding-ref.webp",
    ],
  },
  {
    id: "dresscode-reception",
    question: "What should I wear to the Reception?",
    answer:
      "Reception Western Attire — elegant and polished. Colors are your choice. Think sophisticated evening wear that lets you celebrate in style.",
    category: "attire",
    attireImages: [
      "/images/events/attire/reception-ref.webp",
    ],
  },
  {
    id: "food",
    question: "Will there be vegetarian / dietary options?",
    answer:
      "Yes! All events will offer a wide variety of vegetarian and non-vegetarian options. Please mention any specific dietary requirements or allergies in the RSVP form.",
    category: "general",
  },
];
