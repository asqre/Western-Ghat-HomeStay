import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import classes from "./index.module.css";
import { getAdminProfile } from "@/apiClient/profile";
import { useQuery } from "react-query";

export default function MainLayout({ children }) {
  const { data: profileData } = useQuery("admin-profile", getAdminProfile);

  return (
    <div className={classes.mainLayout}>
      <Header />
      <div className={classes.content}>{children}</div>
      <Footer social_media={profileData?.social_media} />
    </div>
  );
}
