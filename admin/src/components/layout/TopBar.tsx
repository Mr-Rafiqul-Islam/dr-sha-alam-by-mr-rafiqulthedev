import { Button, Icon } from "../common";
import { useSidebar } from "../../contexts/SidebarContext";
import logo from "../../../public/favicon.svg";

export function TopBar() {
  const { isCollapsed, openMobile, toggleCollapsed } = useSidebar();

  return (
    <header className="flex justify-between items-center gap-4 px-4 md:px-6 lg:px-10 h-16 lg:h-20 w-full bg-surface-container-low sticky top-0 z-10">
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="icon"
          className="lg:hidden"
          onClick={openMobile}
          aria-label="Open menu"
        >
          <Icon name="menu" />
        </Button>

        <Button
          variant="icon"
          className="hidden lg:inline-flex text-primary/70 hover:text-primary"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            name={isCollapsed ? "chevron_right" : "chevron_left"}
            size={20}
          />
        </Button>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* <Button variant="icon" aria-label="Notifications">
          <Icon name="notifications" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
        </Button> */}
        <img src={logo} alt="Dr. Shah Alam" className="w-8 h-8 object-contain" />
      </div>
    </header>
  );
}
