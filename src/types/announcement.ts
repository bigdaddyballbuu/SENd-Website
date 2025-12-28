export type AnnouncementType = "promo" | "notice" | "system";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: AnnouncementType;
  store: string | null;
  image_url: string | null;
  pinned: boolean;
  created_at: string;
}
