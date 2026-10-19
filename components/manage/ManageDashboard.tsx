"use client";

import { useState } from "react";
import type { BlogItem } from "@/app/actions/blogActions";
import type { ContactSubmissionItem } from "@/app/actions/contactActions";
import type { CourseItem } from "@/app/actions/courseActions";
import type { AdminUser } from "@/utils/auth";
import BlogManager from "./BlogManager";
import CourseManager from "./CourseManager";
import ManageSidebar, { type ManageTab } from "./ManageSidebar";
import SubmissionManager from "./SubmissionManager";

interface ManageDashboardProps {
  user: AdminUser;
  initialBlogs: BlogItem[];
  initialCourses: CourseItem[];
  initialSubmissions: ContactSubmissionItem[];
}

export default function ManageDashboard({
  user,
  initialBlogs,
  initialCourses,
  initialSubmissions,
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
        submissionCount={initialSubmissions.length}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-space-md sm:p-space-xl lg:p-space-2xl">
        {activeTab === "blogs" ? (
          <BlogManager initialBlogs={initialBlogs} />
        ) : activeTab === "courses" ? (
          <CourseManager initialCourses={initialCourses} />
        ) : (
          <SubmissionManager initialSubmissions={initialSubmissions} />
        )}
      </main>
    </div>
  );
}
