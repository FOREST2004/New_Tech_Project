import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { profileService } from "../../../services/common/profile/profileService";
import { getMemberStats } from "../../../services/member/stats/statsService";
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
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiPlay
} from "react-icons/fi";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState({ fullName: "", avatarUrl: "" });
  const [notifications, setNotifications] = useState(2);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    ready: 0,
    ongoing: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (currentUser.fullName && currentUser.role === "MEMBER") {
          setUser({
            fullName: currentUser.fullName || "",
            avatarUrl: currentUser.avatarUrl ? `/images/${currentUser.avatarUrl}` : "",
          });
        } else {
          const response = await profileService.getProfile();
          if (response) {
            const profileData = response;
            setUser({
              fullName: profileData.fullName || "",
              avatarUrl: profileData.avatarUrl ? `/images/${profileData.avatarUrl}` : "",
            });
            
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }
        }
        
      } catch (err) {
        console.error("Error loading user profile:", err);
        setUser({
          fullName: "Guest",
          avatarUrl: "",
        });
      }
    };

    const loadMemberStats = async () => {
      try {
        const memberStats = await getMemberStats();
        setStats(memberStats);
      } catch (err) {
        console.error("Error loading member stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
    loadMemberStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const isMemberHome = location.pathname === "/member" || location.pathname === "/member/";

  const memberStats = [
    { 
      label: "Registrations", 
      value: loading ? "..." : stats.totalRegistrations.toString(), 
      icon: FiCheckCircle, 
      color: "accent" 
    },
    { 
      label: "Ready", 
      value: loading ? "..." : stats.ready.toString(), 
      icon: FiClock, 
      color: "warning" 
    },
    { 
      label: "Ongoing", 
      value: loading ? "..." : stats.ongoing.toString(), 
      icon: FiPlay, 
      color: "primary" 
    },
    { 
      label: "Completed", 
      value: loading ? "..." : stats.completed.toString(), 
      icon: FiActivity, 
      color: "success" 
    },
  ];

  return (
    <div className="flex h-screen
                  bg-gradient-to-br from-accent-100 via-yellow-200 to-gray-200
                  dark:from-dark-gray-800 dark:via-red-800 dark:to-accent-800
                ">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between px-6 shadow-soft">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-display font-bold text-secondary-900 dark:text-secondary-100">
              Member Dashboard
            </h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
              <span>•</span>
              <span>Welcome back, {user.fullName ? user.fullName.split(" ")[0] : "Member"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle variant="simple" size="default" />
            
            <button className="relative p-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-200 group">
              <FiBell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-danger-500 rounded-full min-w-[20px] h-5">
                  {notifications}
                </span>
              )}
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-3 cursor-pointer p-2 hover:bg-secondary-50 rounded-xl transition-all duration-200 group">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-xl object-cover border-2 border-secondary-200 group-hover:border-accent-300 transition-colors"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center text-white font-bold shadow-glow">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-secondary-900">
                    {user.fullName || "Member"}
                  </p>
                  <p className="text-xs text-secondary-500">Community Member</p>
                </div>
                <FiChevronDown className="w-4 h-4 text-secondary-400 group-hover:text-secondary-600" />
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="bg-white rounded-2xl shadow-large border border-secondary-200 py-2 w-56 animate-fade-in z-50">
                <DropdownMenu.Item asChild>
                  <Link 
                    to="/member/profile/update" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 text-secondary-700 transition-colors "
                  >
                    <FiUser className="w-4 h-4" />
                    Profile Settings
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link 
                    to="/member/profile/change-password" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 text-secondary-700 transition-colors"
                  >
                    <FiSettings className="w-4 h-4" />
                    Change Password
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-2 border-secondary-100" />
                <DropdownMenu.Item
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-danger-50 text-danger-600 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </header>

        {isMemberHome && (
          <section className="p-6 animate-fade-in">
            <div className="card relative z-0 p-8 mb-8 bg-gradient-to-r from-accent-600 to-accent-700 text-white">
              <div className="flex items enter justify-between">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">
                    Welcome Back, {user.fullName ? user.fullName.split(" ")[0] : "Member"}! 🎉
                  </h2>
                  <p className="text-accent-100 text-lg">
                    Stay updated with your upcoming events and activities.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FiUsers className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {memberStats.map((stat, index) => {
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
