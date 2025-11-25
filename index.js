const { isObject } = require('lodash');

/**
 * Compute relative luminance based on WCAG formula.
 * Reference: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 * @param {number} r Red (0-255)
 * @param {number} g Green (0-255)
 * @param {number} b Blue (0-255)
 * @returns {number} luminance (0-1)
 */
export const relativeLuminance = (r, g, b) => {
    const RsRGB = r / 255;
    const GsRGB = g / 255;
    const BsRGB = b / 255;

    const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Parse hex color (#rgb or #rrggbb) to [r,g,b] */
export const parseHex = (color) => {
    if (typeof color !== 'string') return null;
    let hex = color.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length === 8) hex = hex.slice(0, 6);
    if (hex.length !== 6) return null;
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Parse rgb(...) or rgba(...) to [r,g,b,a] */
export const parseRgb = (color) => {
    if (typeof color !== 'string') return null;
    const m = color.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)/i);
    if (!m) return null;
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    const a = m[4] !== undefined ? Number(m[4]) : 1;
    return [r, g, b, a];
}

/** Parse hsl(...) or hsla(...) to [r,g,b,a] */
export const parseHsl = (color) => {
    if (typeof color !== 'string') return null;
    const m = color.match(/hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d*\.?\d+))?\s*\)/i);
    if (!m) return null;

    const h = (Number(m[1]) % 360) / 360;
    const s = Number(m[2]) / 100;
    const l = Number(m[3]) / 100;
    const a = m[4] !== undefined ? Number(m[4]) : 1;

    if (s === 0) {
        const v = Math.round(l * 255);
        return [v, v, v, a];
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const hue2rgb = (p0, q0, t) => {
        let tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p0 + (q0 - p0) * 6 * tt;
        if (tt < 1 / 2) return q0;
        if (tt < 2 / 3) return p0 + (q0 - p0) * (2 / 3 - tt) * 6;
        return p0;
    };

    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}

/** Generic parse color to [r,g,b,a?] */
export const parseColor = (color) => {
    if (!color || typeof color !== 'string') return null;
    const s = color.trim();
    if (s.startsWith('#')) return parseHex(s);
    if (/^rgba?\(/i.test(s)) return parseRgb(s);
    if (/^hsla?\(/i.test(s)) return parseHsl(s);
    return null;
}

/** Generate linear-gradient string from ColorItem */
export const generateGradient = (colorItem) => {
    if (!colorItem || !Array.isArray(colorItem.colors) || colorItem.colors.length === 0) return null;
    const { type, colors, gradientAngle = '180deg', gradientPositions } = colorItem;
    if (String(type) === 'solid') return String(colors[0]);
    const stops = colors
        .map((c, i) => {
            const pos = Array.isArray(gradientPositions) ? gradientPositions[i] : undefined;
            return pos ? `${c} ${pos}` : c;
        })
        .join(', ');
    return `linear-gradient(${gradientAngle}, ${stops})`;
}

/** Split gradient arguments */
export const splitGradientArgs = (gradient) => {
    if (typeof gradient !== 'string') return [];
    const start = gradient.indexOf('(');
    const end = gradient.lastIndexOf(')');
    if (start === -1 || end === -1 || end <= start) return [];
    const inner = gradient.slice(start + 1, end);
    const parts = [];
    let depth = 0;
    let buf = '';
    for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            parts.push(buf.trim());
            buf = '';
        } else {
            buf += ch;
        }
    }
    if (buf.trim() !== '') parts.push(buf.trim());
    return parts;
}

/** Extract first color token from stop string */
export const extractColorToken = (stop) => {
    if (!stop || typeof stop !== 'string') return null;
    const m = stop.match(/(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\))/i);
    return m ? m[0] : null;
}

/** Parse linear-gradient string into RGB arrays */
export const parseGradient = (gradient) => {
    if (typeof gradient !== 'string' || !/gradient/i.test(gradient)) return [];
    const args = splitGradientArgs(gradient);
    if (!args.length) return [];
    const firstArg = args[0];
    const hasAngle = /deg|rad|turn|to\s+/i.test(firstArg);
    const stops = hasAngle ? args.slice(1) : args;
    const parsed = [];
    for (const stop of stops) {
        const token = extractColorToken(stop);
        if (!token) continue;
        const rgb = parseColor(token);
        if (rgb) parsed.push(rgb);
    }
    return parsed;
}

/** Determine readable contrast color */
export const getContrastColor = (color) => {
    if (isObject(color)) {
        if (String(color.type) === 'contrast') {
            const reversedColors = Array.isArray(color.colors) ? [...color.colors].reverse() : [];
            const format = {
                ...color,
                displayName: `${color?.displayName ?? ''} Reverse Color`,
                value: `${color?.value ?? 'value'}ReverseColor`,
                usage: 'Text',
                colors: reversedColors
            };
            return {
                format,
                color: generateGradient(format)
            };
        }
        color = generateGradient(color);
    }

    let chosen = '#000000';

    if (typeof color === 'string') {
        if (/gradient/i.test(color)) {
            const rgbs = parseGradient(color);
            if (!rgbs.length) chosen = '#000000';
            else {
                const avgLum =
                    rgbs.reduce((sum, triplet) => sum + relativeLuminance(triplet[0], triplet[1], triplet[2]), 0) / rgbs.length;
                chosen = avgLum < 0.5 ? '#ffffff' : '#000000';
            }
        } else {
            const rgb = parseColor(color);
            if (!rgb) chosen = '#000000';
            else {
                const [r, g, b] = rgb;
                chosen = relativeLuminance(r, g, b) < 0.5 ? '#ffffff' : '#000000';
            }
        }
    }

    const displayName = chosen === '#000000' ? 'Black font color' : 'White font color';
    const value = chosen === '#000000' ? 'Black' : 'White';

    return {
        format: {
            displayName,
            value,
            usage: 'Text',
            type: 'solid',
            colors: [chosen],
            gradientAngle: '',
            gradientPositions: [],
            description: `${displayName}`
        },
        color: chosen
    };
}