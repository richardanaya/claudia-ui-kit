/** A `definePrimitive` result. Importing the package registers its `cl-*` element. */
export interface EditorialPrimitive {
  readonly name: string;
}

export const UI_SDK_VERSION: string;
export const components: readonly [
  "cl-sheet",
  "cl-sheet-meta",
  "cl-sheet-margin",
  "cl-ruler",
  "cl-crosshair",
  "cl-star",
  "cl-callout",
  "cl-figure",
  "cl-figure-media",
  "cl-figure-caption",
  "cl-version-hero",
  "cl-spec-table",
  "cl-spec-row",
  "cl-spec-cell",
  "cl-spec-label",
  "cl-spec-value",
  "cl-pill",
  "cl-badge",
  "cl-tag",
  "cl-change-list",
  "cl-change-item",
  "cl-change-index",
  "cl-change-title",
  "cl-change-body",
  "cl-barcode",
  "cl-qr",
  "cl-seal",
  "cl-button",
  "cl-field",
  "cl-field-label",
  "cl-field-description",
  "cl-field-error",
  "cl-input",
  "cl-input-group",
  "cl-input-clear",
  "cl-toggle",
  "cl-toggle-group",
  "cl-tabs",
  "cl-tabs-list",
  "cl-tabs-tab",
  "cl-tabs-panel",
  "cl-dialog",
  "cl-dialog-trigger",
  "cl-dialog-backdrop",
  "cl-dialog-content",
  "cl-dialog-title",
  "cl-dialog-description",
  "cl-dialog-close",
  "cl-tooltip",
  "cl-tooltip-trigger",
  "cl-tooltip-content",
];
export type ComponentTag = (typeof components)[number];

/** Editorial primitives. Registered as `cl-*` elements by importing the package. */
export const barcode: EditorialPrimitive;
export const callout: EditorialPrimitive;
export const changeList: EditorialPrimitive;
export const crosshair: EditorialPrimitive;
export const figure: EditorialPrimitive;
export const pill: EditorialPrimitive;
export const qr: EditorialPrimitive;
export const ruler: EditorialPrimitive;
export const seal: EditorialPrimitive;
export const sheet: EditorialPrimitive;
export const sheetMargin: EditorialPrimitive;
export const sheetMeta: EditorialPrimitive;
export const specTable: EditorialPrimitive;
export const star: EditorialPrimitive;
export const tag: EditorialPrimitive;
export const versionHero: EditorialPrimitive;

export function code128Symbols(text: string): number[];
export function code128Modules(text: string): number[];
export function code128Svg(text: string): string;

export type QrLevel = "L" | "M";
export function chooseQrVersion(text: string, level?: QrLevel): number;
export function qrMatrix(text: string, level?: QrLevel, version?: number): boolean[][];
export function qrSvg(text: string, level?: QrLevel): string;

export { createAgent, registerTools } from "@ui-sdk/web/agent";
export { observe } from "@ui-sdk/core/observe";
