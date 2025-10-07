import React from "react";
import MemberTable from "../../../components/admin/memberlist/MemberTable";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

function MemberListPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 dark:bg-secondary-900
    ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
          👥 Member Management
        </h1>

        <button
          onClick={() => navigate("/admin/members/create")}
          className="flex items-center gap-2 px-5 py-2 
                     bg-gradient-to-r from-blue-600 to-blue-500 
                     text-white font-semibold rounded-xl shadow 
                     hover:from-blue-700 hover:to-blue-600 
                     transition
                     "
        >
          <PlusIcon className="w-4 h-4" />
          Create Member
        </button>
      </div>

      <div
        className=" 
                  bg-gradient-to-br from-primary-500 via-white to-accent-300 
                  dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
                  p-6 transition-all duration-300
                   "
      >
        <MemberTable />
      </div>
    </div>
  );
}

export default MemberListPage;
