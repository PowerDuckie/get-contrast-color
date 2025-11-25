/**
 * Type declarations for get-contrast-color
 */

/** Usage category for a color entry */
export type Usage = 'Text' | 'Background' | 'Primary';

/** Color item type */
export type ColorType = 'solid' | 'gradient' | 'contrast';

/** A ColorItem-like object used by generateGradient / getContrastColor */
export interface ColorItem {
    /** Human-friendly name */
    displayName?: string;
    /** Unique id / programmatic name */
    value?: string;
    /** Usage category */
    usage?: Usage;
    /** Type of the color item */
    type: ColorType;
    /** Array of color tokens (hex, rgb(...), hsl(...), etc.) */
    colors: string[];
    /** Angle for gradients, e.g. '135deg' */
    gradientAngle?: string;
    /** Positions for gradient stops, e.g. ['0%','100%'] */
    gradientPositions?: string[];
    /** Short description for editors / docs */
    description?: string;
    /** Optional reference to another value (used in some configs) */
    contrastText?: string;
}

/** Format object returned inside the result */
export interface ContrastFormat {
    displayName: string;
    value: string;
    usage: Usage;
    type: 'solid' | 'gradient';
    colors: string[]; // one color for solid, or array for gradient
    gradientAngle: string;
    gradientPositions: string[];
    description?: string;
}

/** Unified result returned by getContrastColor */
export interface ContrastResult {
    format: ContrastFormat;
    color: string;
}

/** ---------------------------
 * JS API functions
 * --------------------------- */

/**
 * Compute relative luminance for an RGB triplet (WCAG)
 * r,g,b range: 0-255
 */
export function relativeLuminance(r: number, g: number, b: number): number;

/**
 * Parse a CSS color token.
 * Accepts: '#fff', '#ffffff', 'rgb(...)', 'rgba(...)', 'hsl(...)', 'hsla(...)'
 * Returns either [r,g,b] or [r,g,b,a] (a optional), or null if parsing fails
 */
export function parseColor(color: string): [number, number, number] | [number, number, number, number] | null;

/**
 * Parse a linear-gradient(...) string into an array of parsed color triplets (or quad)
 * Example: parseGradient('linear-gradient(135deg, #fff 50%, #000 50%)')
 * returns [ [255,255,255], [0,0,0] ]  (or with alpha if rgba/hsla)
 */
export function parseGradient(gradient: string): Array<[number, number, number] | [number, number, number, number]>;

/** Build a CSS gradient string from a ColorItem-like object */
export function generateGradient(colorItem: ColorItem): string | null;

/**
 * Given a ColorItem object or a CSS color string, returns a consistent ContrastResult
 * - if input.type === 'contrast' -> returns reversed gradient for text
 * - if input is linear-gradient -> returns luminance-based '#000000' or '#ffffff'
 * - if input is solid color -> returns '#000000' or '#ffffff' based on luminance
 */
export function getContrastColor(input: string | ColorItem): ContrastResult;

/** Split the arguments inside linear-gradient(...) into top-level tokens */
export function splitGradientArgs(gradient: string): string[];

/** Extract the first color token out of a stop string */
export function extractColorToken(stop: string): string | null;

/** Reverse the stops in a linear-gradient string while preserving the angle */
export function reverseGradientStops(gradient: string): string;

/** Default export (for import getContrastColor from 'get-contrast-color') */
export default getContrastColor;
