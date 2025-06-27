import { createClient } from "./supabase/server";
import { USERS_TABLE_NAME } from "../constants/texts/db-tables";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get additional user info from our users table
  const { data: userProfile } = await supabase
    .from(USERS_TABLE_NAME)
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    profile: userProfile
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireAdminAuth() {
  const user = await requireAuth();
  if (user.profile?.role !== 'admin') {
    throw new Error("Admin access required");
  }
  return user;
}