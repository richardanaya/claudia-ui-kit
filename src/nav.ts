import { navigationMenu } from "@ui-sdk/core/navigation-menu";
import { pagination } from "@ui-sdk/core/pagination";
import { toolbar } from "@ui-sdk/core/toolbar";
import { createParts, wrappedButton, wrappedChild } from "@ui-sdk/web";
import { followAnchor } from "./anchor.js";
import { popupKinds } from "./popup-state.js";

createParts(pagination, {
  root: {
    tag: "cl-pagination",
    display: "block",
    state: {
      page: {
        get: (api: { getPage: () => number }) => api.getPage(),
        set: (api: { setPage: (page: number) => void }, page: number) => api.setPage(page),
      },
    },
    api: ["getPage", "getPageCount", "setPage", "next", "previous", "first", "last"],
  },
  list: { tag: "cl-pagination-list", display: "block" },
  item: { tag: "cl-pagination-item", display: "block" },
  link: { tag: "cl-pagination-link", display: "contents", target: wrappedButton },
  previous: { tag: "cl-pagination-previous", display: "contents", target: wrappedButton },
  next: { tag: "cl-pagination-next", display: "contents", target: wrappedButton },
});

createParts(navigationMenu, {
  root: {
    tag: "cl-navigation-menu",
    display: "block",
    kinds: popupKinds,
    options: () => ({ container: undefined }),
    render: (el: HTMLElement) => followAnchor(el, "cl-navigation-menu-content", "cl-navigation-menu-trigger"),
  },
  list: { tag: "cl-navigation-menu-list", display: "block" },
  item: { tag: "cl-navigation-menu-item", display: "block" },
  trigger: { tag: "cl-navigation-menu-trigger", display: "contents", target: wrappedButton },
  content: { tag: "cl-navigation-menu-content", kinds: popupKinds },
  link: { tag: "cl-navigation-menu-link", display: "contents", target: wrappedChild("a") },
});

createParts(toolbar, {
  root: {
    tag: "cl-toolbar",
    display: "block",
    defaults: { loop: true },
    api: ["focus"],
  },
  button: { tag: "cl-toolbar-button", display: "contents", target: wrappedButton },
  separator: { tag: "cl-toolbar-separator", display: "block" },
  input: { tag: "cl-toolbar-input", display: "contents", target: wrappedChild("input, textarea") },
});
