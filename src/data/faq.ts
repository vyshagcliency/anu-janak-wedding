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
    question: "What should I wear to the Sangeet Mélange?",
    answer:
      "Sparkle and Shine — Cocktail Attire (Indo-Western Chic). Embrace dark, elegant hues like Dark Blue, Dark Green, Black, Maroon, Golden, Purple, or Silver. Think glamorous and dazzling.",
    category: "attire",
    attireImages: [
      "/images/events/attire/sangeet-ref.webp",
    ],
  },
];
