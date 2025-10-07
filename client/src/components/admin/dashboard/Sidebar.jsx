// src/components/admin/Dashboard/Sidebar.jsx
import * as Accordion from "@radix-ui/react-accordion";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FiUser,
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiBell,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";
import NotificationBadge from "../../common/notifications/NotificationBadge.jsx";

const menuItems = [
  {
    name: "Events Management",
    icon: FiCalendar,
    links: [
      { name: "Event List", path: "/admin/events/list" },
      { name: "Attendance", path: "/admin/events/attendance" },
    ],
  },
  {
    name: "Members Management",
    icon: FiUsers,
    links: [{ name: "Member List", path: "/admin/members/list" }],
  },
  {
    name: "Events Registration",
    icon: FiClipboard,
    links: [
      { name: "Upcoming Event", path: "/admin/upcoming-event" },
      { name: "My Event", path: "/admin/my-event" },
    ],
  },
  {
    name: "Notifications",
    icon: FiBell,
    links: [
      { name: "View Notifications", path: "/admin/notifications" },
      {
        name: "Send Notification",
        path: "/admin/notifications/send",
        badge: 3,
      },
    ],
    showBadge: true,
  },
];

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openItems, setOpenItems] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    
    // Nếu đang ở trang dashboard, refresh data
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      if (window.refreshAdminDashboard) {
        window.refreshAdminDashboard();
      }
    } else {
      // Nếu không ở trang dashboard, navigate về dashboard
      window.location.href = "/admin";
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleItem = (itemName) => {
    setOpenItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      } bg-gray-200 dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 shadow-large`}
    >
      <div className="flex items-center justify-between p-6 border-b border-secondary-100 dark:border-secondary-700">
        <Link
          to="/admin"
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <FiCalendar className="w-6 h-6 text-black dark:text-white " />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-display font-bold text-secondary-900 dark:text-secondary-100">
                NEXPANDO
              </h1>
              <p className="text-xs text-secondary-7600 dark:text-secondary-200">
                Event Management
              </p>
            </div>
          )}
        </Link>
        <button
          className="p-2 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-all duration-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <FiMenu className="w-5 h-5" />
          ) : (
            <FiX className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isOpen = openItems.includes(item.name);
          const hasActiveChild = item.links.some((link) => isActive(link.path));

          return (
            <div key={item.name} className="space-y-1">
              <button
                onClick={() => toggleItem(item.name)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  hasActiveChild
                    ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        hasActiveChild
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-300"
                      }`}
                    />
                    {item.showBadge && (
                      <NotificationBadge className="absolute -top-2 -right-2" />
                    )}
                  </div>
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </div>
                {!collapsed && (
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {isOpen && !collapsed && (
                <div className="ml-8 space-y-1 animate-fade-in">
                  {item.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive(link.path)
                          ? "bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 font-medium"
                          : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-200"
                      }`}
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-secondary-100 dark:border-secondary-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
