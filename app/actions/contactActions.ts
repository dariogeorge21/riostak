"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/utils/auth";
import {
  type ContactSubmissionItem,
  type ContactSubmissionStatus,
  INITIAL_SEED_SUBMISSIONS,
  INQUIRY_TOPICS,
  type TopicId,
} from "@/utils/contactTypes";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export type { ContactSubmissionItem, ContactSubmissionStatus, TopicId };

// Runtime fallback store in case the remote Supabase migration hasn't been applied yet
const globalForSubmissions = globalThis as unknown as {
  fallbackSubmissions?: ContactSubmissionItem[];
};

function getFallbackStore(): ContactSubmissionItem[] {
  if (!globalForSubmissions.fallbackSubmissions) {
    globalForSubmissions.fallbackSubmissions = [...INITIAL_SEED_SUBMISSIONS];
  }
  return globalForSubmissions.fallbackSubmissions;
}

export type SubmitContactPayload = {
  topicId: TopicId;
  fullName: string;
  email: string;
  affiliation: string;
  role: string;
  message: string;
};

export type SubmitContactResult = {
  success: boolean;
  error?: string;
  submission?: {
    referenceId: string;
    topicLabel: string;
    email: string;
  };
};

/**
 * Public Server Action: Validates and stores a contact form inquiry in Supabase (`public.contact_submissions`).
 */
export async function submitContactFormAction(
  payload: SubmitContactPayload
): Promise<SubmitContactResult> {
  const fullName = payload.fullName?.trim() || "";
  const email = payload.email?.trim() || "";
  const affiliation = payload.affiliation?.trim() || "";
  const role = payload.role?.trim() || "";
  const message = payload.message?.replace(/\r\n/g, "\n").trim() || "";
  const topicObj =
    INQUIRY_TOPICS.find((t) => t.id === payload.topicId) ?? INQUIRY_TOPICS[4];

  if (!fullName) {
    return { success: false, error: "Please provide your full legal or academic name." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid institutional or professional email." };
  }

  if (!message || message.length < 20) {
    return {
      success: false,
      error: "Please provide at least 20 characters describing your inquiry.",
    };
  }

  const referenceId = `RIO-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
  const nowIso = new Date().toISOString();

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("contact_submissions").insert({
      reference_id: referenceId,
      topic_id: topicObj.id,
      topic_label: topicObj.label,
      full_name: fullName,
      email,
      affiliation,
      role,
      message,
      status: "new",
      admin_notes: "",
    });

    if (error) {
      console.warn(
        "Supabase contact_submissions insert returned error, storing in fallback store:",
        error.message
      );
      const store = getFallbackStore();
      store.unshift({
        id: `local-${Date.now()}`,
        reference_id: referenceId,
        topic_id: topicObj.id,
        topic_label: topicObj.label,
        full_name: fullName,
        email,
        affiliation,
        role,
        message,
        status: "new",
        admin_notes: "",
        created_at: nowIso,
      });
    }
  } catch (err) {
    console.warn("submitContactFormAction fallback:", err);
    const store = getFallbackStore();
    store.unshift({
      id: `local-${Date.now()}`,
      reference_id: referenceId,
      topic_id: topicObj.id,
      topic_label: topicObj.label,
      full_name: fullName,
      email,
      affiliation,
      role,
      message,
      status: "new",
      admin_notes: "",
      created_at: nowIso,
    });
  }

  revalidatePath("/manage");

  return {
    success: true,
    submission: {
      referenceId,
      topicLabel: topicObj.label,
      email,
    },
  };
}

/**
 * Protected Server Action: Fetches all contact form submissions for the `/manage` console.
 */
export async function getContactSubmissions(): Promise<ContactSubmissionItem[]> {
  const session = await getAdminSession();
  if (!session) {
    return [];
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data as ContactSubmissionItem[];
    }
  } catch (err) {
    console.warn("getContactSubmissions could not query Supabase, using fallback store:", err);
  }

  return [...getFallbackStore()];
}

/**
 * Protected Server Action: Updates a submission's status and/or secretariat notes.
 */
export async function updateContactSubmissionAction(
  id: string,
  updates: { status?: ContactSubmissionStatus; admin_notes?: string }
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const nowIso = new Date().toISOString();

  try {
    const supabase = await createServerSupabaseClient();
    const updatePayload: Record<string, unknown> = {
      updated_at: nowIso,
    };

    if (updates.status !== undefined) {
      updatePayload.status = updates.status;
      if (updates.status === "reviewed") {
        updatePayload.reviewed_at = nowIso;
      }
    }

    if (updates.admin_notes !== undefined) {
      updatePayload.admin_notes = updates.admin_notes.trim();
    }

    const { error } = await supabase
      .from("contact_submissions")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      // Update fallback store if table is not migrated yet
      const store = getFallbackStore();
      const idx = store.findIndex((s) => s.id === id);
      if (idx !== -1) {
        store[idx] = {
          ...store[idx],
          ...(updates.status ? { status: updates.status } : {}),
          ...(updates.admin_notes !== undefined
            ? { admin_notes: updates.admin_notes.trim() }
            : {}),
          updated_at: nowIso,
        };
      } else {
        return { success: false, error: error.message };
      }
    }
  } catch (err) {
    console.error("updateContactSubmissionAction error:", err);
    return { success: false, error: "Failed to update submission." };
  }

  revalidatePath("/manage");
  return { success: true };
}

/**
 * Protected Server Action: Deletes a contact submission from Supabase.
 */
export async function deleteContactSubmissionAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);

    if (error) {
      const store = getFallbackStore();
      const idx = store.findIndex((s) => s.id === id);
      if (idx !== -1) {
        store.splice(idx, 1);
      } else {
        return { success: false, error: error.message };
      }
    }
  } catch (err) {
    console.error("deleteContactSubmissionAction error:", err);
    return { success: false, error: "Failed to delete submission." };
  }

  revalidatePath("/manage");
  return { success: true };
}
