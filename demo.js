const { getContrastColor } = require('./index');

console.log(getContrastColor('#ff0000')); // -> "#ffffff"
console.log(getContrastColor('rgb(240,240,240)')); // -> "#000000"
console.log(getContrastColor('linear-gradient(135deg, #2563EB 0%, #9C27B0 100%)')); // -> "#ffffff"
console.log(getContrastColor('linear-gradient(to right, rgba(255,255,255,0.5), rgb(240,240,240))')); // "#ffffff"
