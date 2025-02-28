import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PuzzlePiece,
  FlowerLotus,
  Clover,
  HandHeart,
  ShootingStar,
  Brain,
} from "@phosphor-icons/react";

type ReminderType = keyof typeof typeStyles;

const typeStyles = {
  Gratitude: {
    icon: FlowerLotus,
    color: "#F5A524",
  },
  Motivation: {
    icon: Clover,
    color: "#10b981",
  },
  Affirmation: {
    icon: HandHeart,
    color: "#ec4899",
  },
  Challenge: {
    icon: PuzzlePiece,
    color: "#F31260",
  },
  Dream: {
    icon: ShootingStar,
    color: "#14b8a6",
  },
  Mindset: {
    icon: Brain,
    color: "#E4E4E7",
  },
} as const;

export const RemindersCard = () => {
  const [reminderText, setReminderText] = useState("");
  const [selectedType, setSelectedType] = useState<ReminderType>("Gratitude");

  const reminderPlaceholders: Record<ReminderType, string> = {
    Gratitude:
      "\"I'm grateful for my family's unwavering support through everything.\"",
    Motivation:
      '"I will become a successful entrepreneur and make a positive impact."',
    Affirmation:
      '"I am capable of learning and growing beyond my current limitations."',
    Challenge:
      '"I will overcome my fear of public speaking and become a confident communicator."',
    Dream:
      '"My dream is to travel to all continents and experience diverse cultures."',
    Mindset:
      '"I choose to see obstacles as opportunities for growth and learning."',
  };

  const types = Object.keys(typeStyles) as ReminderType[];

  const ReminderPreview = () => {
    const { icon: Icon, color } = typeStyles[selectedType];

    return (
      <div
        className="relative flex-col gap-4 rounded-3xl border-[1px] bg-[#0c0e12] p-3 text-[#d0dbe3] md:p-4"
        style={{
          borderColor: `${color}80`,
        }}
      >
        <div className="mb-1 flex items-center gap-1">
          <Icon size={20} color={color} weight="duotone" />
          <p className="text-xs font-semibold" style={{ color }}>
            {selectedType}
          </p>
        </div>
        <p className="text-sm md:text-base">
          {reminderText || reminderPlaceholders[selectedType]}
        </p>
      </div>
    );
  };

  return (
    <div className="flex max-w-full flex-col gap-8">
      <div className="mx-auto max-w-full">
        <ReminderPreview />
      </div>

      <div className="space-y-4 rounded-2xl border-[1px] border-accent/60 bg-accent-foreground p-4">
        <RadioGroup
          className="grid grid-cols-3 gap-2 md:flex"
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as ReminderType)}
        >
          {types.map((type) => (
            <label
              key={type}
              className="w-fit cursor-pointer items-center justify-center rounded-2xl border-[1px] border-accent/60 p-2 text-xs text-muted-foreground transition-all duration-300 hover:border-muted-foreground hover:bg-accent/60 hover:text-foreground has-[[data-state=checked]]:border-secondary has-[[data-state=checked]]:bg-secondary-smooth-700/10 has-[[data-state=checked]]:text-secondary"
            >
              <RadioGroupItem
                value={type}
                className="sr-only after:absolute after:inset-0"
              />
              <p className="font-medium leading-none">{type}</p>
            </label>
          ))}
        </RadioGroup>

        <div className="flex w-full justify-between">
          <Textarea
            maxLength={140}
            placeholder={reminderPlaceholders[selectedType]}
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            className="md:text-md mt-2 w-full text-sm"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default RemindersCard;
