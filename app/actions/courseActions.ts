"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/utils/auth";
import { type CourseItem, INITIAL_SEED_COURSES } from "@/utils/courseTypes";
import { createPublicSupabaseClient, createServerSupabaseClient } from "@/utils/supabase/server";

export type { CourseItem };

/** Fetches courses from Supabase or fallback to initial seed courses. */
export async function getCourses(): Promise<CourseItem[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as CourseItem[];
    }
  } catch (err) {
    console.warn("getCourses could not query Supabase, using initial seed data:", err);
  }

  return [...INITIAL_SEED_COURSES];
}

/** Creates a new course offering */
export async function createCourseAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title")?.toString().trim() || "";
  const index_code = formData.get("index_code")?.toString().trim() || "04";
  const subtitle = formData.get("subtitle")?.toString().trim() || "";
  const tags = formData.get("tags")?.toString().trim() || "Online • Academic Cohort";
  const body = formData.get("body")?.toString().trim() || "";
  const extended_body = formData.get("extended_body")?.toString().trim() || "";
  const format = formData.get("format")?.toString().trim() || "Digital Modules + Live Seminars";
  const youtube_url =
    formData.get("youtube_url")?.toString().trim() ||
    "https://www.youtube.com/watch?v=inpok4MKVLM";
  const rawHighlights = formData.get("syllabus_highlights")?.toString() || "";
  const syllabus_highlights = rawHighlights
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const image_src = formData.get("image_src")?.toString().trim() || "/images/offering-courses.jpg";
  const image_alt = formData.get("image_alt")?.toString().trim() || `${title} cohort in session`;
  const caption = formData.get("caption")?.toString().trim() || "Curriculum // 2026";
  const status = (formData.get("status")?.toString() || "published") as "published" | "draft";

  const slug =
    formData.get("slug")?.toString().trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  if (!title || !subtitle || !body) {
    return { success: false, error: "Title, subtitle, and primary narrative are required." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("courses").insert({
      slug,
      index_code,
      title,
      subtitle,
      tags,
      body,
      extended_body,
      format,
      syllabus_highlights,
      youtube_url,
      image_src,
      image_alt,
      caption,
      status,
      created_by: session.user.id,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("createCourseAction error:", err);
    return { success: false, error: "Failed to create course offering." };
  }

  revalidatePath("/manage");
  revalidatePath("/courses");
  return { success: true };
}

/** Updates an existing course offering */
export async function updateCourseAction(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title")?.toString().trim() || "";
  const index_code = formData.get("index_code")?.toString().trim() || "";
  const subtitle = formData.get("subtitle")?.toString().trim() || "";
  const tags = formData.get("tags")?.toString().trim() || "";
  const body = formData.get("body")?.toString().trim() || "";
  const extended_body = formData.get("extended_body")?.toString().trim() || "";
  const format = formData.get("format")?.toString().trim() || "";
  const youtube_url =
    formData.get("youtube_url")?.toString().trim() ||
    "https://www.youtube.com/watch?v=inpok4MKVLM";
  const rawHighlights = formData.get("syllabus_highlights")?.toString() || "";
  const syllabus_highlights = rawHighlights
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const caption = formData.get("caption")?.toString().trim() || "";
  const status = (formData.get("status")?.toString() || "published") as "published" | "draft";

  if (!title || !subtitle || !body) {
    return { success: false, error: "Title, subtitle, and primary narrative are required." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("courses")
      .update({
        index_code,
        title,
        subtitle,
        tags,
        body,
        extended_body,
        format,
        syllabus_highlights,
        youtube_url,
        caption,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("updateCourseAction error:", err);
    return { success: false, error: "Failed to update course offering." };
  }

  revalidatePath("/manage");
  revalidatePath("/courses");
  return { success: true };
}

/** Deletes a course offering */
export async function deleteCourseAction(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("deleteCourseAction error:", err);
    return { success: false, error: "Failed to delete course offering." };
  }

  revalidatePath("/manage");
  revalidatePath("/courses");
  return { success: true };
}

/** Toggles course offering status between draft and published */
export async function toggleCourseStatusAction(
  id: string,
  currentStatus: "published" | "draft" | "archived"
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const nextStatus = currentStatus === "published" ? "draft" : "published";

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("courses")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("toggleCourseStatusAction error:", err);
    return { success: false, error: "Failed to toggle status." };
  }

  revalidatePath("/manage");
  revalidatePath("/courses");
  return { success: true };
}
