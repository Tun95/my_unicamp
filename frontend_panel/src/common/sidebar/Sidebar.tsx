import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, List, X } from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
  mobileVersion?: boolean;
}

const Sidebar = ({ onClose, mobileVersion = false }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: List, label: "Courses", path: "/courses" },
  ];

  return (
    <div
      className={`max-900px:h-[100vh] fixed left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all z-10 ${
        !mobileVersion ? "max-900px:hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="font-display text-xl font-semibold text-gray-900 dark:text-white">
          UNICAMP
        </span>
        {mobileVersion && (
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={mobileVersion ? onClose : undefined} // Close drawer on mobile when clicking a link
                  className={`flex items-center gap-3 px-6 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all ${
                    isActive
                      ? "text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 border-r-2 border-gray-900 dark:border-white font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
