import { expect, test } from "@playwright/test";

// Sample Test
test("should verify the functionality of the application", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const title = await page.title();
  expect(title).toBe("Album Covers and Music Recommendations");
});

// Navigation Tests
test("should redirect to terms page when terms not accepted", async ({
  page,
}) => {
  // Clear cookies to ensure terms aren't accepted
  await page.context().clearCookies();

  await page.goto("http://localhost:3000");
  await page.locator('a[href="terms"] div.text-foreground').click();

  // Should redirect to terms page first
  await page.waitForURL(/.*\/terms/);
  await expect(page).toHaveURL(/.*\/terms/);
  // Wait for the agree button to be visible
  await expect(
    page.getByRole("button", { name: "I Agree, Start the Survey!" })
  ).toBeVisible();

  // Accept terms
  await page
    .getByRole("button", { name: "I Agree, Start the Survey!" })
    .click();

  // Now should proceed to survey
  await page.waitForURL(/.*\/survey\/step-one/);
  await expect(page).toHaveURL(/.*\/survey\/step-one/);
});

test("should navigate directly to survey when terms accepted", async ({
  page,
  context,
}) => {
  // Set the terms cookie
  await context.addCookies([
    {
      name: "accepted-terms",
      value: "true",
      url: "http://localhost:3000",
    },
  ]);

  await page.goto("http://localhost:3000");
  await page.locator('a[href="terms"] div.text-foreground').click();

  // Should go directly to survey
  await page.waitForURL(/.*\/survey\/step-one\/playlist-one/);
  await expect(page).toHaveURL(/.*\/survey\/step-one\/playlist-one/);
});

test("should show error when attempting to navigate without completing step", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/survey/review");

  // Try to proceed without completing the required fields
  await page.getByRole("button", { name: /submit/i }).click();

  // Check if error message is displayed
  await expect(
    page.getByText(/please complete all required fields/i)
  ).toBeVisible();
});

// Survey Completion Flow
test("should complete the entire survey flow", async ({ page }) => {
  // Start at homepage
  await page.goto("http://localhost:3000");
  await page.getByRole("link", { name: /start survey/i }).click();

  // Step 1: Rate songs
  await expect(page).toHaveURL(/.*\/survey\/step-one/);
  // Fill out song ratings (assuming 5 songs with rating from 1-5)
  for (let i = 1; i <= 5; i++) {
    await page.getByLabel(`Song ${i}`).getByLabel("4 stars").click();
  }
  await page.getByRole("button", { name: /next/i }).click();

  // Step 2: Rate models
  await expect(page).toHaveURL(/.*\/survey\/model-2/);
  // Fill out model ratings
  await page
    .getByText(/model a/i)
    .getByLabel("5 stars")
    .click();
  await page
    .getByText(/model b/i)
    .getByLabel("3 stars")
    .click();
  await page.getByRole("button", { name: /next/i }).click();

  // Step 3: Additional questions
  await expect(page).toHaveURL(/.*\/survey\/model-3/);
  await page.getByLabel(/how likely are you/i).selectOption("Very likely");
  await page.getByLabel(/feedback/i).fill("This was an interesting survey!");
  await page.getByRole("button", { name: /next/i }).click();

  // Review page
  await expect(page).toHaveURL(/.*\/survey\/review/);
  await expect(page.getByText(/review your answers/i)).toBeVisible();

  // Submit survey
  await page.getByRole("button", { name: /submit/i }).click();

  // Thank you page
  await expect(page).toHaveURL(/.*\/survey\/thank-you/);
  await expect(page.getByText(/thank you for completing/i)).toBeVisible();
});

// Audio Player Tests
test("should play and pause audio", async ({ page }) => {
  await page.goto("http://localhost:3000/survey/step-one");

  // Find play button and click it
  const playButton = page.getByRole("button", { name: /play/i });
  await playButton.click();

  // Verify it changed to pause button
  await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();

  // Click pause
  await page.getByRole("button", { name: /pause/i }).click();

  // Verify it changed back to play button
  await expect(playButton).toBeVisible();
});

test("should adjust volume control", async ({ page }) => {
  await page.goto("http://localhost:3000/survey/step-one");

  // Find volume slider and adjust it
  const volumeSlider = page.getByRole("slider", { name: /volume/i });
  await volumeSlider.fill("50");

  // Verify volume indicator changes
  await expect(page.locator(".volume-indicator")).toHaveAttribute(
    "data-volume",
    "50"
  );
});

// Responsive Design Tests
test("should display mobile navigation menu on small screens", async ({
  page,
}) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("http://localhost:3000");

  // Check if hamburger menu exists
  const menuButton = page.getByRole("button", { name: /menu/i });
  await expect(menuButton).toBeVisible();

  // Open mobile menu
  await menuButton.click();

  // Verify mobile nav is visible
  await expect(page.locator(".mobile-nav")).toBeVisible();
});

test("should maintain layout integrity on different screen sizes", async ({
  page,
}) => {
  // Test on tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("http://localhost:3000");
  await expect(page.locator("main")).toBeVisible();

  // Test on desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000");
  await expect(page.locator("main")).toBeVisible();
});
