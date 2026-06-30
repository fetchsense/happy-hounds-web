// Pure constants — no server imports — safe to use in Client Components.

export type ServiceType =
  | "daycare"
  | "play_am"
  | "play_pm"
  | "training"
  | "enrichment";

export const SERVICE_LABELS: Record<ServiceType, string> = {
  daycare: "Full Day Daycare",
  play_am: "Morning Play Session",
  play_pm: "Afternoon Play Session",
  training: "Training Session (1 hr)",
  enrichment: "Enrichment Session",
};

export const SERVICE_TIMES: Record<ServiceType, string> = {
  daycare: "8:00am – 6:00pm",
  play_am: "8:00am – 12:00pm",
  play_pm: "1:00pm – 5:00pm",
  training: "1 hour",
  enrichment: "1 hour",
};

export const SERVICE_PRICES_PENCE: Record<ServiceType, number> = {
  daycare: 2500,
  play_am: 1500,
  play_pm: 1500,
  training: 3000,
  enrichment: 1500,
};

export const SERVICE_ORDER: ServiceType[] = [
  "daycare",
  "play_am",
  "play_pm",
  "training",
  "enrichment",
];

export const SERVICE_DESCRIPTIONS: Record<ServiceType, string> = {
  daycare:
    "Drop off in the morning, collect in the evening. Enrichment included.",
  play_am:
    "Morning supervised group play. Great as a taster or for dogs that don't need a full day.",
  play_pm:
    "Afternoon supervised group play. Same as the morning session, just later in the day.",
  training:
    "One-to-one positive reinforcement coaching in our calm indoor space.",
  enrichment:
    "Scent work, puzzles, and sensory activities for a tired, happy mind.",
};
