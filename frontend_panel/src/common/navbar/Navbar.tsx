import { useState, useRef, useEffect } from "react";
import { Search, Moon, Sun, ChevronDown, Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import user_image from "../../assets/users.png";
import Sidebar from "../sidebar/Sidebar";
import { useSearch, useTheme } from "../../custom hooks/Hooks";

function Navbar() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { globalSearch, setGlobalSearch } = useSearch();

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

  const handleSearchChange = (value: string) => {
    setGlobalSearch(value);
  };

  return (
    <>
      <header className="header sticky top-0 h-16 flex items-center justify-between px-8 max-900px:px-4 max-480px:px-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all z-20">
        {/* Left section: Logo and date range chips */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="max-900px:flex hidden items-center">
            <Link
              to="/"
              className="font-display text-xl font-semibold text-gray-900 dark:text-white"
            >
              UNICAMP
            </Link>
          </div>
        </div>

        {/* Middle section: Search bar */}
        <div className="max-900px:hidden flex items-center gap-6 flex-1 justify-center">
          <div className="relative max-w-md flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={globalSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 text-sm transition-all"
            />
          </div>
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
                      to="/"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
                          isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`
                      }
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/courses"
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
                          isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                        }`
                      }
                    >
                      Courses
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            {/* Mobile: Show menu icon instead of settings */}
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
        <div
          className="max-900px:h-[100vh] fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}
      {mobileSidebarOpen && (
        <div
          className={`fixed lg:hidden z-40 transition-transform duration-500 ease-in-out ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ left: 0, top: 0 }}
        >
          <Sidebar onClose={() => setMobileSidebarOpen(false)} mobileVersion />
        </div>
      )}
    </>
  );
}

export default Navbar;
