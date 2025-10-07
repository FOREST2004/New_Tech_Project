import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import ToastNotification from "./components/common/notifications/ToastNotification.jsx";
import LoginPage from "./pages/common/login/LoginPage.jsx";

import AdminDashboardPage from "./pages/admin/dashboardPage/AdminDashboardPage.jsx";
import AdminProfilePage from "./pages/admin/profile/AdminProfilePage.jsx";
import AdminChangePasswordPage from "./pages/admin/profile/ChangePasswordPage.jsx";
import CreateEventPage from "./pages/admin/events/CreateEventPage.jsx";
import EventListPage from "./pages/admin/events/EventListPage.jsx";
import EditEventPage from "./pages/admin/events/EditEventPage.jsx";
import AttendancePage from "./pages/admin/events/AttendancePage.jsx";
import CreateMemberPage from "./pages/admin/members/CreateMemberPage.jsx";
import MemberListPage from "./pages/admin/members/MemberListPage.jsx";
import MemberDetailPage from "./components/admin/memberlist/MemberDetailPage.jsx";
import ResetPasswordPage from "./pages/admin/members/ResetPasswordPage.jsx";

import MemberDashboardPage from "./pages/member/dashboardPage/MemberDashBoardPage.jsx";  
import MemberProfilePage from "./pages/member/profile/MemberProfilePage.jsx";
import ChangePasswordPage from "./pages/member/profile/ChangePasswordPage.jsx";
import ViewMemberListPage from "./pages/member/memberList/ViewMemberListPage.jsx";

import UpcomingEventsPage from "./pages/common/event/UpcommingEventsPage.jsx";
import MyEventsPage from "./pages/common/event/MyEventsPage.jsx";
import NotificationsPage from "./pages/common/notifications/NotificationsPage.jsx";
import DesignSystemPage from "./pages/DesignSystemPage.jsx";

function App() {
  const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }

    return element;
  };

  return (
    <ThemeProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/design-system" element={<DesignSystemPage />} />

          <Route
            path="/admin/*"
            element={
               <ProtectedRoute
                element={<AdminDashboardPage />}
                allowedRoles={["admin"]}
              />
            }
          >
            <Route path="profile" element={<AdminProfilePage/>}/>
            <Route path="profile/change-password" element={<AdminChangePasswordPage/>}/>

            <Route path="events/create" element={<CreateEventPage />} />
            <Route path="events/list" element={<EventListPage />} />
            <Route path="events/attendance" element={<AttendancePage />} />
            <Route path="events/edit/:id" element = {<EditEventPage/>} />
            
            <Route path="members/create" element={<CreateMemberPage />} />
            <Route path="members/list" element={<MemberListPage />} />
            <Route path="members/:id" element={<MemberDetailPage />} />
            <Route path="members/:id/reset-password" element={<ResetPasswordPage />} />
            
            <Route path="upcoming-event" element={<UpcomingEventsPage />} />
            <Route path="my-event" element={<MyEventsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />

            <Route
              path="notifications/send"
              element={<p>Send Notification Page (Coming Soon)</p>}
            />
          </Route>

          <Route
            path="/member/*"
            element={
              <ProtectedRoute
                element={<MemberDashboardPage />}
                allowedRoles={["member"]}
              />
            }  
          >
            <Route path="profile/update" element={<MemberProfilePage />} />
            <Route path="list-member" element={<ViewMemberListPage/>}/>
            <Route path="upcoming-event" element={<UpcomingEventsPage/>}/>
            <Route path="my-event" element={<MyEventsPage/>}/>
            <Route path="profile/change-password" element={<ChangePasswordPage/>}/>
            <Route path="notifications" element={<NotificationsPage />} />
            
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          <ToastNotification />
        </BrowserRouter>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
