import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refresh } from "@/components/icons/Refresh";
import IconBtn from "@/components/nova/buttons/IconBtn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { quotes, type Quote } from "@/components/features/quotes/quotes";
import Image from "next/image";

export const QuoteCard = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(
    quotes[Math.floor(Math.random() * quotes.length)] ?? {
      text: "",
      author: "",
      category: "Motivational",
    },
  );

  const refreshQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)] ?? {
      text: "",
      author: "",
      category: "Motivational",
    };
    setCurrentQuote(newQuote);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border-[1px] border-accent/20 bg-accent-foreground p-4 font-montserrat md:max-w-md">
      <Image
        src="/quoteCard.png"
        alt="Quote background"
        fill
        className="object-cover brightness-[0.7]"
        priority
      />
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2 text-left"
          >
            <p className="text-sm font-medium text-gray-100 md:text-xl">
              &ldquo;{currentQuote.text}&rdquo;
            </p>
            <p className="text-xs text-gray-100 md:text-sm">
              - {currentQuote.author}
            </p>
          </motion.div>
        </AnimatePresence>

        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <IconBtn
                onClick={refreshQuote}
                variant="default"
                className="absolute bottom-2 right-2 border-[1px] border-transparent bg-transparent text-foreground opacity-0 transition-opacity hover:border-white/60 hover:bg-white/5 group-hover:opacity-100"
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
    </div>
  );
};

export default QuoteCard;
