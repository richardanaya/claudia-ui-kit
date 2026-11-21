/** Eight-point registration star. Outer points sit on the cardinals and diagonals. */
export function starPoints(
  cx = 50,
  cy = 50,
  outer = 46,
  inner = 18,
  points = 8,
): string {
  const coords: string[] = [];
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    coords.push(
      `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`,
    );
  }
  return coords.join(" ");
}

export function starSvg(): string {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="${starPoints()}"/></svg>`;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
