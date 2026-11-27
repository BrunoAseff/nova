/**
 * Atmosferas: cada uma muda material, tipografia, forma e movimento, não só a cor.
 * Por enquanto só a Névoa; as outras voltam quando a base estiver no nível certo.
 */
export const atmospheres = [
  {
    id: "nevoa",
    name: "Névoa",
    description: "Frosted glass and soft light. The landscape shows through.",
  },
] as const;

export type AtmosphereId = (typeof atmospheres)[number]["id"];
export const atmosphereIds = atmospheres.map((a) => a.id) as [AtmosphereId, ...AtmosphereId[]];
export const DEFAULT_ATMOSPHERE: AtmosphereId = "nevoa";
