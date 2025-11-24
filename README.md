# get-contrast-color

A **production-ready JavaScript library** to get readable contrast text color (`#000000` or `#ffffff`) for any CSS background color, including **hex, rgb(a), hsl(a)**, and **linear-gradient**.  

Useful for generating cards, UI elements, or any dynamic backgrounds where text contrast is important, following **WCAG guidelines**.

<img width="222" height="1748" alt="image" src="https://github.com/user-attachments/assets/7884b4b9-8dcd-4f08-83bc-61ab0cbfa626" />


---

## Installation

```bash
npm install get-contrast-color
````

or

```bash
yarn add get-contrast-color
```

---

## Usage

```js
const { getContrastColor } = require('get-contrast-color');

// Solid color examples
console.log(getContrastColor('#ff0000')); // -> "#ffffff"
console.log(getContrastColor('rgb(240,240,240)')); // -> "#000000"
console.log(getContrastColor('hsl(120, 100%, 50%)')); // -> "#000000"

// Linear gradient examples
console.log(getContrastColor('linear-gradient(135deg, #2563EB 0%, #9C27B0 100%)')); // -> "#ffffff"
console.log(getContrastColor('linear-gradient(to right, rgba(255,0,0,0.5), hsla(240,100%,50%,0.5))')); // -> "#ffffff"
```

---

## API

### `getContrastColor(color: string): "#000000" | "#ffffff"`

**Parameters:**

| Parameter | Type   | Description                                                                           |
| --------- | ------ | ------------------------------------------------------------------------------------- |
| `color`   | string | CSS color string: `hex`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, or `linear-gradient()` |

**Returns:**

* `"#000000"` if the background is light
* `"#ffffff"` if the background is dark

**Notes:**

* For gradients, the average luminance of all color stops is used to determine contrast.
* Fully production-ready for dynamic backgrounds in UI applications.

---

## Features

* Supports solid colors: `#hex`, `rgb()`, `rgba()`, `hsl()`, `hsla()`
* Supports `linear-gradient` with multiple stops
* Handles rgba/hsla and alpha transparency
* Fallback mechanism if font-color-contrast fails
* Compatible with Node.js and frontend bundlers

---

## Example Use Case

```js
const cardBg = 'linear-gradient(45deg, #ff0 0%, #f06 100%)';
const textColor = getContrastColor(cardBg);

// Use it in your UI
const card = `<div style="background: ${cardBg}; color: ${textColor}">Hello World</div>`;
```

---

## License

MIT
