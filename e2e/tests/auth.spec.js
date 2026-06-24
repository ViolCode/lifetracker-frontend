import { test, expect } from "@playwright/test";

function uniqueEmail() {
    return `e2e_${Date.now()}@playwright.test`;
}

async function apiRegister(request, name, email, password) {
    const apiUrl = process.env.API_URL || "http://localhost:8081";
    const res = await request.post(`${apiUrl}/auth/register`, {
        data: { name, email, password },
    });
    expect(res.ok()).toBeTruthy();
}

test.describe("Login page", () => {
    let loginEmail;
    const loginPassword = "password123";
    const loginName = "E2E Login User";

    test.beforeAll(async ({ request }) => {
        loginEmail = uniqueEmail();
        await apiRegister(request, loginName, loginEmail, loginPassword);
    });

    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("shows login form on page load", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    });

    test("navigates to /register when clicking the register link", async ({ page }) => {
        await page.getByRole("link", { name: "Register" }).click();
        await expect(page).toHaveURL("/register");
    });

    test("logs in with valid credentials and redirects to /schedule", async ({ page }) => {
        await page.locator('input[name="email"]').fill(loginEmail);
        await page.locator('input[name="password"]').fill(loginPassword);
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL("/schedule");
        await expect(page.getByText("Life Tracker")).toBeVisible();
        await expect(page.getByText(loginName)).toBeVisible();
    });

    test("stores user in localStorage after login", async ({ page }) => {
        await page.locator('input[name="email"]').fill(loginEmail);
        await page.locator('input[name="password"]').fill(loginPassword);
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL("/schedule");

        const stored = await page.evaluate(() => localStorage.getItem("user"));
        expect(stored).not.toBeNull();

        const user = JSON.parse(stored);
        expect(user.email).toBe(loginEmail);
        expect(user.name).toBe(loginName);
    });

    test("shows error when both fields are empty", async ({ page }) => {
        await page.getByRole("button", { name: "Login" }).click();

        await expect(
            page.getByText("Please enter your email and password.")
        ).toBeVisible();

        await expect(page).toHaveURL("/login");
    });

    test("shows error when email field is empty", async ({ page }) => {
        await page.locator('input[name="password"]').fill(loginPassword);
        await page.getByRole("button", { name: "Login" }).click();

        await expect(
            page.getByText("Please enter your email and password.")
        ).toBeVisible();
    });

    test("shows error when password field is empty", async ({ page }) => {
        await page.locator('input[name="email"]').fill(loginEmail);
        await page.getByRole("button", { name: "Login" }).click();

        await expect(
            page.getByText("Please enter your email and password.")
        ).toBeVisible();
    });

    test("shows error for wrong password", async ({ page }) => {
        await page.locator('input[name="email"]').fill(loginEmail);
        await page.locator('input[name="password"]').fill("wrongpassword");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(
            page.getByText("Wrong email or password.")
        ).toBeVisible();

        await expect(page).toHaveURL("/login");
    });

    test("shows error for non-existent email", async ({ page }) => {
        await page.locator('input[name="email"]').fill("nobody@doesnotexist.test");
        await page.locator('input[name="password"]').fill("irrelevant");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(
            page.getByText("Wrong email or password.")
        ).toBeVisible();
    });

    test("button shows 'Logging in...' and is disabled while request is in flight", async ({ page }) => {

        await page.route("**/auth/login", async (route) => {
            await new Promise((r) => setTimeout(r, 1000));
            await route.continue();
        });

        await page.locator('input[name="email"]').fill(loginEmail);
        await page.locator('input[name="password"]').fill(loginPassword);
        await page.getByRole("button", { name: "Login" }).click();

        const button = page.getByRole("button", { name: "Logging in..." });
        await expect(button).toBeVisible();
        await expect(button).toBeDisabled();
    });
});

