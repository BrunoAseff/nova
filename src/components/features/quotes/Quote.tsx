import React, { useState, useEffect } from "react";
import { quotes } from "./quotes";
import type { Quote } from "./quotes";
import type { QuoteProps } from "@/types";

export default function Quote(props: QuoteProps) {
  const { position, isHidden = false } = props;
  const [currentQuote, setCurrentQuote] = useState<Quote>(
    quotes[0] ?? { text: "", author: "" },
  );

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)] ?? {
      text: "",
      author: "",
    };
    setCurrentQuote(randomQuote);
  }, []);

  const positionClass = (): string => {
    switch (position) {
      case "top-left":
        return "top-0 left-0 m-20 text-left";
      case "top-right":
        return "top-0 right-0 m-20 text-right";
      case "bottom-left":
        return "bottom-0 left-0 m-20 text-left";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center";
      default:
        return "";
    }
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`fixed w-fit rounded-2xl p-4 font-montserrat backdrop-blur-sm backdrop-brightness-75 ${positionClass()} max-w-md`}
    >
      <p className="text-xl font-medium text-secondary-foreground">
        &ldquo;{currentQuote.text}&rdquo;
      </p>
      <p className="mt-2 text-sm text-secondary-foreground">
        - {currentQuote.author}
      </p>
    </div>
  );
}
