export const reminderTypes = [
  "gratitude",
  "motivation",
  "affirmation",
  "challenge",
  "dream",
  "mindset",
] as const;

export type ReminderType = (typeof reminderTypes)[number];
