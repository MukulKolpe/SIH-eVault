import React from "react";
import Profile from "@/components/ProfilePage/Profile";
import DocsAwaitingApproval from "@/components/DocsAwaitingApproval/DocsAwaitingApproval";
import DocsViewAccess from "@/components/DocsViewAccess/index";
const ProfilePage = () => {
  return (
    <div>
      <Profile />
      <DocsAwaitingApproval />
      <DocsViewAccess />
    </div>
  );
};
export default ProfilePage;
