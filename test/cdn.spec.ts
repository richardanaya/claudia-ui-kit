import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const version = JSON.parse(readFileSync("package.json", "utf8")).version as string;
const banner = `/*! Claudia UI Kit v${version} · MIT License · (c) 2026 Richard Anaya */`;

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

  const versioned = await page.request.get(`/cdn/v${version}/claudia-ui.js`);
  expect(versioned.ok()).toBe(true);
  expect((await versioned.text()).startsWith(banner)).toBe(true);
  const js = await page.request.get("/cdn/claudia-ui.js");
  expect((await js.text()).startsWith(banner)).toBe(true);
  const css = await page.request.get("/cdn/claudia-ui.css");
  expect(css.ok()).toBe(true);
  const cssText = await css.text();
  expect(cssText.startsWith(banner)).toBe(true);
  expect(cssText).toContain("--cl-paper");
  const map = await page.request.get("/cdn/claudia-ui.js.map");
  expect(map.ok()).toBe(true);
});
