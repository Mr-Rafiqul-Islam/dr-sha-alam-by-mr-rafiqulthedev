export type DeleteRequestEntityType =
  | "BLOG"
  | "APPOINTMENT"
  | "CONTACT_MESSAGE";

export type DeleteRequestListItem = {
  id: string;
  entityType: DeleteRequestEntityType;
  entityId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  requestedBy: {
    id: string;
    name: string | null;
    email: string | null;
  };
  entitySummary: {
    title: string;
    subtitle?: string | null;
  };
};

export type DeleteRequestListResponse = {
  success: boolean;
  data: DeleteRequestListItem[];
};

export type DeleteRequestActionResponse = {
  success: boolean;
  message: string;
};

export type DeleteMutationResponse = {
  success: boolean;
  message: string;
  pending?: boolean;
};
