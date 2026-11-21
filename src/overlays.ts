import { alertDialog } from "@ui-sdk/core/dialog";
import { command } from "@ui-sdk/core/command";
import { drawer } from "@ui-sdk/core/drawer";
import { hoverCard } from "@ui-sdk/core/hover-card";
import { menu } from "@ui-sdk/core/menu";
import { menubar } from "@ui-sdk/core/menubar";
import { popover } from "@ui-sdk/core/popover";
import { menuCheckable, menuContextTrigger } from "@ui-sdk/core/renderer";
import { toastRegion, type ToastItem } from "@ui-sdk/core/toast";
import { triggerMenu } from "@ui-sdk/core/trigger-menu";
import { createParts, wrappedButton, wrappedChild } from "@ui-sdk/web";
import { followAnchor } from "./anchor.js";
import { popupApi, popupKinds, popupState } from "./popup-state.js";

const menus = new WeakMap<Element, unknown>();
const bars = new WeakMap<Element, unknown>();

createParts(alertDialog, {
  root: {
    tag: "cl-alert-dialog",
    defaults: { dismissible: false },
    state: popupState,
    api: [...popupApi],
  },
  trigger: { tag: "cl-alert-dialog-trigger", target: wrappedButton, display: "contents" },
  backdrop: "cl-alert-dialog-backdrop",
  content: "cl-alert-dialog-content",
  title: "cl-alert-dialog-title",
  description: "cl-alert-dialog-description",
  close: { tag: "cl-alert-dialog-close", target: wrappedButton, display: "contents" },
});

createParts(drawer, {
  root: {
    tag: "cl-drawer",
    display: "block",
    defaults: { dismissible: true },
    state: popupState,
    api: [...popupApi],
  },
  trigger: { tag: "cl-drawer-trigger", target: wrappedButton, display: "contents" },
  close: { tag: "cl-drawer-close", target: wrappedButton, display: "contents" },
  backdrop: "cl-drawer-backdrop",
  viewport: "cl-drawer-viewport",
  content: {
    tag: "cl-drawer-content",
    render(el: HTMLElement) {
      if (el.parentElement?.localName === "cl-drawer-viewport") return;
      const viewport = document.createElement("cl-drawer-viewport");
      el.replaceWith(viewport);
      viewport.append(el);
    },
  },
  title: "cl-drawer-title",
  description: "cl-drawer-description",
  handle: "cl-drawer-handle",
});

createParts(popover, {
  root: {
    tag: "cl-popover",
    defaults: { dismissible: true },
    kinds: popupKinds,
    options: () => ({ container: undefined }),
    state: popupState,
    api: [...popupApi],
    render: (el: HTMLElement) => followAnchor(el, "cl-popover-content", "cl-popover-trigger"),
  },
  trigger: { tag: "cl-popover-trigger", target: wrappedButton, display: "contents" },
  content: { tag: "cl-popover-content", kinds: popupKinds },
  title: "cl-popover-title",
  description: "cl-popover-description",
  close: { tag: "cl-popover-close", target: wrappedButton, display: "contents" },
});

createParts(hoverCard, {
  root: {
    tag: "cl-hover-card",
    kinds: popupKinds,
    options: () => ({ container: undefined }),
    state: popupState,
    api: [...popupApi],
    render: (el: HTMLElement) => followAnchor(el, "cl-hover-card-content", "cl-hover-card-trigger"),
  },
  trigger: {
    tag: "cl-hover-card-trigger",
    display: "contents",
    target: (el: HTMLElement) =>
      (el.querySelector("a[href], button") as HTMLElement | null) ??
      (el.firstElementChild as HTMLElement | null),
  },
  content: { tag: "cl-hover-card-content", kinds: popupKinds },
});

const item = { tag: "cl-menu-item", display: "block" as const, defaults: { closeOnSelect: true } };

// A second root has to be registered first so later parts accept either tag
// as their owner. `definePart` is not a public package export.
createParts(menu, {
  root: {
    tag: "cl-menu-sub",
    display: "contents",
    kinds: { menubar: null, parent: null, container: null },
    options: (el: HTMLElement): any => ({
      parent: () => {
        const owner = el.parentElement?.closest("cl-menu, cl-menu-sub");
        return owner ? menus.get(owner) : undefined;
      },
    }),
    render(el, instance) {
      const api = (instance as { api?: unknown }).api;
      if (api) menus.set(el, api);
    },
  },
});

