-- PatientReview: Mux-only video (drop EMBED/DIRECT)

CREATE TYPE "MuxVideoStatus" AS ENUM ('PROCESSING', 'READY', 'ERROR');

ALTER TABLE "PatientReview" RENAME COLUMN "muxAssetId" TO "mediaAssetId";

ALTER TABLE "PatientReview" DROP COLUMN IF EXISTS "videoType";
ALTER TABLE "PatientReview" DROP COLUMN IF EXISTS "embedPayload";
ALTER TABLE "PatientReview" DROP COLUMN IF EXISTS "directVideoUrl";

ALTER TABLE "PatientReview" ADD COLUMN "muxVideoStatus" "MuxVideoStatus";
ALTER TABLE "PatientReview" ADD COLUMN "videoDurationSeconds" DOUBLE PRECISION;

ALTER TABLE "PatientReview" ALTER COLUMN "muxPlaybackPolicy" SET DEFAULT 'public';

DROP TYPE IF EXISTS "PatientReviewVideoType";
