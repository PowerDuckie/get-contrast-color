const { toLower } = require('lodash');
const fontColorContrast = require('font-color-contrast');

/**
 * Compute relative luminance based on WCAG formula
 * Reference: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 * @param {number} r Red (0-255)
 * @param {number} g Green (0-255)
 * @param {number} b Blue (0-255)
 * @returns {number} luminance (0-1)
 */
function relativeLuminance(r, g, b) {
    const RsRGB = r / 255;
    const GsRGB = g / 255;
    const BsRGB = b / 255;

    const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Parse hex color to [r,g,b]
 * @param {string} color
 */
function parseHex(color) {
    let hex = color.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length !== 6) return null;
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Parse rgb() or rgba() to [r,g,b,a]
 */
function parseRgb(color) {
    const m = color.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)/i);
    if (!m) return null;
    const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    return [r, g, b, a];
}

/**
 * Parse hsl() or hsla() to [r,g,b,a]
 */
function parseHsl(color) {
    const m = color.match(/hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d*\.?\d+))?\s*\)/i);
    if (!m) return null;
    let h = parseInt(m[1]) / 360;
    let s = parseInt(m[2]) / 100;
    let l = parseInt(m[3]) / 100;
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;

    if (s === 0) {
        const val = Math.round(l * 255);
        return [val, val, val, a];
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}

/**
 * Generic parse color to [r,g,b,a?]
 * @param {string} color
 */
function parseColor(color) {
    color = color.trim();
    if (color.startsWith('#')) return parseHex(color);
    if (color.toLowerCase().startsWith('rgb')) return parseRgb(color);
    if (color.toLowerCase().startsWith('hsl')) return parseHsl(color);
    return null;
}

/**
 * Parse linear-gradient string into array of [r,g,b,a]
 * Supports multiple stops, rgba/hsla, gradients with percentage/length
 * @param {string} gradient
 */
function parseGradient(gradient) {
    if (!gradient.includes('gradient')) return [];
    // Remove outer linear-gradient(...)
    const content = gradient.slice(gradient.indexOf('(') + 1, gradient.lastIndexOf(')'));
    const stops = [];
    let depth = 0;
    let buffer = '';
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (char === '(') depth++;
        if (char === ')') depth--;
        if (char === ',' && depth === 0) {
            stops.push(buffer.trim());
            buffer = '';
        } else {
            buffer += char;
        }
    }
    if (buffer) stops.push(buffer.trim());

    const colors = [];
    for (const stop of stops) {
        const match = stop.match(/(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\))/);
        if (!match) continue;
        const rgb = parseColor(match[0]);
        if (rgb) colors.push(rgb);
    }
    return colors;
}

/**
 * Get readable contrast color: "#000000" or "#ffffff"
 * @param {string} color
 * @returns {"#000000"|"#ffffff"}
 */
function getContrastColor(color) {
    // 1. Try font-color-contrast first
    try {
        const result = toLower(fontColorContrast(color));
        if (result === '#000000' || result === '#ffffff') return result;
    } catch (e) { }

    // 2. Gradient
    if (/gradient/i.test(color)) {
        const rgbs = parseGradient(color);
        if (!rgbs.length) return '#000000';
        const avgLum = rgbs.reduce((sum, [r, g, b]) => sum + relativeLuminance(r, g, b), 0) / rgbs.length;
        return avgLum < 0.5 ? '#ffffff' : '#000000';
    }

    // 3. Solid color fallback
    const rgb = parseColor(color);
    if (!rgb) return '#000000';
    const [r, g, b] = rgb;
    return relativeLuminance(r, g, b) < 0.5 ? '#ffffff' : '#000000';
}

module.exports = { getContrastColor };
