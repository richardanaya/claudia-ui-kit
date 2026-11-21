import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:4174" });

test("the CDN page renders from the built files alone", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const scripts: string[] = [];
  page.on("request", request => {
    if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
  });
  await page.goto("/cdn-test.html");
  await expect(page.getByRole("heading", { name: "CDN plate" })).toBeVisible();
  await page.getByRole("button", { name: "Mark" }).click();
  await expect(page.locator("#cdn-log")).toHaveText("Marked from the CDN");
  const title = page.getByRole("textbox", { name: "Title" });
  await title.fill("RM-CDN");
  await expect(title).toHaveValue("RM-CDN");
  const star = page.getByRole("checkbox", { name: "Star" });
  await star.press(" ");
  await expect(star).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("cl-pill")).toHaveText("From the CDN");
  expect(scripts.some(path => path.endsWith("/cdn/claudia-ui.js"))).toBe(true);
  expect(scripts.some(path => path.includes("/node_modules/") || path.includes("/@fs/"))).toBe(false);
  expect(errors).toEqual([]);

  const version = await page.request.get("/cdn/v0.1.0/claudia-ui.js");
  expect(version.ok()).toBe(true);
  const css = await page.request.get("/cdn/claudia-ui.css");
  expect(css.ok()).toBe(true);
  expect(await css.text()).toContain("--cl-paper");
  const map = await page.request.get("/cdn/claudia-ui.js.map");
  expect(map.ok()).toBe(true);
});
