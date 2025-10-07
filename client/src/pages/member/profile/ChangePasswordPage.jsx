import React from "react";
import ChangePasswordForm from "../../../components/common/profile/ChangePasswordForm";
import { profileService } from "../../../services/common/profile/profileService";

const ChangePasswordPage = () => {
  return (
    <ChangePasswordForm
      updatePasswordService={profileService.updatePassword}
      userType="member"
    />
  );
};

export default ChangePasswordPage;
