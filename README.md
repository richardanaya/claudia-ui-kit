# Claudia UI Kit

An editorial component library. The page is a plate: warm paper, near-black ink, one burnt orange, grotesk numerals, and monospace plate notes. Release `0.1.0`.

The parts are [UI SDK](https://ui-sdk.dev) primitives rendered as Web Components by `@ui-sdk/web` **0.1.0-beta.13**. There is no `@vercel/ui-sdk` package. The adapter does not use shadow DOM or CSS `::part`. Each part is a light-DOM custom element. Style it with `[data-slot]` and the `--ui-*` tokens. `data-slot` is the primitive name for a root and `name-slot` for the rest (`cl-spec-table-row`, not `cl-spec-row`).

## Use it

```ts
import "claudia-ui-kit/theme.css";
import "claudia-ui-kit";
```

`theme.css` includes the SDK's `web.css` and this kit's tokens. Interactive parts (`cl-button`, `cl-input`, `cl-toggle`, `cl-tabs`, `cl-dialog`, `cl-tooltip`) are the SDK primitives registered under `cl-*` tags, so keyboard behavior, focus, and roles come from the primitive.

```html
<cl-button>
  <button type="button" data-variant="orange">Mark the plate</button>
</cl-button>
```

Buttons, tabs, toggles, dialogs, and tooltips wrap a native `<button>`. Dialog and tooltip popups start with the `hidden` attribute.

## Use from CDN

The Pages build publishes a self-contained ESM bundle. The script brings the UI SDK with it, so the page needs no bundler and no import map. Fonts are in the CSS.

```html
<link rel="stylesheet" href="https://richardanaya.github.io/claudia-ui-kit/cdn/claudia-ui.css" />
<script type="module" src="https://richardanaya.github.io/claudia-ui-kit/cdn/claudia-ui.js"></script>

<cl-button>
  <button type="button" data-variant="orange">Mark the plate</button>
</cl-button>
```

Pin a release at `https://richardanaya.github.io/claudia-ui-kit/cdn/v0.1.0/claudia-ui.js` and the matching `.css`. The demo sheets are on the same site: `/`, `/gallery.html`, `/app.html`. `cdn-test.html` loads only those CDN files.

## Responsive

Parts stay inside the viewport. Each `[data-slot]` uses `min-width: 0` and `max-width: 100%`, and rows (`cl-toolbar`, `cl-menubar`, `cl-pagination`, `cl-breadcrumb`, segmented controls) wrap. Type, space, and the version hero use `clamp()`, so the release numerals shrink on a phone and keep their desktop size.

Under 720px the sheet drops its side gutters. The vertical margin notes become a top strip and a bottom strip, and the frame padding tightens so the plate is not a narrow column inside a wide border. Callout labels sit under the figure instead of running off it, and the ruler keeps every tick but labels every fourth one.

Popovers, menus, selects, drawers, and toasts use `max-width: calc(100vw - 1rem)`. Dialogs and alert dialogs become a full-width bottom sheet. `src/anchor.ts` flips a popup above its trigger when that side has more room, then clamps it to an 8px margin. Interactive controls are at least 44px tall on a narrow screen.

## Parts

`cl-sheet`, `cl-sheet-meta`, `cl-sheet-margin`, `cl-ruler`, `cl-crosshair`, `cl-star`, `cl-callout`, `cl-figure`, `cl-figure-media`, `cl-figure-caption`, `cl-version-hero`, `cl-spec-table`, `cl-spec-row`, `cl-spec-cell`, `cl-spec-label`, `cl-spec-value`, `cl-pill`, `cl-badge`, `cl-tag`, `cl-change-list`, `cl-change-item`, `cl-change-index`, `cl-change-title`, `cl-change-body`, `cl-barcode`, `cl-qr`, `cl-seal`, `cl-button`, `cl-field`, `cl-field-label`, `cl-field-description`, `cl-field-error`, `cl-input`, `cl-input-group`, `cl-input-clear`, `cl-toggle`, `cl-toggle-group`, `cl-tabs`, `cl-tabs-list`, `cl-tabs-tab`, `cl-tabs-panel`, `cl-dialog`, `cl-dialog-trigger`, `cl-dialog-backdrop`, `cl-dialog-content`, `cl-dialog-title`, `cl-dialog-description`, `cl-dialog-close`, `cl-tooltip`, `cl-tooltip-trigger`, `cl-tooltip-content`.

The same plate also registers the rest of the SDK primitives used here: checkbox, radio, switch, slider, select, combobox, autocomplete, listbox, segmented control, number input, password input, OTP input, file input, textarea, rating, alert dialog, drawer, popover, hover card, menu, menubar, trigger menu, toast, command, accordion, collapsible, separator, scroll area, resizable, avatar, progress, meter, pagination, navigation menu, toolbar, calendar, date picker, date input, and time input. Card, breadcrumb, alert, spinner, and skeleton are local plate parts. The full tag list is `components` in `src/catalog.ts` (217 tags).

`cl-badge` is the same pill primitive as `cl-pill` (a subclass, because one custom-element class cannot be registered twice). `cl-barcode` draws Code 128 set B. `cl-qr` draws a byte-mode QR symbol, levels L and M, versions 1–6.

Tokens live on `:root` as `--cl-paper`, `--cl-ink`, `--cl-orange`, `--cl-orange-text`, `--cl-font-display`, `--cl-font-mono`, and the type and space scale. Orange `#d97757` is for stars and filled pills. Small orange text uses `#9a3418`. Focus rings are 2px ink.

## SDK gaps

- The public adapter exports `createParts`, `wrappedButton`, and `wrappedChild`. It does not export `instanceOf`. A toggle group needs its full api, including `internal`, for arrow keys and roving tabindex, and `element.api` hides `internal`. The group element stores that api from `createParts`' `render` hook.
- Popup helpers used by the shipped tooltip and dialog registrations are not public. These tags use the documented `createParts` map. Dialogs still open in the top layer and trap focus. `src/anchor.ts` is a local fallback: if an overlay opens without a position, it pins the content under the trigger. The primitive's own placement wins when it sets one.
- `definePart` is not a public export, so a submenu is a second `createParts` root (`cl-menu-sub`) registered before the menu parts. Calendar day tags list `cl-date-picker` as an extra owner, which is the public `owners` option.
- Lists (select, combobox, command, menu, rating) are written markup. The shipped list renderer uses unpublished helpers.
- `PartDisplay` has no inline value. Inline layout is unlayered CSS on `[data-slot]`, which wins over the adapter's `@layer ui-sdk` display rules.
- A button's authored `type` is not preserved by this registration. Put `type="button"` on the inner button.
- `definePrimitive`'s return type is not portable under `declaration` (TS2742). The package ships a hand-written `types/index.d.ts` instead of emitted declarations.

## Scripts

Node 22 or newer.

```sh
npm install
npm run dev       # demo at http://127.0.0.1:4173, /gallery.html, and /app.html
npm run check     # types, unit tests, library build, CDN bundle, Pages site, Playwright
```

The demo poster is a release sheet for this kit. It does not reproduce another project's copy or photograph.

## License

[MIT](LICENSE). Copyright (c) 2026 Richard Anaya.