test.describe("Register page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/register");
    });

    test("shows register form on page load", async ({ page }) => {
        await expect(
            page.getByRole("heading", { name: "Create Account" })
        ).toBeVisible();
        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
        await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
    });

    test("navigates to /login when clicking the login link", async ({ page }) => {
        await page.getByRole("link", { name: "Login" }).click();
        await expect(page).toHaveURL("/login");
    });

    test("registers a new user and redirects to /login with success toast", async ({ page }) => {
        const email = uniqueEmail();

        await page.locator('input[name="name"]').fill("New Test User");
        await page.locator('input[name="email"]').fill(email);
        await page.locator('input[name="password"]').fill("securepass");
        await page.locator('input[name="confirmPassword"]').fill("securepass");
        await page.getByRole("button", { name: "Register" }).click();

        await expect(
            page.getByText("Account created! Please log in.")
        ).toBeVisible();

        await expect(page).toHaveURL("/login");
    });

    test("shows error when name is empty", async ({ page }) => {
        await page.locator('input[name="email"]').fill(uniqueEmail());
        await page.locator('input[name="password"]').fill("securepass");
        await page.locator('input[name="confirmPassword"]').fill("securepass");
        await page.getByRole("button", { name: "Register" }).click();

        await expect(page.getByText("Name is required.")).toBeVisible();
        await expect(page).toHaveURL("/register");
    });

    test("shows error when email is empty", async ({ page }) => {
        await page.locator('input[name="name"]').fill("Test User");
        await page.locator('input[name="password"]').fill("securepass");
        await page.locator('input[name="confirmPassword"]').fill("securepass");
        await page.getByRole("button", { name: "Register" }).click();

        await expect(page.getByText("Email is required.")).toBeVisible();
    });

    test("shows error when password is shorter than 6 characters", async ({ page }) => {
        await page.locator('input[name="name"]').fill("Test User");
        await page.locator('input[name="email"]').fill(uniqueEmail());
        await page.locator('input[name="password"]').fill("abc");
        await page.locator('input[name="confirmPassword"]').fill("abc");
        await page.getByRole("button", { name: "Register" }).click();

        await expect(
            page.getByText("Password must be at least 6 characters.")
        ).toBeVisible();
    });

    test("shows error when passwords do not match", async ({ page }) => {
        await page.locator('input[name="name"]').fill("Test User");
        await page.locator('input[name="email"]').fill(uniqueEmail());
        await page.locator('input[name="password"]').fill("password123");
        await page.locator('input[name="confirmPassword"]').fill("different123");
        await page.getByRole("button", { name: "Register" }).click();

        await expect(page.getByText("Passwords do not match.")).toBeVisible();
    });

    test("shows error when email is already registered", async ({ page, request }) => {
        const email = uniqueEmail();
        await apiRegister(request, "Existing User", email, "password123");

        await page.locator('input[name="name"]').fill("Duplicate");
        await page.locator('input[name="email"]').fill(email);
        await page.locator('input[name="password"]').fill("password123");
        await page.locator('input[name="confirmPassword"]').fill("password123");
        await page.getByRole("button", { name: "Register" }).click();

        await expect(
            page.getByText("An account with this email already exists.")
        ).toBeVisible();

        await expect(page).toHaveURL("/register");
    });

    test("button shows 'Creating...' and is disabled while request is in flight", async ({ page }) => {
        await page.route("**/auth/register", async (route) => {
            await new Promise((r) => setTimeout(r, 1000));
            await route.continue();
        });

        await page.locator('input[name="name"]').fill("Slow User");
        await page.locator('input[name="email"]').fill(uniqueEmail());
        await page.locator('input[name="password"]').fill("password123");
        await page.locator('input[name="confirmPassword"]').fill("password123");
        await page.getByRole("button", { name: "Register" }).click();

        const button = page.getByRole("button", { name: "Creating..." });
        await expect(button).toBeVisible();
        await expect(button).toBeDisabled();
    });
});

test.describe("Logout", () => {
    let logoutEmail;
    const logoutPassword = "password123";

    test.beforeAll(async ({ request }) => {
        logoutEmail = uniqueEmail();
        await apiRegister(request, "Logout User", logoutEmail, logoutPassword);
    });

    test("clicking Sign out redirects to /login and clears localStorage", async ({ page }) => {
        await page.goto("/login");
        await page.locator('input[name="email"]').fill(logoutEmail);
        await page.locator('input[name="password"]').fill(logoutPassword);
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page).toHaveURL("/schedule");

        await page.getByRole("button", { name: "Sign out" }).click();

        await expect(page).toHaveURL("/login");

        const stored = await page.evaluate(() => localStorage.getItem("user"));
        expect(stored).toBeNull();
    });
});

test.describe("Protected routes", () => {
    let protectedEmail;
    const protectedPassword = "password123";

    test.beforeAll(async ({ request }) => {
        protectedEmail = uniqueEmail();
        await apiRegister(request, "Protected User", protectedEmail, protectedPassword);
    });

    test("visiting /schedule without login redirects to /login", async ({ page }) => {
        await page.goto("/login");
        await page.evaluate(() => localStorage.clear());

        await page.goto("/schedule");
        await expect(page).toHaveURL("/login");
    });

    test("visiting /expenses without login redirects to /login", async ({ page }) => {
        await page.goto("/login");
        await page.evaluate(() => localStorage.clear());

        await page.goto("/expenses");
        await expect(page).toHaveURL("/login");
    });

    test("visiting /history without login redirects to /login", async ({ page }) => {
        await page.goto("/login");
        await page.evaluate(() => localStorage.clear());

        await page.goto("/history");
        await expect(page).toHaveURL("/login");
    });

    test("visiting /schedule after login shows the protected page", async ({ page }) => {
        await page.goto("/login");
        await page.locator('input[name="email"]').fill(protectedEmail);
        await page.locator('input[name="password"]').fill(protectedPassword);
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).toHaveURL("/schedule");
        await expect(page.getByText("Life Tracker")).toBeVisible();
    });

    test("/ redirects to /login when not authenticated", async ({ page }) => {
        await page.goto("/login");
        await page.evaluate(() => localStorage.clear());

        await page.goto("/");
        await expect(page).toHaveURL("/login");
    });

    test("/ redirects to /schedule when already authenticated", async ({ page }) => {
        await page.goto("/login");
        await page.locator('input[name="email"]').fill(protectedEmail);
        await page.locator('input[name="password"]').fill(protectedPassword);
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page).toHaveURL("/schedule");

        await page.goto("/");
        await expect(page).toHaveURL("/schedule");
    });
});
