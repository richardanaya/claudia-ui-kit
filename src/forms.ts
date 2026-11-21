import { autocomplete } from "@ui-sdk/core/autocomplete";
import { checkbox, checkboxGroup, type CheckboxGroupApi } from "@ui-sdk/core/checkbox";
import { combobox } from "@ui-sdk/core/combobox";
import { fileInput } from "@ui-sdk/core/file-input";
import { textarea } from "@ui-sdk/core/input";
import { listbox } from "@ui-sdk/core/listbox";
import { numberInput } from "@ui-sdk/core/number-input";
import { otpInput } from "@ui-sdk/core/otp-input";
import { passwordInput } from "@ui-sdk/core/password-input";
import { radioGroup } from "@ui-sdk/core/radio";
import { rating } from "@ui-sdk/core/rating";
import { segmentedControl } from "@ui-sdk/core/segmented-control";
import { select } from "@ui-sdk/core/select";
import { slider } from "@ui-sdk/core/slider";
import { switchPrimitive } from "@ui-sdk/core/switch";
import { createParts, wrappedButton, wrappedChild } from "@ui-sdk/web";
import { followAnchor } from "./anchor.js";
import { popupApi, popupKinds, popupState, rememberGroup } from "./popup-state.js";

const checkedApi = ["getChecked", "setChecked", "toggle", "focus"] as const;
const textApi = ["getValue", "setValue", "clear", "focus"] as const;

const textState = {
  value: {
    get: (api: any) => api.getValue(),
    set: (api: any, value: unknown) => api.setValue(value ?? ""),
  },
};

const liveValue = {
  value: {
    get: (api: any) => api.getValue(),
    set: (api: any, value: unknown) => api.setValue(value),
  },
};

const checkboxGroups = new WeakMap<Element, CheckboxGroupApi>();

createParts(checkboxGroup, {
  root: {
    tag: "cl-checkbox-group",
    self: "group",
    display: "block",
    formAssociated: true,
    state: {
      value: {
        get: (api: { getValue: () => string[] }) => api.getValue(),
        set: (api: { setValue: (value: string[]) => void }, value: string[]) => api.setValue(value ?? []),
      },
    },
    api: ["getValue", "setValue", "focus"],
    render: (el, instance) => {
      const api = (instance as { api?: CheckboxGroupApi }).api;
      if (api) checkboxGroups.set(el, api);
    },
  },
});

createParts(checkbox, {
  root: {
    tag: "cl-checkbox",
    formAssociated: true,
    kinds: { group: null },
    options: (el: HTMLElement) => ({
      group: () => {
        const owner = el.parentElement?.closest("cl-checkbox-group");
        return owner ? checkboxGroups.get(owner) : undefined;
      },
    }),
    state: {
      checked: {
        get: (api: any) => api.getChecked(),
        set: (api: any, checked: boolean) => api.setChecked(checked),
      },
    },
    api: [...checkedApi],
  },
  indicator: { tag: "cl-checkbox-indicator", display: "block" },
});

createParts(radioGroup, {
  root: {
    tag: "cl-radio-group",
    self: "group",
    display: "block",
    formAssociated: true,
    defaults: { loop: true },
    state: textState,
    api: ["getValue", "setValue", "focus"],
    render: (el, instance) => rememberGroup(el, instance as { api?: unknown }),
  },
  radio: { tag: "cl-radio", slot: "root", formAssociated: true },
  indicator: { tag: "cl-radio-indicator", display: "block" },
});

createParts(switchPrimitive, {
  root: {
    tag: "cl-switch",
    formAssociated: true,
    state: {
      checked: {
        get: (api: any) => api.getChecked(),
        set: (api: any, checked: boolean) => api.setChecked(!!checked),
      },
    },
    api: [...checkedApi],
  },
  thumb: { tag: "cl-switch-thumb", display: "block" },
});

