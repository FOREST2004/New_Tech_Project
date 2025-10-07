import React, { useEffect, useState } from "react";
import ProfileView from "../../../components/common/profile/ProfileView";
import ProfileForm from "../../../components/common/profile/ProfileForm";
import * as Toast from "@radix-ui/react-toast";

const ProfilePage = ({ 
  getProfileService, 
  updateProfileService, 
  showErrorAlert, 
  userType = "member" 
}) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ open: true, message: "You must login first", type: "error" });
      setTimeout(() => (window.location.href = "/login"), 1000);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfileService();
        setProfile(data);
      } catch (err) {
        showErrorAlert(err);
      }
    };
    fetchProfile();
  }, [getProfileService, showErrorAlert]);

  const handleSave = async (updatedProfile) => {
    try {
      let profileData = {
        fullName: updatedProfile.fullName,
        phoneNumber: updatedProfile.phoneNumber,
      };

      if (updatedProfile.avatar && updatedProfile.avatar instanceof File) {
        profileData.avatarUrl = updatedProfile.avatar.name;
      }

      const data = await updateProfileService(profileData);
      setProfile(data);
      setIsEditing(false);
      setToast({
        open: true,
        message: "Profile updated successfully!",
        type: "success",
      });

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      window.location.reload();
    } catch (err) {
      showErrorAlert(err);
    }
  };

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader rounded-full border-4 border-blue-300 border-t-blue-600 w-16 h-16 animate-spin"></div>
      </div>
    );

  return (
    <div className=" 
                flex items-start justify-center py-8
                  bg-gradient-to-br from-primary-500 via-white to-accent-300 
                  dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
                  justify-center duration-300
    ">
      <div className="w-full max-w-3xl card p-6">
        {!isEditing ? (
          <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
        ) : (
          <ProfileForm
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        )}
      </div>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast({ ...toast, open })}
          className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-md border animate-fade-in ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-800 dark:text-green-100 dark:border-green-700"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-800 dark:text-red-100 dark:border-red-700"
          }`}
        >
          <Toast.Title className="font-bold">{toast.message}</Toast.Title>
          <Toast.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer">
            ✕
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
};

export default ProfilePage;