createParts(menu, {
  root: {
    tag: "cl-menu",
    defaults: { loop: true, dismissible: true },
    kinds: { ...popupKinds, menubar: null, parent: null },
    options: (el: HTMLElement) => ({
      container: undefined,
      menubar: () => {
        const bar = el.parentElement?.closest("cl-menubar");
        return (bar ? bars.get(bar) : undefined) as never;
      },
    }),
    state: popupState,
    api: [...popupApi],
    render(el: HTMLElement, instance) {
      const api = (instance as { api?: unknown }).api;
      if (api) menus.set(el, api);
      return followAnchor(el, "cl-menu-content", "cl-menu-trigger");
    },
  },
  trigger: { tag: "cl-menu-trigger", target: wrappedButton, display: "contents" },
  "context-trigger": {
    tag: "cl-menu-context-trigger",
    display: "contents",
    feature: menuContextTrigger,
    target: (el: HTMLElement) => (el.firstElementChild as HTMLElement | null) ?? el,
  },
  content: { tag: "cl-menu-content", kinds: popupKinds },
  item,
  "checkbox-item": { tag: "cl-menu-checkbox-item", display: "block", feature: menuCheckable },
  separator: { tag: "cl-menu-separator", display: "block" },
});

createParts(menubar, {
  root: {
    tag: "cl-menubar",
    display: "block",
    defaults: { loop: true },
    api: ["focus", "isOpen", "close"],
    render(el, instance) {
      const api = (instance as { api?: unknown }).api;
      if (api) bars.set(el, api);
    },
  },
});

createParts(triggerMenu, {
  root: {
    tag: "cl-trigger-menu",
    display: "block",
    options: (): any => ({ container: undefined, triggers: [{ char: "/" }] }),
    kinds: popupKinds,
    state: popupState,
    api: ["isOpen", "setOpen", "open", "close", "getQuery", "getMatch", "insert", "focus"],
    render: (el: HTMLElement) => followAnchor(el, "cl-trigger-menu-content", "cl-trigger-menu-input"),
  },
  input: {
    tag: "cl-trigger-menu-input",
    display: "contents",
    target: wrappedChild("textarea, input"),
  },
  content: { tag: "cl-trigger-menu-content", kinds: popupKinds },
  item: { tag: "cl-trigger-menu-item", display: "block" },
});

createParts(toastRegion, {
  root: {
    tag: "cl-toast-region",
    self: "region",
    display: "block",
    api: ["focus", "pause", "resume"],
    render(el: HTMLElement, instance) {
      const live = instance as unknown as {
        get: () => { items?: readonly ToastItem[] };
        subscribe: (fn: () => void) => () => void;
      };
      const draw = () => {
        for (const child of [...el.children]) {
          if (child.localName === "cl-toast") child.remove();
        }
        for (const item of live.get().items ?? []) {
          const toast = document.createElement("cl-toast");
          const record = item.toast as { id?: string; title?: string; description?: string };
          if (record.id) toast.setAttribute("toast", record.id);
          const title = document.createElement("cl-toast-title");
          title.textContent = record.title ?? "";
          const description = document.createElement("cl-toast-description");
          description.textContent = record.description ?? "";
          const close = document.createElement("cl-toast-close");
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = "Dismiss";
          close.append(button);
          toast.append(title, description, close);
          el.append(toast);
        }
      };
      draw();
      return live.subscribe(draw);
    },
  },
  toast: {
    tag: "cl-toast",
    slot: "root",
    display: "block",
    context: (el: HTMLElement) => ({ id: el.getAttribute("toast") || undefined }),
  },
  title: "cl-toast-title",
  description: "cl-toast-description",
  close: { tag: "cl-toast-close", target: wrappedButton, display: "contents" },
});

createParts(command, {
  root: {
    tag: "cl-command",
    display: "block",
    defaults: { autoHighlight: true, loop: true },
    state: {
      value: {
        get: (api: { getValue: () => string | null }) => api.getValue(),
        set: (api: { setValue: (value: string | null) => void }, value: string | null) => api.setValue(value),
      },
      query: {
        get: (api: { getQuery: () => string }) => api.getQuery(),
        set: (api: { setQuery: (query: string) => void }, query: string) => api.setQuery(query ?? ""),
      },
    },
    api: ["getValue", "setValue", "getQuery", "setQuery", "focus"],
  },
  input: { tag: "cl-command-input", display: "contents", target: wrappedChild("input") },
  list: { tag: "cl-command-list", display: "block" },
  item: { tag: "cl-command-item", display: "block" },
  empty: { tag: "cl-command-empty", display: "block" },
});

