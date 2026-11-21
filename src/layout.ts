import { accordion } from "@ui-sdk/core/accordion";
import { avatar } from "@ui-sdk/core/avatar";
import { collapsible } from "@ui-sdk/core/collapsible";
import { meter } from "@ui-sdk/core/meter";
import { progress } from "@ui-sdk/core/progress";
import { resizable } from "@ui-sdk/core/resizable";
import { scrollArea } from "@ui-sdk/core/scroll-area";
import { separator } from "@ui-sdk/core/separator";
import { createParts, wrappedButton } from "@ui-sdk/web";

createParts(accordion, {
  root: {
    tag: "cl-accordion",
    display: "block",
    defaults: { collapsible: true },
    api: ["getValue", "setValue", "isOpen", "open", "close", "toggle"],
  },
  item: { tag: "cl-accordion-item", display: "block" },
  header: {
    tag: "cl-accordion-header",
    display: "block",
    target: (el: HTMLElement) => (el.querySelector("h2, h3, h4") as HTMLElement | null) ?? el,
  },
  trigger: { tag: "cl-accordion-trigger", display: "contents", target: wrappedButton },
  panel: { tag: "cl-accordion-panel", display: "block" },
});

createParts(collapsible, {
  root: {
    tag: "cl-collapsible",
    display: "block",
    state: {
      open: {
        get: (api: { isOpen: () => boolean }) => api.isOpen(),
        set: (api: { setOpen: (open: boolean) => void }, open: boolean) => api.setOpen(!!open),
      },
    },
    api: ["isOpen", "setOpen", "toggle", "focus"],
  },
  trigger: { tag: "cl-collapsible-trigger", display: "contents", target: wrappedButton },
  panel: { tag: "cl-collapsible-panel", display: "block" },
});

createParts(separator, {
  root: { tag: "cl-separator", display: "block" },
});

createParts(scrollArea, {
  root: { tag: "cl-scroll-area", display: "block" },
  viewport: { tag: "cl-scroll-area-viewport", display: "block" },
  content: { tag: "cl-scroll-area-content", display: "block" },
  scrollbar: {
    tag: "cl-scroll-area-scrollbar",
    display: "block",
    context: (el: HTMLElement) => ({ id: el.getAttribute("orientation") ?? "vertical" }),
  },
  thumb: { tag: "cl-scroll-area-thumb", display: "block" },
});

createParts(resizable, {
  root: { tag: "cl-resizable", display: "block" },
  panel: {
    tag: "cl-resizable-panel",
    display: "block",
    kinds: { id: "string" },
  },
  handle: { tag: "cl-resizable-handle", display: "block" },
});

createParts(avatar, {
  root: {
    tag: "cl-avatar",
    display: "block",
    children: { image: (el: HTMLElement) => el.querySelector(":scope > img") },
    optionalChildren: ["image"],
  },
  fallback: { tag: "cl-avatar-fallback", display: "block" },
});

createParts(progress, {
  root: { tag: "cl-progress", display: "block" },
  track: { tag: "cl-progress-track", display: "block" },
  indicator: { tag: "cl-progress-indicator", display: "block" },
});

createParts(meter, {
  root: { tag: "cl-meter", display: "block" },
  track: { tag: "cl-meter-track", display: "block" },
  indicator: { tag: "cl-meter-indicator", display: "block" },
});
