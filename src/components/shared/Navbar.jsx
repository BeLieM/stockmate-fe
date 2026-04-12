"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import NotificationModal from "./NotificationModal";

export default function Navbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split('/')[1];

    if (!path || path === "home") return "Dashboard";
    if (path === "rules") return "Stock Rules";
    if (path === "account") return "Account Settings";

    return path.replace(/-/g, ' ');
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-20 bg-white dark:bg-[#0A0A0A] border-b border-zinc-200 dark:border-zinc-800 px-8 flex items-center justify-between shrink-0 transition-colors duration-200">
      <div>
        <h1 className="text-zinc-900 dark:text-white text-xl font-bold capitalize transition-colors duration-200">
          {getPageTitle()}
        </h1>
        <p suppressHydrationWarning className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 transition-colors duration-200">
          {currentDate}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationModal />
      </div>
    </header>
  );
}