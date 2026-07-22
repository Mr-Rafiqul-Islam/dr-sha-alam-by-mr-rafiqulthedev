import { Badge } from "./Badge";
import { Icon } from "./Icon";

export function PendingDeleteBadge() {
  return (
    <Badge variant="cancel" className="gap-1 flex items-center w-fit text-[10px]">
      <Icon name="delete" size={12} />
      Pending 
    </Badge>
  );
}
