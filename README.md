# get-contrast-color

A **production-ready JavaScript utility** that returns a readable text color (`#000000` or `#ffffff`) for any CSS background — including `hex`, `rgb(a)`, `hsl(a)` and `linear-gradient(...)`.
Designed for UI components, auto-generated share cards, banners, or any dynamic backgrounds where text contrast matters. Decisions follow WCAG relative-luminance principles.

---

![example](https://github.com/user-attachments/assets/7884b4b9-8dcd-4f08-83bc-61ab0cbfa626)

---

## Install

```bash
npm install get-contrast-color
# or
yarn add get-contrast-color
```

If you use the repo directly for development:

```bash
git clone https://github.com/your-repo/get-contrast-color
npm install
npm run build
```

---

## Quick usage (CommonJS)

```js
// CommonJS
const { getContrastColor } = require('get-contrast-color');

console.log(getContrastColor('#ff0000')); // -> "#ffffff"
console.log(getContrastColor('rgb(240,240,240)')); // -> "#000000"
console.log(getContrastColor('hsl(120, 100%, 50%)')); // -> "#000000"

// gradient
console.log(getContrastColor('linear-gradient(135deg, #2563EB 0%, #9C27B0 100%)')); // -> "#ffffff"
```

## Quick usage (ES Module)

```js
import { getContrastColor } from 'get-contrast-color';

console.log(getContrastColor('#ff0000')); // "#ffffff"
```

## Browser (UMD) usage

If you publish the UMD bundle and include it via script tag:

```html
<script src="https://unpkg.com/get-contrast-color/dist/index.umd.js"></script>
<script>
  // global name: GetContrastColor (configured in rollup)
  const c = GetContrastColor.getContrastColor('#2563EB');
  console.log(c); // "#ffffff"
</script>
```

---

## API

### `getContrastColor(input) => result`

**Signature (JS)**

```js
// input: one of:
getContrastColor(colorString)        // colorString: '#fff' | '#ffffff' | 'rgb(...)' | 'hsl(...)' | 'linear-gradient(...)'
getContrastColor(colorItemObject)    // colorItemObject: { type, colors, gradientAngle?, gradientPositions?, ... }
```

**Return**

* When used as a simple helper, returns `"#000000"` or `"#ffffff"` — the text color that provides better contrast.
* Internally (and in some project builds) there is also a structured return `{ format, color }` where:

  * `format` — a ColorItem-like descriptor for the returned color (useful for editors / UI),
  * `color` — the actual CSS value to apply (solid hex or `linear-gradient(...)`).

> **Note:** By default the npm package exposes `getContrastColor` returning the plain `"#000000"` / `"#ffffff"` convenience string. If you need the structured object, use `getContrastColorDetailed` (or the detailed export) if the distro exposes it — check `dist` for available exports in your build.

### Behavior details

1. **Solid colors** (`#hex`, `rgb()`, `hsl()`): computed using WCAG relative luminance. If luminance < 0.5 → `#ffffff`, else `#000000`.
2. **Gradients**: average luminance of parsed color stops is used to choose black or white.

   * Alpha channels are parsed and stops with transparency are handled by parsing RGBA/HSLA tokens.
3. **Contrast / two-color split gradients (50% / 50%)**:

   * If input is a `ColorItem` with `type: 'contrast'` (or a gradient string that is exactly two stops both at `50%`), the recommended approach is to use the *reversed gradient* as the text style (i.e., swap stops order) to maintain visual contrast across split backgrounds.
   * For these scenarios the library may return a gradient string to be used as the text fill.
4. **Parsing fallback**:

   * If parsing fails for some malformed input, the library falls back to `#000000` (safe default). When using the convenience API it returns the color string; structured API returns `{ format: fallbackFormat, color: '#000000' }`.

---

## TypeScript support

A `types.d.ts` is included with the package. You can import types in TS:

```ts
import { getContrastColor } from 'get-contrast-color';
import type { ColorItem } from 'get-contrast-color/types';

const bg: ColorItem = {
  type: 'contrast',
  colors: ['#10B981', '#FFFBEB'],
  gradientAngle: '135deg',
  gradientPositions: ['50%','50%']
};

const text = getContrastColor(bg); // "#000000" | "#ffffff" (or structured object if using detailed API)
```

---

## Examples

### 1. Solid color

```js
const bg = '#2563EB';
const textColor = getContrastColor(bg); // '#ffffff'
```

### 2. Gradient

```js
const bg = 'linear-gradient(45deg, #ff0 0%, #f06 100%)';
const textColor = getContrastColor(bg); // '#000000' or '#ffffff' depending on average luminance
```

### 3. Contrast split (reversed gradient for text)

```js
const contrastItem = {
  type: 'contrast',
  colors: ['#10B981', '#FFFBEB'],
  gradientAngle: '135deg',
  gradientPositions: ['50%', '50%']
};

// Depending on build, you may get a gradient string returned for text usage:
const result = getContrastColor(contrastItem);
console.log(result);
// => '#000000'  (or when using detailed API -> { format: {...reversed gradient...}, color: 'linear-gradient(135deg, #FFFBEB 50%, #10B981 50%)' })
```

---

## Edge cases & FAQ

**Q:** Does it support `conic-gradient` or `radial-gradient`?
**A:** Current focus is `linear-gradient`. Radial or conic gradients can be parsed similarly but are not the primary use-case in this package — you can open an issue if you need these.

**Q:** How are percentage stops handled?
**A:** The parser extracts color tokens and ignores non-color tokens for luminance calculation. For *uniform* split stops (e.g., both `50%`), the library uses reversal behavior for `contrast` types to produce readable text gradients.

**Q:** Can I use this on the client and server?
**A:** Yes — it’s pure JS and works in Node and browser bundlers.

---

## Contributing

Contributions welcome — please open issues or PRs on GitHub. A quick starter list:

1. Fork the repo
2. `npm install`
3. `npm run build`
4. Add tests / update README / create PR

---

## Changelog

See `CHANGELOG.md` (if present) or the GitHub releases for details.

---

## License

MIT
