import { cpSync, existsSync, mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

function publishShot(name: string) {
  if (!existsSync("/opt/cursor")) return;
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  cpSync(`test-results/${name}`, `/opt/cursor/artifacts/${name}`);
}

async function shot(page: Page, name: string) {
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({ path: `test-results/${name}` });
  publishShot(name);
}

async function hiddenBox(page: Page, selector: string) {
  return page.locator(selector).first().evaluate(el => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      width: rect.width,
      height: rect.height,
      overflow: style.overflow,
      clip: style.clip,
      clipPath: style.clipPath,
    };
  });
}

function expectClipped(box: { width: number; height: number; overflow: string; clip: string; clipPath: string }) {
  expect(box.width).toBeLessThanOrEqual(2);
  expect(box.height).toBeLessThanOrEqual(2);
  expect(box.overflow === "hidden" || box.clip !== "auto" || box.clipPath !== "none").toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (globalThis as { __UI_SDK_STRICT__?: boolean }).__UI_SDK_STRICT__ = true;
  });
});

test("iPhone WebKit keeps icon labels clipped and the plate readable", async ({ page }) => {
  await page.goto("/gallery.html");
  await expect(page.locator("cl-sheet")).toBeVisible();

  const scroll = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scroll.scrollWidth).toBeLessThanOrEqual(scroll.clientWidth);

  const navTops = await page.locator(".nav a").evaluateAll(els => els.map(el => el.getBoundingClientRect().top));
  expect(navTops.length).toBe(3);
  expect(Math.max(...navTops) - Math.min(...navTops)).toBeLessThan(8);

  const margin = page.locator("[data-slot='cl-sheet-margin'][data-side='start']");
  await expect(margin).toContainText("Gallery");
  const marginStyle = await margin.evaluate(el => {
    const style = getComputedStyle(el);
    return { transform: style.transform, writingMode: style.writingMode };
  });
  expect(marginStyle.transform).toBe("none");
  expect(marginStyle.writingMode).toBe("horizontal-tb");

  await page.locator(".nav").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-header.png");
  await page.locator("[data-slot='cl-sheet-margin'][data-side='start']").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-strip.png");

  for (const name of ["Previous month", "Next month"]) {
    const button = page.locator("cl-calendar").getByRole("button", { name, exact: true });
    await expect(button).toHaveAccessibleName(name);
    expectClipped(await hiddenBox(page, `cl-calendar [data-slot='calendar-${name === "Previous month" ? "previous" : "next"}'] [data-slot='visually-hidden']`));
  }

  const weekdays = page.locator("cl-calendar cl-calendar-weekdays [data-slot='calendar-weekday']");
  await expect(weekdays).toHaveCount(7);
  const weekdayBoxes = await weekdays.evaluateAll(els =>
    els.map(el => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }),
  );
  const columns = await page.locator("cl-calendar cl-calendar-weekdays").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length);
  expect(columns).toBe(7);
  const rowWidth = await page.locator("cl-calendar cl-calendar-weekdays").evaluate(el => el.getBoundingClientRect().width);
  expect(rowWidth).toBeGreaterThan(240);
  for (let i = 0; i < weekdayBoxes.length; i += 1) {
    for (let j = i + 1; j < weekdayBoxes.length; j += 1) {
      const a = weekdayBoxes[i];
      const b = weekdayBoxes[j];
      const overlap = a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
      expect(overlap).toBe(false);
    }
  }
  const days = page.locator("cl-calendar cl-calendar-week").first().locator("[data-slot='calendar-day']");
  await expect(days).toHaveCount(7);
  const dayBoxes = await days.evaluateAll(els => els.map(el => el.getBoundingClientRect().left));
  const unique = new Set(dayBoxes.map(left => Math.round(left)));
  expect(unique.size).toBe(7);

  await page.locator("cl-calendar").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-dates.png");

  const month = page.locator("cl-date-input input").first();
  const hour = page.locator("cl-time-input input").first();
  await expect(month).toHaveAttribute("placeholder", "MM");
  await expect(hour).toHaveAttribute("placeholder", "HH");
  expect((await month.boundingBox())?.width ?? 0).toBeGreaterThan(12);
  expect((await hour.boundingBox())?.width ?? 0).toBeGreaterThan(12);
  const timeBox = await page.locator("cl-time-input").boundingBox();
  const footer = await page.locator("[data-slot='cl-sheet-margin'][data-side='end']").boundingBox();
  expect(timeBox && footer).toBeTruthy();
  expect(timeBox!.y + timeBox!.height).toBeLessThanOrEqual(footer!.y + 1);

  const radio = page.getByRole("radio", { name: /1/ }).first();
  await expect(radio).toBeVisible();
  expectClipped(await hiddenBox(page, "cl-rating [data-slot='visually-hidden']"));

  for (const glyph of ["−", "+"]) {
    const button = page.locator("cl-number-input").getByRole("button", { name: glyph });
    await expect(button).toHaveAccessibleName(glyph);
  }
  expectClipped(await hiddenBox(page, "[data-slot='number-input-decrement'] [data-slot='visually-hidden']"));
  expectClipped(await hiddenBox(page, "[data-slot='number-input-increment'] [data-slot='visually-hidden']"));

  const input = page.locator("cl-password-input input");
  const toggle = page.locator("cl-password-input").getByRole("button", { name: "Show" });
  await expect(toggle).toHaveAccessibleName("Show");
  const inputBox = await input.boundingBox();
  const toggleBox = await toggle.boundingBox();
  expect(inputBox && toggleBox).toBeTruthy();
  const inputMid = inputBox!.y + inputBox!.height / 2;
  const toggleMid = toggleBox!.y + toggleBox!.height / 2;
  expect(Math.abs(inputMid - toggleMid)).toBeLessThan(10);
  expect(toggleBox!.x).toBeGreaterThan(inputBox!.x + inputBox!.width - 4);
  expect(inputBox!.height).toBeLessThan(72);

  const checkbox = await page.locator("cl-checkbox").first().boundingBox();
  const radioItem = await page.locator("cl-radio").first().boundingBox();
  expect(checkbox && radioItem).toBeTruthy();
  expect(Math.abs(checkbox!.x - radioItem!.x)).toBeLessThan(12);

  const switchLook = await page.locator("cl-switch").evaluate(el => {
    const style = getComputedStyle(el);
    const thumb = el.querySelector("cl-switch-thumb");
    const thumbStyle = thumb ? getComputedStyle(thumb) : null;
    return {
      radius: parseFloat(style.borderRadius),
      height: parseFloat(style.height),
      thumbRadius: thumbStyle ? parseFloat(thumbStyle.borderRadius) : 0,
    };
  });
  expect(switchLook.radius).toBeGreaterThanOrEqual(switchLook.height / 2 - 1);
  expect(switchLook.thumbRadius).toBeGreaterThan(4);

  await page.locator("#forms").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-forms.png");
  await page.locator("cl-rating").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-rating.png");
  await page.locator("cl-number-input").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-number.png");
  await page.locator("cl-password-input").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-password.png");
  await page.locator("cl-radio-group").scrollIntoViewIfNeeded();
  await shot(page, "iphone-after-radios.png");

  await page.locator("#post-note").click();
  const dismiss = page.getByRole("button", { name: "Dismiss" });
  await expect(dismiss).toBeVisible();
  await expect(dismiss).toHaveAccessibleName("Dismiss");
  expectClipped(await hiddenBox(page, "[data-slot='toast-close'] [data-slot='visually-hidden']"));
  await shot(page, "iphone-after-toast.png");
});