createParts(slider, {
  root: {
    tag: "cl-slider",
    display: "block",
    formAssociated: true,
    kinds: { thumbInputId: null },
    state: {
      value: {
        get: (api: any) => api.getValue(),
        set: (api: any, value: number[]) => api.setValue(value),
      },
    },
    api: ["getValue", "setValue", "focus"],
  },
  control: { tag: "cl-slider-control", display: "block" },
  track: { tag: "cl-slider-track", display: "block" },
  indicator: { tag: "cl-slider-indicator", display: "block" },
  thumb: {
    tag: "cl-slider-thumb",
    display: "block",
    context: () => ({ index: 0, id: "0" }),
    render(el: HTMLElement) {
      if (el.querySelector("input")) return;
      const wrap = document.createElement("cl-slider-thumb-input");
      const input = document.createElement("input");
      input.setAttribute("aria-label", "Value");
      wrap.append(input);
      el.append(wrap);
    },
  },
  "thumb-input": {
    tag: "cl-slider-thumb-input",
    display: "contents",
    context: () => ({ index: 0, id: "0" }),
    target: (el: HTMLElement) => el.querySelector("input"),
  },
  value: { tag: "cl-slider-value", display: "block" },
});

createParts(select, {
  root: {
    tag: "cl-select",
    display: "block",
    defaults: { loop: true, dismissible: true },
    kinds: popupKinds,
    options: () => ({ container: undefined }),
    state: { ...textState, ...popupState },
    api: [...popupApi, "getValue", "setValue", "clear"],
    render: (el: HTMLElement) => followAnchor(el, "cl-select-content", "cl-select-trigger"),
  },
  label: { tag: "cl-select-label", display: "block" },
  trigger: { tag: "cl-select-trigger", display: "contents", target: wrappedButton },
  value: { tag: "cl-select-value", display: "block" },
  content: { tag: "cl-select-content", kinds: popupKinds },
  item: { tag: "cl-select-item", display: "block" },
});

createParts(combobox, {
  root: {
    tag: "cl-combobox",
    display: "block",
    defaults: { loop: true, dismissible: true },
    kinds: popupKinds,
    options: () => ({ container: undefined }),
    state: { ...textState, ...popupState },
    api: [...popupApi, "getValue", "setValue", "clear"],
    render: (el: HTMLElement) => followAnchor(el, "cl-combobox-content", "cl-combobox-input"),
  },
  input: { tag: "cl-combobox-input", display: "contents", target: wrappedChild("input") },
  trigger: { tag: "cl-combobox-trigger", display: "contents", target: wrappedChild("button") },
  content: { tag: "cl-combobox-content", kinds: popupKinds },
  item: { tag: "cl-combobox-item", display: "block" },
});

createParts(autocomplete, {
  root: {
    tag: "cl-autocomplete",
    display: "block",
    defaults: { loop: true, dismissible: true },
    kinds: popupKinds,
    options: () => ({ container: undefined }),
    state: { ...textState, ...popupState },
    api: [...popupApi, "getValue", "setValue", "clear"],
    render: (el: HTMLElement) => followAnchor(el, "cl-autocomplete-content", "cl-autocomplete-input"),
  },
  input: { tag: "cl-autocomplete-input", display: "contents", target: wrappedChild("input") },
  content: { tag: "cl-autocomplete-content", kinds: popupKinds },
  item: { tag: "cl-autocomplete-item", display: "block" },
});

createParts(listbox, {
  root: {
    tag: "cl-listbox",
    display: "block",
    formAssociated: true,
    defaults: { loop: true },
    state: textState,
    api: ["getValue", "setValue", "focus"],
  },
  item: { tag: "cl-listbox-item", display: "block" },
});

createParts(segmentedControl, {
  root: {
    tag: "cl-segmented-control",
    display: "block",
    formAssociated: true,
    defaults: { loop: true },
    state: textState,
    api: ["getValue", "setValue", "focus"],
  },
  item: { tag: "cl-segmented-control-item", formAssociated: true },
});

createParts(numberInput, {
  root: {
    tag: "cl-number-input",
    display: "block",
    formAssociated: true,
    kinds: { controlId: null },
    state: liveValue,
    api: ["getValue", "setValue", "increment", "decrement", "focus"],
  },
  group: { tag: "cl-number-input-group", display: "block" },
  control: {
    tag: "cl-number-input-control",
    display: "contents",
    target: (el: HTMLElement) => el.querySelector("input"),
  },
  increment: {
    tag: "cl-number-input-increment",
    display: "contents",
    target: (el: HTMLElement) => el.querySelector("button"),
  },
  decrement: {
    tag: "cl-number-input-decrement",
    display: "contents",
    target: (el: HTMLElement) => el.querySelector("button"),
  },
});

