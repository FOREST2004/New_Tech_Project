import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { profileService } from "../../../services/common/profile/profileService";
import { statsService } from "../../../services/admin/stats/statsService";
import ThemeToggle from "../../common/ThemeToggle";
import { 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiSettings, 
  FiChevronDown,
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiActivity
} from "react-icons/fi";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [admin, setAdmin] = useState({ fullName: "", avatarUrl: "" });
  const [notifications, setNotifications] = useState(3);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadAdminProfile = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      

      if (currentUser.fullName && currentUser.role === "ADMIN") {
        setAdmin({
          fullName: currentUser.fullName || "",
          avatarUrl: currentUser.avatarUrl ? `/images/${currentUser.avatarUrl}` : "",
        });
      } else {
        const response = await profileService.getProfile();
        
        if (response) {
          const profileData = response;
          setAdmin({
            fullName: profileData.fullName || "",
            avatarUrl: profileData.avatarUrl ? `/images/${profileData.avatarUrl}` : "",
          });
        
          const updatedUser = { ...currentUser, ...profileData };
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error("Error loading admin profile:", err);
      setAdmin({
        fullName: "Admin",
        avatarUrl: "",
      });
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const statsData = await statsService.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminProfile();
    loadDashboardStats();
  }, [refreshKey]); 


  const refreshDashboard = () => {
    setRefreshKey(prev => prev + 1);
  };

 
  useEffect(() => {
    window.refreshAdminDashboard = refreshDashboard;
    return () => {
      delete window.refreshAdminDashboard;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const isDashboardHome = location.pathname === "/admin" || location.pathname === "/admin/";

  const dashboardStats = [
    { 
      label: "Total Events", 
      value: loading ? "..." : stats.totalEvents.toString(), 
      icon: FiCalendar, 
      color: "primary" 
    },
    { 
      label: "Active Members", 
      value: loading ? "..." : stats.totalMembers.toString(), 
      icon: FiUsers, 
      color: "accent" 
    },
  ];

  return (
    <div className="flex h-screen
                  bg-gradient-to-br from-accent-100 via-yellow-200 to-gray-200
                  dark:from-dark-gray-800 dark:via-red-800 dark:to-accent-800
                ">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 bg-blue-100 dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between px-6 shadow-soft">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-display font-bold text-secondary-900 dark:text-secondary-100">
              Admin Dashboard
            </h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
              <span>•</span>
              <span>Welcome back, {admin.fullName ? admin.fullName.split(" ")[0] : "Admin"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle variant="simple" size="default" />
            
            <button className="relative p-3 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-200 group">
              <FiBell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-danger-500 rounded-full min-w-[20px] h-5">
                  {notifications}
                </span>
              )}
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-3 cursor-pointer p-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-xl transition-all duration-200 group">
                {admin.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-xl object-cover border-2 border-secondary-200 dark:border-secondary-600 group-hover:border-primary-300 dark:group-hover:border-primary-500 transition-colors"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
                    {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {admin.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Administrator</p>
                </div>
                <FiChevronDown className="w-4 h-4 text-secondary-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-300" />
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="bg-white dark:bg-secondary-800 rounded-2xl shadow-large border border-secondary-200 dark:border-secondary-700 py-2 w-56 animate-fade-in z-50">
                <DropdownMenu.Item asChild>
                  <Link 
                    to="/admin/profile/update" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    Profile Settings
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link 
                    to="/admin/profile/change-password" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300 transition-colors"
                  >
                    <FiSettings className="w-4 h-4" />
                    Change Password
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-2 border-secondary-100 dark:border-secondary-600" />
                <DropdownMenu.Item
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-danger-50 dark:hover:bg-danger-900/20 text-danger-600 dark:text-danger-400 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </header>

        {isDashboardHome && (
          <section className="p-6 animate-fade-in">
            <div className="card relative z-0 p-8 mb-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">
                    Welcome Back, {admin.fullName ? admin.fullName.split(" ")[0] : "Admin"}! 👋
                  </h2>
                  <p className="text-primary-100 text-lg">
                    Manage your events and community with ease.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FiTrendingUp className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                const colorClasses = {
                  primary: { bg: '#dbeafe', text: '#2563eb', badge: '#eff6ff' },
                  accent: { bg: '#dcfce7', text: '#16a34a', badge: '#f0fdf4' },
                  warning: { bg: '#fef3c7', text: '#d97706', badge: '#fffbeb' },
                  success: { bg: '#dcfce7', text: '#16a34a', badge: '#f0fdf4' }
                };
                const colors = colorClasses[stat.color] || colorClasses.primary;
                
                return (
                  <div key={index} className="card" style={{ padding: '1.5rem', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: colors.bg, transition: 'background-color 0.3s ease' }}>
                        <Icon style={{ width: '1.5rem', height: '1.5rem', color: colors.text }} />
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.25rem' }}>{stat.value}</p>
                      <p style={{ fontSize: '0.875rem', color: '#475569' }}>{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <main className="flex-1 p-6 overflow-y-auto bg-secondary-50 dark:bg-secondary-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
