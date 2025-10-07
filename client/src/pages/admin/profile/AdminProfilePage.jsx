import React from "react";
import ProfilePage from "../../common/profile/ProfilePage";
import {
 profileService
} from "../../../services/common/profile/profileService";
import { showErrorAlert } from "../../../utils/errorHandler";

const AdminProfilePage = () => {
  return (
    <ProfilePage
      getProfileService={profileService.getProfile}
      updateProfileService={profileService.updateProfile}
      showErrorAlert={showErrorAlert}
      userType="admin"
    />
  );
};

export default AdminProfilePage;
