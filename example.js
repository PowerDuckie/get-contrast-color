import { getContrastColor } from './dist/index.cjs.js';


console.log(getContrastColor('#0000ff')); // -> "#ffffff"
console.log(getContrastColor('rgb(240,240,240)')); // -> "#000000"
console.log(getContrastColor('rgb(255,0,0,0.5)')); // -> "#ffffff"
console.log(getContrastColor('linear-gradient(135deg, #2563EB 0%, #9C27B0 100%)')); // -> "#ffffff"
console.log(getContrastColor('linear-gradient(to right, rgba(255,0,0,0.5), hsla(240,100%,50%,0.5))')); // "#ffffff"
console.log(getContrastColor('linear-gradient(135deg, #f36a0fff 50%, #c7d8f3ff 50%)')); // "#00000"


// Solid color examples
console.log(getContrastColor('#ff0000')); // -> "#ffffff"
console.log(getContrastColor('rgb(240,240,240)')); // -> "#000000"
console.log(getContrastColor('hsl(120, 100%, 50%)')); // -> "#000000"

// Linear gradient examples
console.log(getContrastColor('linear-gradient(135deg, #2563EB 0%, #9C27B0 100%)')); // -> "#ffffff"
console.log(getContrastColor('linear-gradient(to right, rgba(255,0,0,0.5), hsla(240,100%,50%,0.5))')); // -> "#ffffff"
console.log(getContrastColor('linear-gradient(45deg, rgba(234, 220, 212, 1) 0%, rgba(240, 221, 207, 1) 100%)'));