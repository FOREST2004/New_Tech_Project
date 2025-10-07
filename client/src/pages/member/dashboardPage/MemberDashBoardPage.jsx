import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../../../components/member/dashboard/DashboardLayout"; 

function MemberDashboardPage(){
  const token = localStorage.getItem("token");

   if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default MemberDashboardPage;