createParts(passwordInput, {
  root: {
    tag: "cl-password-input",
    display: "block",
    kinds: { controlId: null, autoComplete: null },
    children: { control: (el: HTMLElement) => el.querySelector("input") },
    state: {
      ...textState,
      visible: {
        get: (api: { isVisible: () => boolean }) => api.isVisible(),
        set: (api: { setVisible: (visible: boolean) => void }, visible: boolean) => api.setVisible(!!visible),
      },
    },
    api: ["getValue", "setValue", "clear", "isVisible", "setVisible", "toggleVisible", "focus"],
  },
  toggle: { tag: "cl-password-input-toggle", display: "contents", target: wrappedButton },
});

createParts(otpInput, {
  root: {
    tag: "cl-otp-input",
    display: "block",
    state: textState,
    api: [...textApi],
    render(el: HTMLElement) {
      if (el.querySelector("input")) return;
      const wrap = document.createElement("cl-otp-input-control");
      const input = document.createElement("input");
      input.setAttribute("aria-label", el.getAttribute("aria-label") || "One-time code");
      input.autocomplete = "one-time-code";
      wrap.append(input);
      el.prepend(wrap);
    },
  },
  control: {
    tag: "cl-otp-input-control",
    display: "contents",
    target: (el: HTMLElement) => el.querySelector("input"),
  },
  group: { tag: "cl-otp-input-group", display: "block" },
  slot: { tag: "cl-otp-input-slot", display: "block" },
});

createParts(fileInput, {
  root: {
    tag: "cl-file-input",
    display: "block",
    formAssociated: true,
    state: {
      value: {
        get: (api: any) => api.getValue(),
        set: (api: any, files: File[]) => api.setValue(files ?? []),
      },
    },
    api: ["getValue", "setValue", "clear", "open", "focus"],
    children: {
      input: (el: HTMLElement) => {
        const existing = el.querySelector(':scope > input[type="file"]');
        if (existing instanceof HTMLElement) return existing;
        const input = document.createElement("input");
        input.type = "file";
        el.append(input);
        return input;
      },
    },
    render(el: HTMLElement, instance) {
      const api = instance as unknown as {
        api: { getValue: () => readonly File[] };
        subscribe: (fn: () => void) => () => void;
      };
      const draw = () => {
        const list = el.querySelector("cl-file-input-list");
        if (!list) return;
        for (const child of [...list.children]) {
          if (child.tagName !== "TEMPLATE") child.remove();
        }
        for (const file of api.api.getValue() ?? []) {
          const item = document.createElement("cl-file-input-item");
          item.textContent = file.name;
          list.append(item);
        }
      };
      draw();
      return api.subscribe(draw);
    },
  },
  trigger: {
    tag: "cl-file-input-trigger",
    display: "contents",
    target: (el: HTMLElement) => el.querySelector("button"),
  },
  dropzone: { tag: "cl-file-input-dropzone", display: "block" },
  list: { tag: "cl-file-input-list", display: "block" },
  item: { tag: "cl-file-input-item", display: "block" },
  "item-remove": {
    tag: "cl-file-input-item-remove",
    display: "contents",
    target: (el: HTMLElement) => el.querySelector("button"),
  },
});

createParts(textarea, {
  root: {
    tag: "cl-textarea",
    display: "contents",
    children: { root: (el: HTMLElement) => el.querySelector(":scope > textarea") },
    silent: ["onSubmit"],
    state: textState,
    api: [...textApi],
  },
});

createParts(rating, {
  root: {
    tag: "cl-rating",
    display: "block",
    formAssociated: true,
    state: liveValue,
    api: ["getValue", "setValue", "focus"],
  },
  item: { tag: "cl-rating-item", display: "block" },
  radio: { tag: "cl-rating-radio", display: "block" },
});
