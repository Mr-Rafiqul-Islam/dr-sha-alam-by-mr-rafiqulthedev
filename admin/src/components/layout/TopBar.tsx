import { Button, Icon } from "../common";
import { AnnouncementNotificationPanel } from "../announcements/AnnouncementNotificationPanel";
import { AnnouncementTicker } from "../announcements/AnnouncementTicker";
import { useSidebar } from "../../contexts/SidebarContext";
import { useGetActiveAnnouncementsQuery } from "../../store/api/announcementsApi";
import logo from "/logo-fav.png";

export function TopBar() {
  const { isCollapsed, openMobile, toggleCollapsed } = useSidebar();
  const { data: activeAnnouncements = [] } = useGetActiveAnnouncementsQuery();

  return (
    <header className="flex justify-between items-center gap-4 px-4 md:px-6 lg:px-10 h-16 lg:h-20 w-full bg-surface-container-low sticky top-0 z-10">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="icon"
          className="lg:hidden shrink-0"
          onClick={openMobile}
          aria-label="Open menu"
        >
          <Icon name="menu" />
        </Button>

        <Button
          variant="icon"
          className="hidden lg:inline-flex shrink-0 text-primary/70 hover:text-primary"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            name={isCollapsed ? "chevron_right" : "chevron_left"}
            size={20}
          />
        </Button>

      </div>

      <div className="flex min-w-0 items-center gap-4 shrink-0">
        <AnnouncementTicker
          announcements={activeAnnouncements}
          className="hidden md:flex"
        />
        <AnnouncementNotificationPanel />
        <img src={logo} alt="Dr. Shah Alam" className="w-12 h-12 object-contain" />
      </div>
    </header>
  );
}
