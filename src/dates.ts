import { calendar } from "@ui-sdk/core/calendar";
import { dateInput } from "@ui-sdk/core/date-input";
import { datePicker } from "@ui-sdk/core/date-picker";
import { timeInput } from "@ui-sdk/core/time-input";
import { createParts, wrappedButton } from "@ui-sdk/web";
import { followAnchor } from "./anchor.js";
import { paintCalendar } from "./calendar-view.js";
import { popupApi, popupKinds, popupState } from "./popup-state.js";
import { paintSegments } from "./segments.js";

const calendarTags = {
  day: "cl-calendar-day",
  weekday: "cl-calendar-weekday",
  week: "cl-calendar-week",
};

createParts(datePicker, {
  root: {
    tag: "cl-date-picker",
    display: "block",
    defaults: { dismissible: true, closeOnSelect: true },
    kinds: popupKinds,
    options: () => ({ container: undefined }),
    state: popupState,
    api: [...popupApi, "setValue", "clear", "setMonth", "focus"],
    render(el: HTMLElement, instance) {
      const stopAnchor = followAnchor(el, "cl-date-picker-content", "cl-date-picker-trigger");
      const stopPaint = paintCalendar(el, instance as never, calendarTags);
      return () => {
        stopAnchor();
        stopPaint();
      };
    },
  },
  trigger: { tag: "cl-date-picker-trigger", display: "contents", target: wrappedButton },
  content: { tag: "cl-date-picker-content", kinds: popupKinds },
});

const owned = { owners: ["cl-date-picker"] };

createParts(calendar, {
  root: {
    tag: "cl-calendar",
    display: "block",
    api: ["getValue", "setValue", "setMonth", "previous", "next", "focus"],
    render: (el: HTMLElement, instance) => paintCalendar(el, instance as never, calendarTags),
  },
  heading: { tag: "cl-calendar-heading", display: "block", ...owned },
  previous: { tag: "cl-calendar-previous", display: "contents", target: wrappedButton, ...owned },
  next: { tag: "cl-calendar-next", display: "contents", target: wrappedButton, ...owned },
  grid: { tag: "cl-calendar-grid", display: "block", ...owned },
  weekdays: { tag: "cl-calendar-weekdays", display: "block", ...owned },
  weekday: { tag: "cl-calendar-weekday", display: "block", ...owned },
  week: { tag: "cl-calendar-week", display: "block", ...owned },
  day: { tag: "cl-calendar-day", display: "block", ...owned },
});

createParts(dateInput, {
  root: {
    tag: "cl-date-input",
    display: "block",
    api: ["getValue", "setValue", "clear", "focus"],
    render: (el: HTMLElement, instance) => paintSegments(el, instance as never, "cl-date-input-segment"),
  },
  segment: {
    tag: "cl-date-input-segment",
    display: "block",
    target: (el: HTMLElement) => el.querySelector("input") ?? el,
    context: (el: HTMLElement) => {
      const key = el.getAttribute("segment") ?? "";
      return { segment: { key }, id: key };
    },
    rebind: ["segment"],
  },
});

createParts(timeInput, {
  root: {
    tag: "cl-time-input",
    display: "block",
    api: ["getValue", "setValue", "clear", "focus"],
    render: (el: HTMLElement, instance) => paintSegments(el, instance as never, "cl-time-input-segment"),
  },
  segment: {
    tag: "cl-time-input-segment",
    display: "block",
    target: (el: HTMLElement) => el.querySelector("input") ?? el,
    context: (el: HTMLElement) => {
      const key = el.getAttribute("segment") ?? "";
      return { segment: { key }, id: key };
    },
    rebind: ["segment"],
  },
});
