/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quotes } from "./quotes";
import type { Quote } from "./quotes";
import type { QuoteProps } from "@/types";
import { Refresh } from "@/components/icons/Refresh";
import IconBtn from "@/components/nova/buttons/IconBtn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Quote(props: QuoteProps) {
  const {
    position,
    isHidden = false,
    showAuthor = true,
    categories = ["all"],
  } = props;

  const [currentQuote, setCurrentQuote] = useState<Quote>(
    quotes[0] ?? { text: "", author: "", category: "Motivational" },
  );

  const positionClass = (): string => {
    switch (position) {
      case "top-left":
        return "top-0 left-0 m-4 md:m-10 text-left";
      case "top-right":
        return "top-0 right-0 m-4 md:m-10 text-right";
      case "bottom-left":
        return "bottom-0 left-0 max-w-[16rem] md:max-w-md mb-16 ml-4 md:m-10 text-left";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center";
      default:
        return "";
    }
  };

  const refreshButtonPositionClass = (): string => {
    return position === "top-left" || position === "bottom-left"
      ? "right-2"
      : "left-2";
  };

  const getFilteredQuotes = useCallback(() => {
    return categories.includes("all")
      ? quotes
      : quotes.filter((quote) => categories.includes(quote.category));
  }, [categories.join()]);

  const getRandomQuote = useCallback(() => {
    const filteredQuotes = getFilteredQuotes();
    return (
      filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] ?? {
        text: "",
        author: "",
        category: "Motivational",
      }
    );
  }, [getFilteredQuotes]);

  const refreshQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  useEffect(() => {
    refreshQuote();
  }, [categories.join()]);

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`fixed w-fit rounded-2xl p-4 font-montserrat ${positionClass()} group max-w-md`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium text-gray-100 md:text-xl">
            &ldquo;{currentQuote.text}&rdquo;
          </p>
          {showAuthor && (
            <p className="mt-2 text-xs text-gray-100 md:text-sm">
              - {currentQuote.author}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <IconBtn
              onClick={refreshQuote}
              variant="default"
              className={`absolute bottom-2 ${refreshButtonPositionClass()} border-[1px] border-transparent bg-transparent text-foreground opacity-0 transition-opacity hover:border-white/60 hover:bg-white/5 group-hover:opacity-100`}
            >
              <Refresh />
            </IconBtn>
          </TooltipTrigger>
          <TooltipContent
            id="refresh"
            className="font-inter flex items-center gap-3 text-xs font-medium"
          >
            Refresh quote
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
