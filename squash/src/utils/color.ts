function hslToHex(hsl: number[]): string {
  let h = hsl[0],
    s = hsl[1],
    l = hsl[2];

  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateShadesFromHSL(hsl: number[], count: number): string[] {
  const shades: string[] = [];
  const h = hsl[0],
    s = hsl[1],
    l = hsl[2];

  for (let i = 0; i < count; i++) {
    const lightness = l + (i - Math.floor(count / 2)) * 10; // Adjust lightness for each shade
    shades.push(hslToHex([h, s, Math.min(Math.max(lightness, 0), 100)]));
  }

  return shades;
}

export default {
  hslToHex,
  generateShadesFromHSL,
};
