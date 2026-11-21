import "./register.js";

export { UI_SDK_VERSION, components, type ComponentTag } from "./catalog.js";
export {
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
export { code128Modules, code128Svg, code128Symbols } from "./code128.js";
export { chooseQrVersion, qrMatrix, qrSvg } from "./qr.js";
export { createAgent, registerTools } from "@ui-sdk/web/agent";
export { observe } from "@ui-sdk/core/observe";
