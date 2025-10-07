import React from "react";
import ProfilePage from "../../common/profile/ProfilePage";
import {
  profileService
} from "../../../services/common/profile/profileService";
import { showErrorAlert } from "../../../utils/errorHandler";

const MemberProfilePage = () => {
  return (
    <ProfilePage
      getProfileService={profileService.getProfile}
      updateProfileService={profileService.updateProfile}
      showErrorAlert={showErrorAlert}
      userType="member"
    />
  );
};

export default MemberProfilePage;
