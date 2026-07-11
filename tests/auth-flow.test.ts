import assert from "node:assert/strict";
import test from "node:test";
import {
  getDashboardRedirect,
  getPostAuthRedirect,
  getPostLoginRedirect,
  getSafeInternalRedirect,
  shouldRedirectAuthenticatedUsersAwayFrom,
} from "../src/lib/auth/navigation.ts";

test("keeps safe internal redirects", () => {
  assert.equal(
    getSafeInternalRedirect("/projects/alpha?tab=members"),
    "/projects/alpha?tab=members",
  );
  assert.equal(
    getSafeInternalRedirect("/app/overview?tab=profile#details"),
    "/app/overview?tab=profile#details",
  );
  assert.equal(getSafeInternalRedirect("https://evil.example.com"), null);
  assert.equal(getSafeInternalRedirect("//evil.example.com"), null);
  assert.equal(getSafeInternalRedirect(null), null);
});

test("routes staff and participants after login", () => {
  assert.equal(getPostAuthRedirect("admin", null, false), "/admin");
  assert.equal(getPostAuthRedirect("moderator", null, false), "/admin");
  assert.equal(getPostAuthRedirect("user", null, false), "/app/apply");
  assert.equal(getPostAuthRedirect("user", null, true), "/app/overview");
  assert.equal(
    getPostAuthRedirect("user", "/projects/alpha?tab=members", false),
    "/projects/alpha?tab=members",
  );
});

test("getPostLoginRedirect delegates to getPostAuthRedirect", () => {
  assert.equal(getPostLoginRedirect("user", null, false), "/app/apply");
  assert.equal(getPostLoginRedirect("user", null, true), "/app/overview");
});

test("routes authenticated users away from dashboard landing", () => {
  assert.equal(getDashboardRedirect("admin", false), "/admin");
  assert.equal(getDashboardRedirect("moderator", false), "/admin");
  assert.equal(getDashboardRedirect("user", false), "/app/apply");
  assert.equal(getDashboardRedirect("user", true), "/app/overview");
});

test("does not let non-staff land on admin redirects", () => {
  assert.equal(getPostAuthRedirect("user", "/admin", false), "/app/apply");
  assert.equal(getPostAuthRedirect("user", "/admin/settings", true), "/app/overview");
});

test("allows reset-password for authenticated users", () => {
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/"), false);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/login"), true);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/register"), true);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/forgot-password"), true);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/auth/callback"), false);
  assert.equal(shouldRedirectAuthenticatedUsersAwayFrom("/reset-password"), false);
});
