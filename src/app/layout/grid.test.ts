import { alignOf, anchorOf, findFreeSpot, placeFromRect, rectFor, snap, step } from "./grid";

const area = { width: 1200, height: 800 };
const size = { width: 300, height: 100 };

describe("grade do palco", () => {
  it("a âncora vem do terço em que o ponto cai", () => {
    expect(anchorOf({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(anchorOf({ x: 0.5, y: 0.5 })).toEqual({ x: 0.5, y: 0.5 });
    expect(anchorOf({ x: 1, y: 1 })).toEqual({ x: 1, y: 1 });
    expect(alignOf({ x: 11 / 12, y: 0 })).toBe("end");
  });

  it("prende o ponto ao cruzamento mais próximo", () => {
    expect(snap({ x: 0.49, y: 0.07 })).toEqual({ x: 0.5, y: 0.125 });
    expect(snap({ x: -0.2, y: 1.4 })).toEqual({ x: 0, y: 1 });
  });

  it("o retângulo respeita a âncora", () => {
    expect(rectFor({ x: 1, y: 1 }, size, area)).toEqual({
      left: 900,
      top: 700,
      width: 300,
      height: 100,
    });
    expect(rectFor({ x: 0.5, y: 0.5 }, size, area).left).toBe(450);
  });

  it("um retângulo solto vira o ponto da grade do seu lado", () => {
    expect(placeFromRect({ left: 890, top: 10, width: 300, height: 100 }, area)).toEqual({
      x: 1,
      y: 0,
    });
  });

  it("acha o lugar livre mais próximo quando o pedido está ocupado", () => {
    const taken = rectFor({ x: 0, y: 0 }, size, area);
    const spot = findFreeSpot({ x: 0, y: 0 }, size, [taken], area);
    const rect = rectFor(spot, size, area);
    expect(rect.top >= taken.top + taken.height || rect.left >= taken.left + taken.width).toBe(
      true,
    );
  });

  it("o teclado pula por cima de quem está no caminho", () => {
    const blocker = rectFor({ x: 0, y: 2 / 8 }, size, area);
    const next = step({ x: 0, y: 1 / 8 }, { x: 0, y: 1 }, 1, size, [blocker], area);
    expect(next.y).toBeGreaterThan(2 / 8);
  });
});
