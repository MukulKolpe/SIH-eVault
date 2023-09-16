import React from "react";
import Profile from "@/components/ProfilePage/Profile";
import DocsAwaitingApproval from "@/components/DocsAwaitingApproval/DocsAwaitingApproval";
const ProfilePage = () => {
  return (
    <div>
      <Profile />
      <DocsAwaitingApproval />
    </div>
  );
};
export default ProfilePage;
