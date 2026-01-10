export type PostType = "A_LA_UNE" | "INFO" | "ABSENCE" | "EVENT";

export type Post = {
  id: string;
  title: string;
  description?: string;
  type: PostType;
  lastEditedAt?: Date;

  // Affichage sur une date (jour J) ou sur une période
  startAt: Date;
  endAt?: Date;

  authorName: string;
  authorEmail: string;
  createdAt: Date;
};
