// The popup primitive places content when it can. This covers the case where
// an overlay opens without the unpublished sheet/portal helpers: if the
// content still has no position, pin it under the trigger. Either way, keep
// the popup inside the viewport — flip above the trigger when that side has
// more room, and clamp to a margin.
const margin = 8;

export function followAnchor(root: HTMLElement, contentTag: string, triggerTag: string) {
  const place = () => {
    const content = root.querySelector(contentTag);
    const triggerHost = root.querySelector(triggerTag);
    if (!(content instanceof HTMLElement) || !(triggerHost instanceof HTMLElement)) return;
    if (content.hidden || content.hasAttribute("hidden")) return;
    const trigger = triggerHost.querySelector("button, a, input, textarea") ?? triggerHost;
    if (!(trigger instanceof HTMLElement)) return;

    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const maxWidth = Math.max(0, viewportWidth - margin * 2);
    content.style.boxSizing = "border-box";
    content.style.maxWidth = `${maxWidth}px`;

    if (content.offsetHeight === 0 && content.dataset.clAnchorRetry !== "1") {
      content.dataset.clAnchorRetry = "1";
      requestAnimationFrame(place);
      return;
    }
    content.dataset.clAnchorRetry = "0";

    const box = trigger.getBoundingClientRect();
    const styled = getComputedStyle(content);
    const ownsPlacement = content.dataset.clAnchor === "1";
    const primitivePlaced =
      !ownsPlacement &&
      content.style.position === "fixed" &&
      (content.style.top !== "" || styled.transform !== "none");
    const measured = content.getBoundingClientRect();
    const width = Math.min(measured.width || content.offsetWidth, maxWidth);
    const height = measured.height || content.offsetHeight;
    const outside =
      measured.left < margin - 1 ||
      measured.right > viewportWidth - margin + 1 ||
      measured.top < margin - 1 ||
      measured.bottom > viewportHeight - margin + 1;

    if (primitivePlaced && !outside) return;

    const spaceBelow = viewportHeight - box.bottom - margin;
    const spaceAbove = box.top - margin;
    const placeAbove = height + 6 > spaceBelow && spaceAbove > spaceBelow;
    let top = placeAbove ? box.top - height - 6 : box.bottom + 6;
    let left = box.left;
    if (left + width > viewportWidth - margin) left = viewportWidth - margin - width;
    if (left < margin) left = margin;
    if (top + height > viewportHeight - margin) top = viewportHeight - margin - height;
    if (top < margin) top = margin;

    const nextTop = `${Math.round(top)}px`;
    const nextLeft = `${Math.round(left)}px`;
    const nextMax = `${maxWidth}px`;
    if (
      content.dataset.clAnchor === "1" &&
      content.style.top === nextTop &&
      content.style.left === nextLeft &&
      content.style.maxWidth === nextMax
    ) {
      return;
    }
    content.dataset.clAnchor = "1";
    content.style.position = "fixed";
    content.style.zIndex = "60";
    content.style.right = "auto";
    content.style.bottom = "auto";
    content.style.top = nextTop;
    content.style.left = nextLeft;
  };
  const scheduled = () => requestAnimationFrame(place);
  const observer = new MutationObserver(scheduled);
  observer.observe(root, {
    subtree: true,
    attributes: true,
    attributeFilter: ["hidden", "data-open", "style", "popover"],
  });
  window.addEventListener("resize", scheduled);
  window.addEventListener("scroll", scheduled, true);
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", scheduled);
    window.removeEventListener("scroll", scheduled, true);
  };
}
