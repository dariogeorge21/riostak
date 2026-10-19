import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getBlogs } from "@/app/actions/blogActions";
import { getContactSubmissions } from "@/app/actions/contactActions";
import { getCourses } from "@/app/actions/courseActions";
import ManageDashboard from "@/components/manage/ManageDashboard";
import { getAdminSession } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Secretariat Console — RIOSTAK | Management",
  description:
    "Administrative console for managing RIOSTAK blogs, monographs, course curricula, and institutional form submissions.",
};

export default async function ManagePage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  const [blogs, courses, submissions] = await Promise.all([
    getBlogs(),
    getCourses(),
    getContactSubmissions(),
  ]);

  return (
    <div className="min-h-screen w-full bg-background pt-20 text-primary">
      <ManageDashboard
        initialBlogs={blogs}
        initialCourses={courses}
        initialSubmissions={submissions}
        user={session.user}
      />
    </div>
  );
}
