import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Award,
  Calendar,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import user_image from "../../assets/users.png";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: Award, label: "Grades", path: "/grades" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
  ];

  const profileItems = [
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout", isLogout: true },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-gray-700">
          <span className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            UNICAMP
          </span>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={user_image}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Tunji Akande
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Student
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <div className="px-3">
            <p className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Navigation
            </p>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all rounded-lg ${
                        isActive
                          ? "text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 font-medium"
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
          </div>

          {/* Profile Section */}
          <div className="px-3 mt-6">
            <p className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Account
            </p>
            <ul className="space-y-1">
              {profileItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all rounded-lg ${
                      item.isLogout
                        ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
