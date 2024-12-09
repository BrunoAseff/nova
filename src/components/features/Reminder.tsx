import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReminderProps, ReminderMessage } from "@/types";
import { Refresh } from "@/components/icons/Refresh";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { useSpacesContext } from "@/contexts/spaceContext";

export default function Reminder(props: ReminderProps) {
  const { reminderMessages } = useSpacesContext();
  const { isHidden = false, position } = props;

  const [currentMessage, setCurrentMessage] = useState<ReminderMessage | null>(
    null,
  );

  const positionClass = (): string => {
    switch (position) {
      case "top-left":
        return "top-0 left-0 m-10 text-left";
      case "top-right":
        return "top-0 right-0 m-10 text-right";
      case "bottom-left":
        return "bottom-0 left-0 m-10 text-left";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center";
      default:
        return "";
    }
  };

  const messageTypeClass = (message: ReminderMessage): string => {
    if (!message) return "";
    switch (message.type) {
      case "Gratitude":
        return "bg-yellow-500/10 border-yellow-500/50   text-yellow-100 border-[1px]";
      case "Motivation":
        return "bg-purple-500/10 border-purple-500/50  text-purple-100 border-[1px]";
      case "Affirmation":
        return "bg-green-500/10 border-green-500/50  text-green-100 border-[1px]";
      case "Challenge":
        return "bg-red-500/10 border-red-500/50  text-red-100 border-[1px]";
      case "Dream":
        return "bg-orange-500/10 border-orange-500/50  text-orange-100 border-[1px]";
      case "Mindset":
        return "bg-white/10  border-white/50 text-white/80 border-[1px]";
      default:
        return "";
    }
  };

  const getRandomMessage = useCallback((): ReminderMessage | null => {
    if (reminderMessages.length === 0) return null;
    return (
      reminderMessages[Math.floor(Math.random() * reminderMessages.length)] ??
      null
    );
  }, [reminderMessages]);

  const refreshMessage = useCallback(() => {
    const newMessage = getRandomMessage();
    setCurrentMessage(newMessage);
  }, [getRandomMessage]);

  useEffect(() => {
    refreshMessage();
  }, [refreshMessage]);

  if (isHidden) return null;

  return (
    <div
      className={`rounded-4xl fixed w-96 p-4 font-montserrat ${positionClass()} group max-w-md`}
    >
      <AnimatePresence mode="wait">
        {currentMessage ? (
          <motion.div
            key={currentMessage.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl p-4 ${messageTypeClass(currentMessage)}`}
          >
            <p className="text-lg font-medium">{currentMessage.text}</p>
          </motion.div>
        ) : (
          <motion.div
            key="no-reminderMessages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-4"
          >
            <p className="text-lg font-medium text-secondary-foreground">
              Add reminders in the settings to stay on track!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <IconBtn
        onClick={refreshMessage}
        variant="default"
        className="absolute bottom-3 right-3 z-50 m-1 bg-transparent opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Refresh />
      </IconBtn>
    </div>
  );
}
