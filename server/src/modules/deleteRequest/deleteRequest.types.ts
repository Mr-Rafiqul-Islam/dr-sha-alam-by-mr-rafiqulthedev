import { UserRole, type DeleteRequest, type User } from "@prisma/client";

export const DELETE_APPROVAL_ROLES = new Set<UserRole>([
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
]);

export function canDeleteImmediately(role: UserRole): boolean {
  return DELETE_APPROVAL_ROLES.has(role);
}

export type DeleteRequestWithRelations = DeleteRequest & {
  requestedBy: Pick<User, "id" | "name" | "email" | "role">;
  reviewedBy: Pick<User, "id" | "name" | "email" | "role"> | null;
};

export type DeleteRequestListItem = {
  id: string;
  entityType: DeleteRequest["entityType"];
  entityId: string;
  status: DeleteRequest["status"];
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

export class DeleteRequestError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "DeleteRequestError";
  }
}
