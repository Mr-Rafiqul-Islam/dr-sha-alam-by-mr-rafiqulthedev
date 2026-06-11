import type { SuccessStory } from "@prisma/client";

export function toPublicSuccessStoryCard(s: SuccessStory) {
  return {
    id: s.id,
    sortOrder: s.sortOrder,
    patientName: s.patientName,
    patientReview: s.patientReview,
    age: s.age,
    rating: s.rating,
    problems: s.problems,
    treatments: s.treatments,
    result: s.result,
    imageUrl: s.imageUrl,
    imagePublicId: s.imagePublicId,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}
