export const reminderTypes = [
  "gratitude",
  "motivation",
  "affirmation",
  "challenge",
  "dream",
  "mindset",
] as const;

export type ReminderType = (typeof reminderTypes)[number];

export const REMINDER_TYPE_LABEL: Record<ReminderType, string> = {
  gratitude: "Gratitude",
  motivation: "Motivation",
  affirmation: "Affirmation",
  challenge: "Challenge",
  dream: "Dream",
  mindset: "Mindset",
};
