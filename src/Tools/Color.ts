import {GroupDTO} from "@/Types/GroupDTO";

/**
 * Generates a stable hexadecimal color from a list of groups.
 *
 * The result is deterministic: the same combination of `type`, `classe`, and
 * `name` will always produce the same color.
 *
 * @param inputs List of groups used to build the color fingerprint.
 * @returns A color in `#RRGGBB` format.
 */
export function generateColorFromStrings(inputs: GroupDTO[]): string {
    const combinedInput = inputs.map(item => item.type + item.classe + item.name).sort().join('|');

    let hash = 0;
    for (let i = 0; i < combinedInput.length; i++) {
        hash = combinedInput.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }

    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;

    const hue = Math.abs(hash) % 360;

    const saturation = 70;
    const lightness = 80;

    return hslToHex(hue, saturation, lightness);
}

/**
 * Converts an HSL color to hexadecimal format.
 *
 * @param h Hue (0-360).
 * @param s Saturation (0-100).
 * @param l Lightness (0-100).
 * @returns A color in `#RRGGBB` format.
 */
function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}