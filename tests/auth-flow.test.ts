import assert from "node:assert/strict";
import test from "node:test";
import {
  getPostLoginRedirect,
  getSafeInternalRedirect,
  shouldRedirectAuthenticatedUsersAwayFrom,
} from "../src/lib/auth/navigation.ts";

test("keeps safe internal redirects", () => {
  assert.equal(
    getSafeInternalRedirect("/projects/alpha?tab=members"),
    "/projects/alpha?tab=members",
  );
  assert.equal(getSafeInternalRedirect("https://evil.example.com"), null);
  assert.equal(getSafeInternalRedirect("//evil.example.com"), null);
  assert.equal(getSafeInternalRedirect(null), null);
});

test("routes staff and participants after login", () => {
  assert.equal(getPostLoginRedirect("admin", null), "/admin");
  assert.equal(getPostLoginRedirect("moderator", null), "/admin");
  assert.equal(getPostLoginRedirect("user", null), "/dashboard");
  assert.equal(
    getPostLoginRedirect("user", "/projects/alpha?tab=members"),
    "/projects/alpha?tab=members",
  );
});

test("does not let non-staff land on admin redirects", () => {
  assert.equal(getPostLoginRedirect("user", "/admin"), "/dashboard");
  assert.equal(getPostLoginRedirect("user", "/admin/settings"), "/dashboard");
});

test("allows reset-password for authenticated users", () => {
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/login"), true);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/register"), true);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/forgot-password"), true);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/auth/callback"), false);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/reset-password"), false);
});
