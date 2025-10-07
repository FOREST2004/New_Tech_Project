import React from "react";
import CreateMemberForm from "../../../components/admin/create/CreateMemberForm";

const CreateMemberPage = () => {
    return (
        <div className="
            min-h-screen
            bg-gradient-to-br from-primary-500 via-white to-accent-300 
            dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
            flex items-center justify-center p-4 transition-all duration-300
        ">
            <CreateMemberForm/>
        </div>
    )
}
 
export default CreateMemberPage;
