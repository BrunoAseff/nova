type Quote = {
  text: string;
  author: string;
  category: "Fact" | "Success" | "Motivational" | "Gratitude" | "Self Care";
};

export const quotes: Quote[] = [
  // Existing Quotes with Category Labels
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Success",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Motivational",
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "Motivational",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Motivational",
  },

  // New Quotes

  // Fact
  {
    text: "The greatest discovery of my generation is that a human being can alter his life by altering his attitudes.",
    author: "William James",
    category: "Fact",
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Fact",
  },
  {
    text: "You don’t have to control your thoughts; you just have to stop letting them control you.",
    author: "Dan Millman",
    category: "Fact",
  },
  {
    text: "It always seems impossible until it’s done.",
    author: "Nelson Mandela",
    category: "Fact",
  },
  {
    text: "Your life does not get better by chance; it gets better by change.",
    author: "Jim Rohn",
    category: "Fact",
  },

  // Success
  {
    text: "Success is not how high you have climbed, but how you make a positive difference to the world.",
    author: "Roy T. Bennett",
    category: "Success",
  },
  {
    text: "The secret of success is to do the common things uncommonly well.",
    author: "John D. Rockefeller",
    category: "Success",
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "Success",
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "Success",
  },
  {
    text: "Don’t watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Success",
  },

  // Motivational
  {
    text: "Don’t let yesterday take up too much of today.",
    author: "Will Rogers",
    category: "Motivational",
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "Motivational",
  },
  {
    text: "If you can dream it, you can do it.",
    author: "Walt Disney",
    category: "Motivational",
  },
  {
    text: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    author: "Christian D. Larson",
    category: "Motivational",
  },
  {
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "Motivational",
  },

  // Gratitude
  {
    text: "Gratitude is not only the greatest of virtues but the parent of all others.",
    author: "Cicero",
    category: "Gratitude",
  },
  {
    text: "Gratitude turns what we have into enough.",
    author: "Aesop",
    category: "Gratitude",
  },
  {
    text: "The roots of all goodness lie in the soil of appreciation for goodness.",
    author: "Dalai Lama",
    category: "Gratitude",
  },
  {
    text: "Enjoy the little things, for one day you may look back and realize they were the big things.",
    author: "Robert Brault",
    category: "Gratitude",
  },
  {
    text: "As we express our gratitude, we must never forget that the highest appreciation is not to utter words but to live by them.",
    author: "John F. Kennedy",
    category: "Gratitude",
  },

  // Self Care
  {
    text: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
    category: "Self Care",
  },
  {
    text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
    category: "Self Care",
  },
  {
    text: "Rest and self-care are so important. When you take time to replenish your spirit, it allows you to serve others from the overflow. You cannot serve from an empty vessel.",
    author: "Eleanor Brown",
    category: "Self Care",
  },
  {
    text: "Self-care is not a luxury, it is a necessity.",
    author: "Audre Lorde",
    category: "Self Care",
  },
  {
    text: "Nurturing yourself is not selfish—it’s essential to your survival and your well-being.",
    author: "Renee Peterson Trudeau",
    category: "Self Care",
  },
];

export type { Quote };
