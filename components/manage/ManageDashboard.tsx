"use client";

import { useState } from "react";
import type { BlogItem } from "@/app/actions/blogActions";
import type { CourseItem } from "@/app/actions/courseActions";
import type { AdminUser } from "@/utils/auth";
import BlogManager from "./BlogManager";
import CourseManager from "./CourseManager";
import ManageSidebar, { type ManageTab } from "./ManageSidebar";

interface ManageDashboardProps {
  user: AdminUser;
  initialBlogs: BlogItem[];
  initialCourses: CourseItem[];
}

export default function ManageDashboard({
  user,
  initialBlogs,
  initialCourses,
}: ManageDashboardProps) {
  const [activeTab, setActiveTab] = useState<ManageTab>("blogs");

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col lg:flex-row">
      {/* Sidebar */}
      <ManageSidebar
        activeTab={activeTab}
        blogCount={initialBlogs.length}
        courseCount={initialCourses.length}
        onSelectTab={setActiveTab}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-space-md sm:p-space-xl lg:p-space-2xl">
        {activeTab === "blogs" ? (
          <BlogManager initialBlogs={initialBlogs} />
        ) : (
          <CourseManager initialCourses={initialCourses} />
        )}
      </main>
    </div>
  );
}
