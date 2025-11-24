declare module 'get-contrast-color' {
    /**
     * Get readable contrast text color based on background
     * @param color CSS color string: hex, rgb(a), hsl(a), linear-gradient
     * @returns "#000000" | "#ffffff"
     */
    export function getContrastColor(color: string): '#000000' | '#ffffff';
}
