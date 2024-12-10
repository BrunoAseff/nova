import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReminderProps, ReminderMessage } from "@/types";
import { Refresh } from "@/components/icons/Refresh";
import IconBtn from "@/components/nova/buttons/IconBtn";
import { useSpacesContext } from "@/contexts/spaceContext";
import {
  PuzzlePiece,
  FlowerLotus,
  Clover,
  HandHeart,
  ShootingStar,
  Brain,
} from "@phosphor-icons/react";

const typeStyles = {
  Gratitude: {
    icon: FlowerLotus,
    color: "#F5A524",
  },
  Motivation: {
    icon: Clover,
    color: "#FF4ECD",
  },
  Affirmation: {
    icon: HandHeart,
    color: "#17C964",
  },
  Challenge: {
    icon: PuzzlePiece,
    color: "#F31260",
  },
  Dream: {
    icon: ShootingStar,
    color: "#06B7DB",
  },
  Mindset: {
    icon: Brain,
    color: "#E4E4E7",
  },
} as const;

export default function Reminder(props: ReminderProps) {
  const { reminderMessages } = useSpacesContext();
  const { isHidden = false, position } = props;

  const [filteredMessages, setFilteredMessages] = useState<ReminderMessage[]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const refreshMessage = useCallback(() => {
    if (filteredMessages.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredMessages.length);
    }
  }, [filteredMessages]);

  useEffect(() => {
    // Filter messages to exclude those with empty text
    const validMessages = reminderMessages.filter(
      (message) => message.text && message.text.trim() !== "",
    );
    setFilteredMessages(validMessages);
    setCurrentIndex(0); // Reset index when messages change
  }, [reminderMessages]);

  if (isHidden) return null;

  const currentMessage =
    filteredMessages.length > 0 ? filteredMessages[currentIndex] : null;

  const renderMessageContent = (message: ReminderMessage) => {
    const { type, text } = message;
    const { icon: Icon, color } = typeStyles[type] || {};
    return (
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex-col gap-4 rounded-3xl border-[1px] bg-background p-4`}
        style={{
          borderColor: `${color}80`, // 50% opacity
        }}
      >
        <div className="mb-1 flex items-center gap-1">
          <Icon size={20} color={color} weight="duotone" />
          <p className="text-xs font-semibold" style={{ color }}>
            {type}
          </p>
        </div>
        <p className="font-sm text-md">{text}</p>
      </motion.div>
    );
  };

  return (
    <div
      className={`rounded-4xl fixed min-w-96 p-4 font-montserrat ${positionClass()} group max-w-md`}
    >
      <AnimatePresence mode="wait">
        {currentMessage ? (
          renderMessageContent(currentMessage)
        ) : (
          <motion.div
            key="no-reminderMessages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-4"
          >
            <p className="text-md font-medium text-secondary-foreground">
              Add reminders in the settings to stay on track!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <IconBtn
        onClick={refreshMessage}
        variant="default"
        className="absolute bottom-4 right-4 z-50 m-1 rounded-full bg-background opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
      >
        <Refresh />
      </IconBtn>
    </div>
  );
}
