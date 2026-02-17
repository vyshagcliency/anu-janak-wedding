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
    id: "venue-sundowner",
    question: "Where is the Sundowner Carnival?",
    answer:
      "The Sundowner Carnival will be held at The Leaf, Poomala on Friday, April 24, 2026 from 3:30 PM onwards.",
    category: "venue",
  },
  {
    id: "venue-sangeet",
    question: "Where is the Sangeet Mélange?",
    answer:
      "The Sangeet Mélange will also be at The Leaf, Poomala on Friday, April 24, 2026 from 6:30 PM to 10:30 PM.",
    category: "venue",
  },
  {
    id: "venue-wedding",
    question: "Where is the Wedding Ceremony?",
    answer:
      "The Wedding Ceremony will take place at Gokulam Park, Guruvayur on Sunday, April 26, 2026 from 11:00 AM onwards.",
    category: "venue",
  },
  {
    id: "venue-reception",
    question: "Where is the Reception?",
    answer:
      "The Wedding Reception will be at Blue Serene Resorts, Thoyakkavu on Monday, April 27, 2026 from 6:30 PM to 10:30 PM.",
    category: "venue",
  },
  {
    id: "parking",
    question: "Is parking available at the venues?",
    answer:
      "Yes, complimentary parking is available on-site at all venues. Signage and attendants will guide you upon arrival.",
    category: "logistics",
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
    id: "plus-one",
    question: "Can I bring a plus one?",
    answer:
      "Please refer to your invitation for the number of guests included. If you'd like to bring an additional guest, kindly let us know via the RSVP form below and we'll do our best to accommodate.",
    category: "general",
  },
  {
    id: "kids",
    question: "Are children welcome?",
    answer:
      "Absolutely! Children are welcome at all events. The Sundowner Carnival will have a wonderful setting for families.",
    category: "general",
  },
  {
    id: "food",
    question: "Will there be vegetarian / dietary options?",
    answer:
      "Yes! All events will offer a wide variety of vegetarian and non-vegetarian options. Please mention any specific dietary requirements or allergies in the RSVP form.",
    category: "general",
  },
  {
    id: "hashtag",
    question: "What's the wedding hashtag?",
    answer:
      "It's #AnuWedsJanak! Use it on all your photos and stories so we can find and treasure every captured moment.",
    category: "general",
  },
];
