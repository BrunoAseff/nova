/** Citações em domínio público. Uma por dia; a curadoria definitiva vem depois. */
export const quotes = [
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { text: "Rest is not idleness.", author: "John Lubbock" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  {
    text: "Do one thing at a time, and while doing it put your whole soul into it.",
    author: "Swami Vivekananda",
  },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  {
    text: "Look deep into nature, and then you will understand everything better.",
    author: "Albert Einstein",
  },
] as const;

export function quoteOfTheDay(date = new Date()) {
  const day = Math.floor(date.getTime() / 86_400_000);
  return quotes[day % quotes.length] ?? quotes[0];
}
