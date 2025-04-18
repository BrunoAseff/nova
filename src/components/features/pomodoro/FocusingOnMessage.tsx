import { useCycleStore } from "@/stores/useCycleStore";
import { useState, useRef } from "react";

export default function FocusingOnMessage() {
  const focusingOnMessage = useCycleStore((state) => state.focusingOnMessage);
  const setfocusingOnMessage = useCycleStore(
    (state) => state.setfocusingOnMessage,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [tempMessage, setTempMessage] = useState(focusingOnMessage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setIsEditing(true);
    setTempMessage(focusingOnMessage);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempMessage.trim()) {
      setfocusingOnMessage(tempMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (tempMessage.trim()) {
        setfocusingOnMessage(tempMessage);
      }
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setTempMessage(focusingOnMessage);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      maxLength={30}
      value={tempMessage}
      onChange={(e) => setTempMessage(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-fit max-w-fit bg-transparent text-foreground outline-none"
      style={{
        font: "inherit",
        fontWeight: "inherit",
        textDecoration: "inherit",
      }}
    />
  ) : (
    <strong
      onClick={handleClick}
      className="cursor-pointer text-foreground underline hover:text-secondary"
    >
      {focusingOnMessage}
    </strong>
  );
}
