import React from "react";
import ViewMemberList from "../../../components/member/memberlist/viewMemberList";

function ViewMemberListPage() {
  return (
    <div className="
                  
                  bg-gradient-to-br from-primary-500 via-white to-accent-300 
                  dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
                  items-center justify-center p-10 transition-all duration-300
    ">
      <h1 className="text-2xl font-bold mb-4">Member List</h1>
      <ViewMemberList />
    </div>
  );
}

export default ViewMemberListPage;