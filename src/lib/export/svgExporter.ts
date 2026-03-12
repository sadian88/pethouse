/* eslint-disable @typescript-eslint/no-explicit-any */
import { HouseConfig } from '@/types';

const GAP = 20; // mm spacing between panels in layout

function buildLayout(makerjs: any, config: HouseConfig): any {
  const {
    width, height, depth, materialThickness, kerfCompensation,
    jointType, doorShape, doorWidth, doorHeight,
    hasVentilation, ventilationSize, style, roofAngle, roofOverhang,
  } = config;

  const t = materialThickness + kerfCompensation; // effective slot depth

  // ── Panel outline (flat or finger joint) ────────────────────────────────
  function rectPanel(w: number, h: number): any {
    return new makerjs.models.Rectangle(w, h);
  }

  function fingerPanel(w: number, h: number): any {
    const fingerSize = materialThickness * 2;
    const count = Math.max(2, Math.floor(w / fingerSize));
    const points: [number, number][] = [[0, 0]];
    for (let i = 0; i < count; i++) {
      const segW = w / count;
      const x1 = i * segW + segW / 2;
      const x2 = (i + 1) * segW;
      if (i % 2 === 0) {
        points.push([x1, 0], [x1, -t], [x2, -t], [x2, 0]);
      }
    }
    points.push([w, 0], [w, h], [0, h], [0, 0]);
    return { models: { outline: new makerjs.models.ConnectTheDots(true, points) } };
  }

  function panel(w: number, h: number): any {
    return jointType === 'finger' ? fingerPanel(w, h) : rectPanel(w, h);
  }

  // ── Door cutout path (centered at cx from left edge) ────────────────────
  function doorCutout(cx: number): any {
    const dx = cx - doorWidth / 2; // left edge of door

    if (doorShape === 'arch') {
      const straightH = doorHeight - doorWidth / 2;
      return {
        paths: {
          left:   new makerjs.paths.Line([dx, 0], [dx, straightH]),
          arc:    new makerjs.paths.Arc([cx, straightH], doorWidth / 2, 0, 180),
          right:  new makerjs.paths.Line([cx + doorWidth / 2, straightH], [cx + doorWidth / 2, 0]),
          bottom: new makerjs.paths.Line([cx + doorWidth / 2, 0], [dx, 0]),
        },
      };
    }

    if (doorShape === 'circular') {
      const r = doorWidth / 2;
      const cy = doorHeight / 2;
      return {
        paths: {
          q1: new makerjs.paths.Arc([cx, cy], r, 0, 90),
          q2: new makerjs.paths.Arc([cx, cy], r, 90, 180),
          q3: new makerjs.paths.Arc([cx, cy], r, 180, 270),
          q4: new makerjs.paths.Arc([cx, cy], r, 270, 360),
        },
      };
    }

    // rectangular
    return makerjs.model.move(new makerjs.models.Rectangle(doorWidth, doorHeight), [dx, 0]);
  }

  // ── Ventilation circles on a panel (depth × wallH) ──────────────────────
  function ventHoles(panelW: number, panelH: number): any | null {
    if (!hasVentilation) return null;
    const r = ventilationSize;
    const yPos = panelH * 0.75;
    // Match 3D positions: 30%, 50%, 70% along the wall
    const xPositions = [panelW * 0.3, panelW * 0.5, panelW * 0.7];
    const model: any = { models: {} };
    xPositions.forEach((x, i) => {
      model.models[`v${i}`] = {
        paths: {
          q1: new makerjs.paths.Arc([x, yPos], r, 0, 90),
          q2: new makerjs.paths.Arc([x, yPos], r, 90, 180),
          q3: new makerjs.paths.Arc([x, yPos], r, 180, 270),
          q4: new makerjs.paths.Arc([x, yPos], r, 270, 360),
        },
      };
    });
    return model;
  }

  function sideWall(panelW: number, panelH: number): any {
    const base = jointType === 'finger' ? fingerPanel(panelW, panelH) : { models: { outer: rectPanel(panelW, panelH) } };
    const vents = ventHoles(panelW, panelH);
    if (vents) (base as any).models = { ...((base as any).models ?? {}), vents };
    return base;
  }

  // ── CLASSIC ──────────────────────────────────────────────────────────────
  if (style === 'classic') {
    const wallH = Math.round(height * 0.65);
    const gableAngle = (roofAngle * Math.PI) / 180;
    const gableH = (width / 2) * Math.tan(gableAngle);
    const roofSlant = Math.sqrt((width / 2) ** 2 + gableH ** 2);
    const roofW = roofSlant + roofOverhang;
    const roofD = depth + roofOverhang * 2;

    const gableTriangle = {
      paths: {
        left:  new makerjs.paths.Line([0, 0], [width / 2, gableH]),
        right: new makerjs.paths.Line([width / 2, gableH], [width, 0]),
        base:  new makerjs.paths.Line([width, 0], [0, 0]),
      },
    };

    const frontWall: any = {
      models: {
        outer: panel(width, wallH),
        door: doorCutout(width / 2),
      },
    };

    const row1Y = 0;
    const row2Y = Math.max(depth, gableH) + GAP;
    const row3Y = row2Y + wallH + GAP;

    return {
      models: {
        floor:      makerjs.model.move(panel(width, depth),             [0, row1Y]),
        leftWall:   makerjs.model.move(sideWall(depth, wallH),          [width + GAP, row1Y]),
        rightWall:  makerjs.model.move(sideWall(depth, wallH),          [width + depth + GAP * 2, row1Y]),
        frontGable: makerjs.model.move(gableTriangle,                   [depth * 2 + width + GAP * 3, row1Y]),
        backGable:  makerjs.model.move(gableTriangle,                   [depth * 2 + width * 2 + GAP * 4, row1Y]),
        frontWall:  makerjs.model.move(frontWall,                       [0, row2Y]),
        backWall:   makerjs.model.move(panel(width, wallH),             [width + GAP, row2Y]),
        roofLeft:   makerjs.model.move(panel(roofW, roofD),             [0, row3Y]),
        roofRight:  makerjs.model.move(panel(roofW, roofD),             [roofW + GAP, row3Y]),
      },
    };
  }

  // ── MODERN ───────────────────────────────────────────────────────────────
  if (style === 'modern') {
    const overhang = 5;

    const frontWall: any = {
      models: {
        outer: panel(width, height),
        door: doorCutout(width / 2),
      },
    };

    const row1Y = 0;
    const row2Y = depth + GAP;
    const row3Y = row2Y + height + GAP;

    return {
      models: {
        floor:     makerjs.model.move(panel(width, depth),                           [0, row1Y]),
        leftWall:  makerjs.model.move(sideWall(depth, height),                       [width + GAP, row1Y]),
        rightWall: makerjs.model.move(sideWall(depth, height),                       [width + depth + GAP * 2, row1Y]),
        frontWall: makerjs.model.move(frontWall,                                     [0, row2Y]),
        backWall:  makerjs.model.move(panel(width, height),                          [width + GAP, row2Y]),
        roof:      makerjs.model.move(panel(width + overhang * 2, depth + overhang * 2), [0, row3Y]),
      },
    };
  }

  // ── A-FRAME ──────────────────────────────────────────────────────────────
  const panelLen = Math.sqrt((width / 2) ** 2 + height ** 2);

  const frontGable: any = {
    models: {
      outer: {
        paths: {
          left:  new makerjs.paths.Line([0, 0], [width / 2, height]),
          right: new makerjs.paths.Line([width / 2, height], [width, 0]),
          base:  new makerjs.paths.Line([width, 0], [0, 0]),
        },
      },
      door: doorCutout(width / 2),
    },
  };

  const backGable = {
    paths: {
      left:  new makerjs.paths.Line([0, 0], [width / 2, height]),
      right: new makerjs.paths.Line([width / 2, height], [width, 0]),
      base:  new makerjs.paths.Line([width, 0], [0, 0]),
    },
  };

  return {
    models: {
      floor:       makerjs.model.move(panel(width, depth),     [0, 0]),
      leftPanel:   makerjs.model.move(panel(panelLen, depth),  [width + GAP, 0]),
      rightPanel:  makerjs.model.move(panel(panelLen, depth),  [width + panelLen + GAP * 2, 0]),
      frontGable:  makerjs.model.move(frontGable,              [0, depth + GAP]),
      backGable:   makerjs.model.move(backGable,               [width + GAP, depth + GAP]),
    },
  };
}

export async function generateSVG(config: HouseConfig): Promise<string> {
  const makerjs = await import('makerjs');
  const layout = buildLayout(makerjs, config);
  return makerjs.exporter.toSVG(layout, {
    units: (makerjs as any).unitType?.Millimeter,
    strokeWidth: '0.5px',
    stroke: '#000000',
    fill: 'none',
    svgAttrs: { xmlns: 'http://www.w3.org/2000/svg' },
  } as any);
}

export async function generateDXF(config: HouseConfig): Promise<string> {
  const makerjs = await import('makerjs');
  const layout = buildLayout(makerjs, config);
  return (makerjs.exporter as any).toDXF(layout, {
    units: (makerjs as any).unitType?.Millimeter,
  });
}
