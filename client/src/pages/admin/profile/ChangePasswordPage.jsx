import React from "react";
import ChangePasswordForm from "../../../components/common/profile/ChangePasswordForm";
import { profileService } from "../../../services/common/profile/profileService";

const AdminChangePasswordPage = () => {
  return (
    <ChangePasswordForm
      updatePasswordService={profileService.updatePassword}
      userType="admin"
    />
  );
};

export default AdminChangePasswordPage;
