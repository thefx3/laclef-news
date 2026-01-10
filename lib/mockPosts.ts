import type { Post, PostType } from "./types";

// Générateur pseudo-aléatoire déterministe pour garder des données stables
function createPRNG(seed = 42) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) % 0xffffffff;
    return state / 0xffffffff;
  };
}

function randomInt(rand: () => number, min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const typeCycle: PostType[] = ["A_LA_UNE", "INFO", "ABSENCE", "EVENT"];
const authorCycle = ["PL", "ZA", "Admin", "CG", "JD", "MB", "LM", "AN"];

function makeTitle(type: PostType, index: number) {
  const base = {
    A_LA_UNE: "À la une",
    INFO: "Info",
    ABSENCE: "Absence",
    EVENT: "Évènement",
  }[type];
  return `${base} #${index + 1}`;
}

function buildMockPosts(count = 50): Post[] {
  const rand = createPRNG(12345);
  const now = new Date();
  const posts: Post[] = [];

  for (let i = 0; i < count; i++) {
    const type = typeCycle[i % typeCycle.length];
    const authorName = authorCycle[i % authorCycle.length];

    // Répartir les dates entre -15 et +30 jours
    const startOffset = randomInt(rand, -15, 30);
    const startAt = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + startOffset
    );

    // Pour certains types (A_LA_UNE, EVENT), on étale sur quelques jours
    const hasRange = type === "A_LA_UNE" || type === "EVENT";
    const rangeDays = hasRange ? randomInt(rand, 0, 6) : 0;
    const endAt =
      rangeDays > 0
        ? new Date(
            startAt.getFullYear(),
            startAt.getMonth(),
            startAt.getDate() + rangeDays
          )
        : undefined;

    posts.push({
      id: `p${i + 1}`,
      title: makeTitle(type, i),
      type,
      startAt,
      endAt,
      authorName,
      createdAt: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + randomInt(rand, -20, 0)
      ),
      lastEditedAt: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + randomInt(rand, -10, 5)
      ),
    });
  }

  return posts;
}

export const mockPosts: Post[] = buildMockPosts(50);
