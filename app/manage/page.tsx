import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getBlogs } from "@/app/actions/blogActions";
import { getCourses } from "@/app/actions/courseActions";
import ManageDashboard from "@/components/manage/ManageDashboard";
import { getAdminSession } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Secretariat Console — RIOSTAK | Management",
  description: "Administrative console for managing RIOSTAK blogs, monographs, and course curricula.",
};

export default async function ManagePage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  const [blogs, courses] = await Promise.all([getBlogs(), getCourses()]);

  return (
    <div className="min-h-screen w-full bg-background pt-20 text-primary">
      <ManageDashboard
        initialBlogs={blogs}
        initialCourses={courses}
        user={session.user}
      />
    </div>
  );
}
