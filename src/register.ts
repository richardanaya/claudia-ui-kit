import { createParts } from "@ui-sdk/web";
import "./controls.js";
import {
  barcode,
  callout,
  changeList,
  crosshair,
  figure,
  pill,
  qr,
  ruler,
  seal,
  sheet,
  sheetMargin,
  sheetMeta,
  specTable,
  star,
  tag,
  versionHero,
} from "./primitives.js";

const block = { display: "block" } as const;

createParts(star, { root: { tag: "cl-star", display: "block" } });
createParts(crosshair, { root: { tag: "cl-crosshair", display: "block" } });
createParts(ruler, { root: { tag: "cl-ruler", ...block } });
createParts(sheet, { root: { tag: "cl-sheet", ...block } });
createParts(sheetMeta, { root: { tag: "cl-sheet-meta", ...block } });
createParts(sheetMargin, { root: { tag: "cl-sheet-margin", ...block } });
createParts(callout, { root: { tag: "cl-callout", ...block } });
createParts(figure, {
  root: { tag: "cl-figure", ...block },
  media: { tag: "cl-figure-media", ...block },
  caption: { tag: "cl-figure-caption", ...block },
});
createParts(versionHero, { root: { tag: "cl-version-hero", ...block } });
createParts(specTable, {
  root: { tag: "cl-spec-table", ...block },
  row: { tag: "cl-spec-row", ...block },
  cell: { tag: "cl-spec-cell", ...block },
  label: { tag: "cl-spec-label", ...block },
  value: { tag: "cl-spec-value", ...block },
});

const pillParts = createParts(pill, {
  root: { tag: "cl-pill", display: "block" },
});
if (
  typeof customElements !== "undefined" &&
  pillParts.Root &&
  !customElements.get("cl-badge")
) {
  // A custom element class can only be defined once. A subclass keeps the
  // same primitive, so both tags share the pill parts and styles.
  customElements.define("cl-badge", class extends pillParts.Root {});
}

createParts(tag, { root: { tag: "cl-tag", display: "block" } });
createParts(changeList, {
  root: { tag: "cl-change-list", ...block },
  item: { tag: "cl-change-item", ...block },
  index: { tag: "cl-change-index", ...block },
  title: { tag: "cl-change-title", ...block },
  body: { tag: "cl-change-body", ...block },
});
createParts(barcode, { root: { tag: "cl-barcode", ...block } });
createParts(qr, { root: { tag: "cl-qr", ...block } });
createParts(seal, { root: { tag: "cl-seal", display: "block" } });
