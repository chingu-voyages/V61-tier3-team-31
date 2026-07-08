/**
 * Seed script to create an admin user.
 *
 * Usage:
 *   node --experimental-strip-types scripts/seed-admin.ts
 *   npm run seed:admin
 *
 * Required env vars (from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SECRET_KEY
 *
 * Optional env vars:
 *   ADMIN_EMAIL    (default: admin@nexus.local)
 *   ADMIN_PASSWORD (default: Admin@123!)
 *   ADMIN_NAME     (default: Admin)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey: string = process.env.SUPABASE_SECRET_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY");
  process.exit(1);
}

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@nexus.local";
const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123!";
const adminName = process.env.ADMIN_NAME ?? "Admin";

async function seedAdmin() {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Creating admin user: ${adminEmail}`);

  // Step 1: Create the user in auth.users
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { full_name: adminName },
  });

  if (createError) {
    // If user already exists, try to fetch them
    if (createError.message.includes("already exists")) {
      console.log("Admin user already exists. Fetching existing user...");

      const { data: existingUser } = await supabase.auth.admin.listUsers();

      const admin = existingUser?.users.find((u) => u.email === adminEmail);

      if (!admin) {
        console.error("Could not find existing admin user.");
        process.exit(1);
      }

      console.log(`Found existing admin: ${admin.id}`);

      // Make sure they have the admin role
      const { error: roleError } = await supabase.from("user_roles").upsert(
        {
          user_id: admin.id,
          role: "admin",
        },
        { onConflict: "user_id, role" },
      );

      if (roleError) {
        console.error("Failed to assign admin role:", roleError.message);
        process.exit(1);
      }

      console.log("Admin role already assigned or updated successfully.");
    } else {
      console.error("Failed to create admin user:", createError.message);
      process.exit(1);
    }
    return;
  }

  const userId = userData.user.id;
  console.log(`User created: ${userId}`);

  // Step 2: Assign admin role
  const { error: roleError } = await supabase.from("user_roles").insert({
    user_id: userId,
    role: "admin",
  });

  if (roleError) {
    console.error("Failed to assign admin role:", roleError.message);
    // Cleanup: delete the user we just created
    await supabase.auth.admin.deleteUser(userId);
    process.exit(1);
  }

  console.log("Admin role assigned successfully.");
  console.log("\nAdmin account created:");
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`  Name:     ${adminName}`);
  console.log("\nYou can now sign in at /login and you'll be redirected to /admin.");
}

seedAdmin();
