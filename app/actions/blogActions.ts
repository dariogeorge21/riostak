"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/utils/auth";
import { type BlogItem, INITIAL_SEED_BLOGS } from "@/utils/blogTypes";
import { createPublicSupabaseClient, createServerSupabaseClient } from "@/utils/supabase/server";

export type { BlogItem };

/** Fetches all blogs from Supabase or returns initial fallback list if table is empty. */
export async function getBlogs(): Promise<BlogItem[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("index_code", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as BlogItem[];
    }
  } catch (err) {
    console.warn("getBlogs could not query Supabase, using initial seed data:", err);
  }

  return [...INITIAL_SEED_BLOGS];
}

/** Fetches only published blogs for public display. */
export async function getPublishedBlogs(): Promise<BlogItem[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("index_code", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as BlogItem[];
    }
  } catch (err) {
    console.warn("getPublishedBlogs could not query Supabase, using initial seed data:", err);
  }

  return INITIAL_SEED_BLOGS.filter((b) => b.status === "published");
}

/** Creates a new blog monograph */
export async function createBlogAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title")?.toString().trim() || "";
  const index_code = formData.get("index_code")?.toString().trim() || "01.04";
  const label = formData.get("label")?.toString().trim() || "Editorial Dispatch";
  const excerpt = (formData.get("excerpt")?.toString() || "").replace(/\r\n/g, "\n").trim();
  const content = (formData.get("content")?.toString() || "").replace(/\r\n/g, "\n").trim();
  const author_name = formData.get("author_name")?.toString().trim() || "RIOSTAK Fellowship";
  const author_title = formData.get("author_title")?.toString().trim() || "Academic Secretariat";
  const reading_time = formData.get("reading_time")?.toString().trim() || "5 min read";
  const status = (formData.get("status")?.toString() || "published") as "published" | "draft";

  const slug =
    formData.get("slug")?.toString().trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  if (!title || !excerpt || !content) {
    return { success: false, error: "Title, excerpt, and content are required." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("blogs").insert({
      slug,
      index_code,
      label,
      title,
      excerpt,
      content,
      author_name,
      author_title,
      reading_time,
      status,
      created_by: session.user.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("createBlogAction error:", err);
    return { success: false, error: "Failed to create blog entry." };
  }

  revalidatePath("/manage");
  revalidatePath("/blogs");
  revalidatePath("/");
  return { success: true };
}

/** Updates an existing blog monograph */
export async function updateBlogAction(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title")?.toString().trim() || "";
  const index_code = formData.get("index_code")?.toString().trim() || "";
  const label = formData.get("label")?.toString().trim() || "Editorial Dispatch";
  const excerpt = (formData.get("excerpt")?.toString() || "").replace(/\r\n/g, "\n").trim();
  const content = (formData.get("content")?.toString() || "").replace(/\r\n/g, "\n").trim();
  const author_name = formData.get("author_name")?.toString().trim() || "";
  const author_title = formData.get("author_title")?.toString().trim() || "";
  const reading_time = formData.get("reading_time")?.toString().trim() || "";
  const status = (formData.get("status")?.toString() || "published") as "published" | "draft";

  if (!title || !excerpt || !content) {
    return { success: false, error: "Title, excerpt, and content are required." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("blogs")
      .update({
        index_code,
        label,
        title,
        excerpt,
        content,
        author_name,
        author_title,
        reading_time,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("updateBlogAction error:", err);
    return { success: false, error: "Failed to update blog entry." };
  }

  revalidatePath("/manage");
  revalidatePath("/blogs");
  revalidatePath("/");
  return { success: true };
}

/** Deletes a blog monograph */
export async function deleteBlogAction(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("deleteBlogAction error:", err);
    return { success: false, error: "Failed to delete blog entry." };
  }

  revalidatePath("/manage");
  revalidatePath("/blogs");
  revalidatePath("/");
  return { success: true };
}

/** Toggles blog status between draft and published */
export async function toggleBlogStatusAction(
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
      .from("blogs")
      .update({
        status: nextStatus,
        published_at: nextStatus === "published" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error("toggleBlogStatusAction error:", err);
    return { success: false, error: "Failed to toggle status." };
  }

  revalidatePath("/manage");
  revalidatePath("/blogs");
  revalidatePath("/");
  return { success: true };
}
