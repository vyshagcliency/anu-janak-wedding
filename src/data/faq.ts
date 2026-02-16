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
      "We recommend arriving 15–20 minutes before the scheduled start time. For the Wedding Ceremony (8:00 AM), please be seated by 7:45 AM as the rituals will begin promptly.",
    category: "general",
  },
  {
    id: "venue-sundowner",
    question: "Where is the Sundowner Carnival?",
    answer:
      "The Sundowner Carnival will be held at The Sunset Terrace, 123 Celebration Drive, Venue City. Look for the decorated entrance — you can't miss it!",
    category: "venue",
  },
  {
    id: "venue-sangeet",
    question: "Where is the Sangeet M\u00e9lange?",
    answer:
      "The Sangeet will be at The Grand Ballroom, 456 Harmony Lane, Venue City. Valet parking will be available at the venue entrance.",
    category: "venue",
  },
  {
    id: "venue-wedding",
    question: "Where is the Wedding Ceremony?",
    answer:
      "The Wedding Ceremony will take place at The Sacred Garden, 789 Blessing Boulevard, Venue City. This is an outdoor venue — comfortable footwear is recommended.",
    category: "venue",
  },
  {
    id: "venue-reception",
    question: "Where is the Reception?",
    answer:
      "The Reception will be at The Crystal Pavilion, 321 Starlight Road, Venue City. It's a 10-minute drive from the wedding venue.",
    category: "venue",
  },
  {
    id: "parking",
    question: "Is parking available at the venues?",
    answer:
      "Yes, complimentary parking is available at all venues. Valet parking will also be available at the Sangeet and Reception venues. We recommend carpooling where possible.",
    category: "logistics",
  },
  {
    id: "dresscode-sundowner",
    question: "What should I wear to the Sundowner Carnival?",
    answer:
      "Think bright, bold, and festive! This is a fun outdoor carnival event — vibrant colors like pink, red, orange, violet, green, and blue are encouraged. Comfortable shoes recommended as it's on a terrace.",
    category: "attire",
    attireImages: [
      "/images/events/attire/sundowner-ref.webp",
    ],
  },
  {
    id: "dresscode-sangeet",
    question: "What should I wear to the Sangeet?",
    answer:
      "Go glamorous! Dark, shimmery outfits in blue, green, black, red, golden, or purple tones work perfectly. Think cocktail-party elegance with a touch of sparkle.",
    category: "attire",
    attireImages: [
      "/images/events/attire/sangeet-ref.webp",
    ],
  },
  {
    id: "dresscode-wedding",
    question: "What should I wear to the Wedding Ceremony?",
    answer:
      "Traditional and elegant attire in soft pastels — champagne, blush, gold, ivory, and white are the palette. Sarees, lehengas, sherwanis, or formal suits are all perfect.",
    category: "attire",
    attireImages: [
      "/images/events/attire/wedding-ref.webp",
    ],
  },
  {
    id: "dresscode-reception",
    question: "What should I wear to the Reception?",
    answer:
      "Black tie — think sophisticated and polished. Midnight, gold, burgundy, and champagne tones. This is the most formal event of the celebration.",
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
      "Absolutely! Children are welcome at all events. The Sundowner Carnival will have a dedicated kids' zone with activities and snacks.",
    category: "general",
  },
  {
    id: "food",
    question: "Will there be vegetarian / dietary options?",
    answer:
      "Yes! All events will offer a wide variety of vegetarian, vegan, and non-vegetarian options. Please mention any specific dietary requirements or allergies in the RSVP form.",
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
