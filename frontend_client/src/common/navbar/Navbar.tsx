import { useState, useRef, useEffect } from "react";
import {
  Moon,
  Sun,
  ChevronDown,
  Menu,
  Home,
  BookOpen,
  Calendar,
  Award,
} from "lucide-react";
import { Link, NavLink, } from "react-router-dom";

import user_image from "../../assets/users.png";
import Sidebar from "../sidebar/Sidebar";
import { useTheme } from "../../custom hooks/Hooks";

function Navbar() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: Award, label: "Grades", path: "/grades" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
  ];

  return (
    <>
      <header className="header sticky top-0 h-16 flex items-center justify-between px-8 max-900px:px-4 max-480px:px-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all z-20">
        {/* Left section: Logo and navigation links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl font-semibold text-gray-900 dark:text-white"
          >
            UNICAMP
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="max-900px:hidden flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white ${
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right section: Theme toggle, profile, and mobile menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <img
              src={user_image}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />

            <div
              className="hidden lg:flex items-center gap-2 relative"
              ref={profileRef}
            >
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Tunji Akande
                </p>
                <ChevronDown
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-1.5 mt-7 w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                  <div className="p-2">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
                          isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`
                      }
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
                          isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`
                      }
                    >
                      Settings
                    </NavLink>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Mobile: Show menu icon */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 max-900px:block hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar/Drawer */}
      {mobileSidebarOpen && (
        <Sidebar onClose={() => setMobileSidebarOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
