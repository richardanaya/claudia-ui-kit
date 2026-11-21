import { partState } from "@ui-sdk/core/renderer";

type Segment = { key: string; text?: string; editable?: boolean };

type SegmentInstance = {
  part: (slot: string, props?: Record<string, unknown>) => unknown;
  subscribe: (listener: () => void) => () => void;
};

export function paintSegments(root: HTMLElement, instance: SegmentInstance, tag: string) {
  let signature = "";
  const draw = () => {
    const state = partState(instance.part("root", {}) as never) as { segments?: Segment[] };
    const segments = state.segments ?? [];
    const next = segments.map(segment => `${segment.key}:${segment.text ?? ""}:${segment.editable}`).join("|");
    if (next === signature) return;
    signature = next;
    const template = root.querySelector(":scope > template");
    for (const child of [...root.querySelectorAll(`:scope > ${tag}`)]) child.remove();
    for (const segment of segments) {
      const node =
        template instanceof HTMLTemplateElement
          ? (template.content.firstElementChild?.cloneNode(true) as HTMLElement | null)
          : null;
      const part = node?.localName === tag ? node : document.createElement(tag);
      part.setAttribute("segment", segment.key);
      if (!segment.editable) {
        part.textContent = segment.text ?? "";
      } else if (!part.querySelector("input")) {
        const input = document.createElement("input");
        input.setAttribute("inputmode", "numeric");
        input.setAttribute("aria-label", segment.key);
        part.append(input);
      }
      root.append(part);
    }
  };
  draw();
  return instance.subscribe(draw);
}
