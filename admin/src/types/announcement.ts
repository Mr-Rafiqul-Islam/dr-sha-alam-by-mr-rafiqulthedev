export type AnnouncementType = "INFO" | "WARNING" | "URGENT";
export type AnnouncementStatus = "ACTIVE" | "INACTIVE";

export type AnnouncementCreatedBy = {
  id: string;
  name: string | null;
  email: string | null;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  readAt: string | null;
  createdBy: AnnouncementCreatedBy | null;
};

export type AnnouncementFilterState = {
  type: AnnouncementType | "";
  status: AnnouncementStatus | "";
};

export type CreateAnnouncementPayload = {
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
};

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>;

export type AnnouncementFormValues = {
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
};
