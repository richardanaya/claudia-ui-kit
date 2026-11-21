// The popup primitive places content when it can. This covers the case where
// an overlay opens without the unpublished sheet/portal helpers: if the
// content still has no position, pin it under the trigger.
export function followAnchor(root: HTMLElement, contentTag: string, triggerTag: string) {
  const place = () => {
    const content = root.querySelector(contentTag);
    const triggerHost = root.querySelector(triggerTag);
    if (!(content instanceof HTMLElement) || !(triggerHost instanceof HTMLElement)) return;
    if (content.hasAttribute("hidden")) return;
    const trigger = triggerHost.querySelector("button, a, input, textarea") ?? triggerHost;
    if (!(trigger instanceof HTMLElement)) return;
    const box = trigger.getBoundingClientRect();
    const styled = getComputedStyle(content);
    const placed = content.style.top !== "" || styled.transform !== "none";
    if (placed && content.style.position === "fixed") return;
    const top = Math.round(box.bottom + 6);
    const left = Math.max(8, Math.round(box.left));
    content.style.position = "fixed";
    content.style.zIndex = "60";
    content.style.top = `${top}px`;
    content.style.left = `${left}px`;
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
