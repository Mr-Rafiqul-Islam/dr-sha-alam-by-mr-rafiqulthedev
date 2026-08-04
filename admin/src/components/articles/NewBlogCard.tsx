import { useNavigate } from "react-router";
import { Icon } from "../common";

export function NewBlogCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/articles/new")}
      className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-low p-6 text-center transition-colors hover:border-secondary hover:bg-secondary/5"
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
        <Icon name="add" size={32} />
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface">
        New Blog
      </h3>
      <p className="mt-2 max-w-[220px] text-body-md text-on-surface-variant">
        Start drafting a new educational piece for your patient portal.
      </p>
    </button>
  );
}
