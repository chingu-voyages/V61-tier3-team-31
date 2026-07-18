import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function seed() {
  console.log("Connecting to:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // 1. Get voyage
  const { data: voyage, error: vErr } = await supabase
    .from("voyages")
    .select("id")
    .eq("number", 1)
    .single();

  if (vErr) {
    console.error("No voyage found:", vErr.message);
    process.exit(1);
  }
  console.log("Voyage ID:", voyage.id);

  // 2. Create users via auth.admin
  const users = [
    { id: "11111111-1111-1111-1111-111111111111", email: "alice@example.com", name: "Alice Smith" },
    { id: "22222222-2222-2222-2222-222222222222", email: "bob@example.com", name: "Bob Jones" },
    {
      id: "33333333-3333-3333-3333-333333333333",
      email: "charlie@example.com",
      name: "Charlie Brown",
    },
    {
      id: "44444444-4444-4444-4444-444444444444",
      email: "dave@example.com",
      name: "Dave Williams",
    },
    { id: "55555555-5555-5555-5555-555555555555", email: "eve@example.com", name: "Eve Davis" },
  ];

  const roles = ["frontend", "backend", "fullstack", "design", "frontend"];
  const exps = ["beginner", "intermediate", "advanced", "beginner", "intermediate"];
  const hours = [20, 20, 40, 20, 20];

  for (const u of users) {
    const { error } = await supabase.auth.admin.createUser({
      id: u.id,
      email: u.email,
      password: "password123",
      email_confirm: true,
      user_metadata: { full_name: u.name },
    });
    if (error && !error.message.includes("already been registered")) {
      console.error("User " + u.email + ":", error.message);
    } else {
      console.log("User " + u.email + ": OK");
    }
  }

  // 3. Insert applications
  const apps = users.map((u, i) => ({
    id: "a" + u.id.slice(1),
    applicant_id: u.id,
    voyage_id: voyage.id,
    status: "accepted",
    experience: exps[i],
    preferred_role: roles[i],
    weekly_hours: hours[i],
    timezone: "UTC",
    motivation: "Motivated to contribute as " + roles[i] + ".",
    submitted_at: new Date().toISOString(),
    decided_at: new Date().toISOString(),
    decided_by: users[0].id,
  }));

  const { error: appErr } = await supabase.from("applications").upsert(apps, { onConflict: "id" });
  if (appErr) console.error("Applications:", appErr.message);
  else console.log("Applications: OK");

  // 4. Insert enrollments
  const enrollments = users.map((u, i) => ({
    id: "e" + u.id.slice(1),
    account_id: u.id,
    application_id: "a" + u.id.slice(1),
    voyage_id: voyage.id,
    participant_role: roles[i],
    experience: exps[i],
    status: "active",
    timezone: "UTC",
    weekly_hours: hours[i],
  }));

  const { error: enrErr } = await supabase
    .from("enrollments")
    .upsert(enrollments, { onConflict: "id" });
  if (enrErr) console.error("Enrollments:", enrErr.message);
  else console.log("Enrollments: OK");

  console.log("\nDone! Refresh your app.");
}

seed().catch(console.error);
