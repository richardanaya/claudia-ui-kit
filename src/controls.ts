import { button } from "@ui-sdk/core/button";
import { dialog } from "@ui-sdk/core/dialog";
import { field } from "@ui-sdk/core/field";
import { input, inputGroup } from "@ui-sdk/core/input";
import { tabs } from "@ui-sdk/core/tabs";
import { toggle, toggleGroup, type ToggleGroupApi } from "@ui-sdk/core/toggle";
import { tooltip } from "@ui-sdk/core/tooltip";
import { createParts, wrappedButton, wrappedChild } from "@ui-sdk/web";
import { followAnchor } from "./anchor.js";
import "./forms.js";
import "./overlays.js";
import "./layout.js";
import "./nav.js";
import "./dates.js";

// `instanceOf` is not exported, and a second copy of the adapter cannot see
// the group. The owner render hook is the public way to keep the full api,
// including `internal`, which arrow keys and roving tabindex need.
const toggleGroups = new WeakMap<Element, ToggleGroupApi>();

createParts(button, {
  root: {
    tag: "cl-button",
    target: wrappedButton,
    display: "contents",
  },
});

createParts(field, {
  root: { tag: "cl-field", display: "block" },
  label: { tag: "cl-field-label", display: "block" },
  description: { tag: "cl-field-description", display: "block" },
  error: { tag: "cl-field-error", display: "block" },
});

createParts(input, {
  root: {
    tag: "cl-input",
    display: "contents",
    children: { root: (el: HTMLElement) => el.querySelector(":scope > input") },
    state: {
      value: {
        get: (api: { getValue: () => string }) => api.getValue(),
        set: (api: { setValue: (value: string) => void }, value: string) =>
          api.setValue(value ?? ""),
      },
    },
    api: ["getValue", "setValue", "clear", "focus"],
  },
});

createParts(inputGroup, {
  root: { tag: "cl-input-group", self: "group", display: "block" },
  clear: {
    tag: "cl-input-clear",
    display: "contents",
    target: wrappedChild("button"),
  },
});

createParts(toggleGroup, {
  root: {
    tag: "cl-toggle-group",
    self: "group",
    display: "block",
    defaults: { deselectable: true, loop: true },
    state: {
      value: {
        get: (api: { getValue: () => string[] }) => api.getValue(),
        set: (api: { setValue: (value: string[]) => void }, value: string[]) =>
          api.setValue(value ?? []),
      },
    },
    api: ["getValue", "setValue", "isPressed", "toggle", "focus"],
    render: (el, instance) => {
      const api = (instance as { api?: ToggleGroupApi }).api;
      if (api) toggleGroups.set(el, api);
    },
  },
});

createParts(toggle, {
  root: {
    tag: "cl-toggle",
    target: wrappedButton,
    display: "contents",
    kinds: { group: null, toolbar: null },
    options: (el: HTMLElement) => ({
      group: () => {
        const owner = el.parentElement?.closest("cl-toggle-group");
        return owner ? toggleGroups.get(owner) : undefined;
      },
    }),
    state: {
      pressed: {
        get: (api: { isPressed: () => boolean }) => api.isPressed(),
        set: (api: { setPressed: (pressed: boolean) => void }, pressed: boolean) =>
          api.setPressed(!!pressed),
      },
    },
    api: ["isPressed", "setPressed", "toggle", "focus"],
  },
});

createParts(tabs, {
  root: {
    tag: "cl-tabs",
    display: "block",
    defaults: { loop: true },
    state: {
      value: {
        get: (api: { getValue: () => string | null }) => api.getValue(),
        set: (api: { setValue: (value: string | null) => void }, value: string | null) =>
          api.setValue(value),
      },
    },
    api: ["getValue", "setValue", "select", "focus"],
  },
  list: { tag: "cl-tabs-list", display: "block" },
  tab: {
    tag: "cl-tabs-tab",
    display: "contents",
    target: wrappedButton,
    render: (el: HTMLElement) => el.setAttribute("role", "none"),
  },
  panel: { tag: "cl-tabs-panel", display: "block" },
});

createParts(dialog, {
  root: "cl-dialog",
  trigger: { tag: "cl-dialog-trigger", target: wrappedButton, display: "contents" },
  backdrop: "cl-dialog-backdrop",
  content: "cl-dialog-content",
  title: "cl-dialog-title",
  description: "cl-dialog-description",
  close: { tag: "cl-dialog-close", target: wrappedButton, display: "contents" },
});

createParts(tooltip, {
  root: {
    tag: "cl-tooltip",
    defaults: { closeOnPress: true },
    render: (el: HTMLElement) => followAnchor(el, "cl-tooltip-content", "cl-tooltip-trigger"),
  },
  trigger: {
    tag: "cl-tooltip-trigger",
    display: "contents",
    target: (el: HTMLElement) =>
      (el.querySelector("button, a[href]") as HTMLElement | null) ??
      (el.firstElementChild as HTMLElement | null),
  },
  content: "cl-tooltip-content",
});
