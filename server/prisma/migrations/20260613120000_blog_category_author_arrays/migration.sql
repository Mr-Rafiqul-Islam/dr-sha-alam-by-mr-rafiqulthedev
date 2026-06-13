-- Convert Blog.category and Blog.author from scalar strings to string arrays.

DROP INDEX IF EXISTS "Blog_category_idx";

ALTER TABLE "Blog"
  ALTER COLUMN "category" DROP DEFAULT,
  ALTER COLUMN "author" DROP DEFAULT;

ALTER TABLE "Blog"
  ALTER COLUMN "category" TYPE TEXT[] USING (
    CASE
      WHEN "category" IS NULL OR TRIM("category") = '' THEN ARRAY[]::TEXT[]
      ELSE ARRAY[TRIM("category")]
    END
  ),
  ALTER COLUMN "author" TYPE TEXT[] USING (
    CASE
      WHEN "author" IS NULL OR TRIM("author") = '' THEN ARRAY[]::TEXT[]
      ELSE ARRAY[TRIM("author")]
    END
  );

ALTER TABLE "Blog"
  ALTER COLUMN "category" SET DEFAULT ARRAY[]::TEXT[],
  ALTER COLUMN "author" SET DEFAULT ARRAY[]::TEXT[];
