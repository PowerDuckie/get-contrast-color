# get-contrast-color

A **production-ready JavaScript/TypeScript library** to determine readable contrast text color for any CSS background — **including solid colors and gradients**.

Supports:

* `hex` / `rgb(a)` / `hsl(a)`
* `linear-gradient()` with multiple stops
* Custom contrast rule for **two-color 50/50 gradients** (auto-reverse)

Meets WCAG contrast guidelines for accessibility.

<img width="222" height="1748" alt="image" src="https://github.com/user-attachments/assets/b6b199b9-7ceb-46d9-9a5d-68da5e175eb4" />



## 📦 Installation

```bash
npm install get-contrast-color
```

or

```bash
yarn add get-contrast-color
```


## 🚀 Quick Usage

### Node.js / CommonJS

```js
const { getContrastColor } = require('get-contrast-color');

console.log(getContrastColor('#ff0000').color); // "#ffffff"
console.log(getContrastColor('rgb(240,240,240)').color); // "#000000"
console.log(getContrastColor('linear-gradient(90deg,#2563EB,#9C27B0)').color); // "#ffffff"
```

### ES Modules / TypeScript

```ts
import { getContrastColor } from 'get-contrast-color';

const result = getContrastColor('#1e293b');
console.log(result.color); // "#ffffff"
```


## 🧠 Special Feature — Contrast Mode

If input is a **ColorItem** with:

* `type: "contrast"`
* exactly **2 colors**
* both gradient positions **50% split**

Then it **reverses the colors** to ensure readable text.

Example:

```js
const contrastItem = {
  type: 'contrast',
  colors: ['#10B981', '#FFFBEB'],
  gradientAngle: '135deg',
  gradientPositions: ['50%', '50%']
};

console.log(getContrastColor(contrastItem));
```

Output format:

```js
{
  format: {
    usage: 'Text',
    type: 'gradient',
    colors: ['#FFFBEB', '#10B981'], // reversed
    gradientAngle: '135deg',
    gradientPositions: ['50%', '50%'],
    displayName: 'Contrast Reverse Color',
    value: 'ContrastReverseColor',
    description: 'Reversed for readable text'
  },
  color: 'linear-gradient(135deg, #FFFBEB 50%, #10B981 50%)'
}
```

💡 Perfect when backgrounds are dynamically selected by end-users.



## 📌 API

### `getContrastColor(input: string | ColorItem): GetContrastResult`

| Input Type         | Behavior                                        |
| ------------------ | ----------------------------------------------- |
| Solid color        | Returns best contrast as solid `#000/#fff`      |
| Gradient           | Uses average luminance → solid `#000/#fff`      |
| Contrast ColorItem | Returns **reversed gradient** + format metadata |
| Invalid input      | Safe fallback to `#000000`                      |

### Return Type (`GetContrastResult`)

```ts
interface GetContrastResult {
  color: string; // "#000000" | "#ffffff" | "linear-gradient(...)"
  format: {
    usage: 'Text';
    type: 'solid' | 'gradient';
    colors: string[];
    gradientAngle: string;
    gradientPositions: string[];
    displayName: string;
    value: string;
    description: string;
  };
}
```



## 👀 Real UI Example

React + inline style:

```tsx
const cardBg =
  'linear-gradient(45deg, #ff0 0%, #f06 100%)';

const { color: textColor } = getContrastColor(cardBg);

return (
  <div style={{ background: cardBg, color: textColor }}>
    Dynamic Contrast Text Demo
  </div>
);
```



## 🔒 Robustness

✔ Handles malformed colors
✔ Handles alpha (rgba/hsla)
✔ Graceful fallback
✔ No regex-only parsing — luminance-accurate



## ⚙ Build Outputs

* ESM (modern bundlers)
* CJS (Node.js)
* UMD (browsers)

```json
"main": "dist/index.cjs.js",
"module": "dist/index.esm.js",
"browser": "dist/index.umd.js"
```



## 🔑 License

MIT
