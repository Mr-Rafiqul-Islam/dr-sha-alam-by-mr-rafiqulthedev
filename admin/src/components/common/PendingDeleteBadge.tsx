import { Badge } from "./Badge";
import { Icon } from "./Icon";

export function PendingDeleteBadge() {
  return (
    <Badge variant="cancel" className="gap-1">
      <Icon name="delete" size={14} />
      Pending delete
    </Badge>
  );
}
