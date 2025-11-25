export type Usage = 'Text' | 'Background' | 'Primary';
export type ColorType = 'solid' | 'gradient' | 'contrast';

export interface ColorItem {
    displayName?: string;
    value?: string;
    usage?: Usage;
    type: ColorType;
    colors: string[];
    gradientAngle?: string;
    gradientPositions?: string[];
    description?: string;
    contrastText?: string;
}

export interface ContrastFormat {
    displayName: string;
    value: string;
    usage: Usage;
    type: 'solid' | 'gradient';
    colors: string[];
    gradientAngle: string;
    gradientPositions: string[];
    description?: string;
}

export interface ContrastResult {
    format: ContrastFormat;
    color: string;
}

/** JS API */
export function relativeLuminance(r: number, g: number, b: number): number;
export function parseColor(color: string): [number, number, number] | [number, number, number, number] | null;
export function parseGradient(gradient: string): Array<[number, number, number] | [number, number, number, number]>;
export function generateGradient(colorItem: ColorItem): string | null;
export function getContrastColor(input: string | ColorItem): ContrastResult;
export function splitGradientArgs(gradient: string): string[];
export function extractColorToken(stop: string): string | null;
export function reverseGradientStops(gradient: string): string;

/** default export */
declare const getContrastColorDefault: typeof getContrastColor;
export default getContrastColorDefault;
