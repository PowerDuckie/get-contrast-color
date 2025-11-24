/**
 * types.d.ts
 * Type declarations for the get-contrast-color / colorUtils JS module.
 *
 * Keep these in sync with the JS implementation.
 */

/**
 * Usage category for a color entry.
 */
export type Usage = 'Text' | 'Background' | 'Primary';

/**
 * Color item type (how color is represented).
 */
export type ColorType = 'solid' | 'gradient' | 'contrast';

/**
 * A ColorItem-like object used by generateGradient / getContrastColor.
 */
export interface ColorItem {
    /** Human friendly name */
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

/**
 * The format object returned inside the result.
 * Mirrors a simplified ColorItem but often uses type 'solid' for returned font colors.
 */
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

/**
 * Unified result returned by getContrastColor
 */
export interface ContrastResult {
    /**
     * A ColorItem-like object describing the returned color/gradient.
     * For solid results, type === 'solid' and colors contains a single entry like '#000000'.
     * For contrast/gradient results, type === 'gradient' and colors is the gradient stop array.
     */
    format: ContrastFormat;
    /**
     * The CSS color string that can be used directly in styles.
     * Either a hex like '#000000' or a gradient string like 'linear-gradient(...)'.
     */
    color: string;
}

/* ---------------------------
   Exported functions (JS API)
   --------------------------- */

/**
 * Compute relative luminance for an RGB triplet (WCAG).
 * r,g,b range: 0-255
 */
export function relativeLuminance(r: number, g: number, b: number): number;

/**
 * Parse a CSS color token.
 * Accepts: '#fff', '#ffffff', 'rgb(...)', 'rgba(...)', 'hsl(...)', 'hsla(...)'
 * Returns either [r,g,b] or [r,g,b,a] (a optional), or null if parsing fails.
 */
export function parseColor(color: string): [number, number, number] | [number, number, number, number] | null;

/**
 * Parse a linear-gradient(...) string into an array of parsed color triplets (or quad).
 * Example: parseGradient('linear-gradient(135deg, #fff 50%, #000 50%)')
 * returns [ [255,255,255], [0,0,0] ]  (or with alpha if rgba/hsla)
 */
export function parseGradient(gradient: string): Array<[number, number, number] | [number, number, number, number]>;

/**
 * Build a CSS gradient string from a ColorItem-like object.
 * Returns null when input is invalid.
 */
export function generateGradient(colorItem: ColorItem): string | null;

/**
 * Given a ColorItem object or a CSS color string, returns a consistent ContrastResult:
 * - if input.type === 'contrast' -> returns reversed gradient for text (format + gradient str)
 * - if input is 'linear-gradient' with parsed stops -> returns luminance-based '#000000' or '#ffffff' as color
 * - if input is a solid color -> returns '#000000' or '#ffffff' based on luminance
 */
export function getContrastColor(input: string | ColorItem): ContrastResult;

/**
 * Utility: split the arguments inside linear-gradient(...) into top-level tokens (angle + stops).
 * Example: splitGradientArgs('linear-gradient(135deg, #fff 50%, rgba(0,0,0,0.5) 50%)') -> ['135deg', '#fff 50%', 'rgba(...) 50%']
 */
export function splitGradientArgs(gradient: string): string[];

/**
 * Extract the first color token out of a stop string.
 * e.g. extractColorToken('#fff 50%') -> '#fff'
 *       extractColorToken('rgba(1,2,3,0.5) 20%') -> 'rgba(1,2,3,0.5)'
 */
export function extractColorToken(stop: string): string | null;

/**
 * Reverse the stops in a linear-gradient string while preserving the angle.
 * Example: reverseGradientStops('linear-gradient(135deg, #a 50%, #b 50%)') -> 'linear-gradient(135deg, #b 50%, #a 50%)'
 */
export function reverseGradientStops(gradient: string): string;
