import * as THREE from 'three';
import { HouseConfig } from '@/types';

/**
 * Converts mm config values to Three.js units (we use 1 unit = 10mm)
 */
const mm = (v: number) => v / 100;

export interface HouseParts {
  floor: THREE.BufferGeometry;
  frontWall: THREE.BufferGeometry;
  backWall: THREE.BufferGeometry;
  leftWall: THREE.BufferGeometry;
  rightWall: THREE.BufferGeometry;
  roof: THREE.BufferGeometry[];
}

export function generateClassicHouse(config: HouseConfig): THREE.Group {
  const group = new THREE.Group();
  const { width, height, depth, materialThickness, roofAngle, roofOverhang } = config;

  const t = mm(materialThickness);
  const w = mm(width);
  const h = mm(height);
  const d = mm(depth);
  const overhang = mm(roofOverhang);

  // Wall height (below roof ridge)
  const wallH = h * 0.65;
  // Ridge height above walls
  const ridgeH = h - wallH;

  const woodMat = new THREE.MeshStandardMaterial({
    color: '#c8a57a',
    roughness: 0.75,
    metalness: 0.0,
    envMapIntensity: 0.4,
  });

  // Floor
  const floorGeo = new THREE.BoxGeometry(w, t, d);
  const floor = new THREE.Mesh(floorGeo, woodMat);
  floor.castShadow = true;
  floor.receiveShadow = true;
  floor.position.set(0, t / 2, 0);
  floor.name = 'floor';
  group.add(floor);

  // Back wall
  const backGeo = new THREE.BoxGeometry(w, wallH, t);
  const backWall = new THREE.Mesh(backGeo, woodMat);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  backWall.position.set(0, t + wallH / 2, -d / 2 + t / 2);
  backWall.name = 'backWall';
  group.add(backWall);

  // Left wall
  const leftGeo = new THREE.BoxGeometry(t, wallH, d);
  const leftWall = new THREE.Mesh(leftGeo, woodMat);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  leftWall.position.set(-w / 2 + t / 2, t + wallH / 2, 0);
  leftWall.name = 'leftWall';
  group.add(leftWall);

  // Right wall
  const rightGeo = new THREE.BoxGeometry(t, wallH, d);
  const rightWall = new THREE.Mesh(rightGeo, woodMat);
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  rightWall.position.set(w / 2 - t / 2, t + wallH / 2, 0);
  rightWall.name = 'rightWall';
  group.add(rightWall);

  // Front wall (with door cutout via shape)
  const frontShape = new THREE.Shape();
  frontShape.moveTo(-w / 2, 0);
  frontShape.lineTo(w / 2, 0);
  frontShape.lineTo(w / 2, wallH);
  frontShape.lineTo(-w / 2, wallH);
  frontShape.closePath();

  // Door hole
  const doorW = mm(config.doorWidth);
  const doorH = mm(config.doorHeight);
  const doorX = -doorW / 2;
  const doorHole = new THREE.Path();
  if (config.doorShape === 'arch') {
    doorHole.moveTo(doorX, 0);
    doorHole.lineTo(doorX, doorH - doorW / 2);
    doorHole.absarc(0, doorH - doorW / 2, doorW / 2, Math.PI, 0, true);
    doorHole.lineTo(doorX + doorW, 0);
    doorHole.closePath();
  } else if (config.doorShape === 'circular') {
    doorHole.absarc(0, doorH / 2 + 0.05, doorW / 2, 0, Math.PI * 2, false);
  } else {
    doorHole.moveTo(doorX, 0);
    doorHole.lineTo(doorX + doorW, 0);
    doorHole.lineTo(doorX + doorW, doorH);
    doorHole.lineTo(doorX, doorH);
    doorHole.closePath();
  }
  frontShape.holes.push(doorHole);

  const frontGeo = new THREE.ShapeGeometry(frontShape);
  // Extrude for thickness
  const frontExtrudeGeo = new THREE.ExtrudeGeometry(frontShape, {
    depth: t,
    bevelEnabled: false,
  });
  const frontWall = new THREE.Mesh(frontExtrudeGeo, woodMat);
  frontWall.castShadow = true;
  frontWall.receiveShadow = true;
  // Shape coords go from -w/2 to +w/2, so mesh must be at x=0 (not -w/2)
  frontWall.position.set(0, t, d / 2 - t);
  frontWall.name = 'frontWall';
  group.add(frontWall);

  // Gable triangles
  const gableAngleRad = (roofAngle * Math.PI) / 180;
  const gableHeight = (w / 2) * Math.tan(gableAngleRad);

  const gableShape = new THREE.Shape();
  gableShape.moveTo(-w / 2, 0);
  gableShape.lineTo(w / 2, 0);
  gableShape.lineTo(0, gableHeight);
  gableShape.closePath();

  const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: t, bevelEnabled: false });

  const frontGable = new THREE.Mesh(gableGeo, woodMat);
  frontGable.castShadow = true;
  frontGable.receiveShadow = true;
  frontGable.position.set(0, t + wallH, d / 2);
  frontGable.rotation.y = Math.PI;
  frontGable.name = 'frontGable';
  group.add(frontGable);

  const backGable = new THREE.Mesh(gableGeo, woodMat);
  backGable.castShadow = true;
  backGable.receiveShadow = true;
  backGable.position.set(0, t + wallH, -d / 2 + t);
  backGable.name = 'backGable';
  group.add(backGable);

  // Roof panels
  const roofLength = Math.sqrt((w / 2) ** 2 + gableHeight ** 2);
  const roofGeo = new THREE.BoxGeometry(roofLength + overhang, t, d + overhang * 2);
  const roofMat = new THREE.MeshStandardMaterial({ color: '#7a4f2e', roughness: 0.85, metalness: 0.05 });

  const roofAngleActual = Math.atan2(gableHeight, w / 2);

  const leftRoof = new THREE.Mesh(roofGeo, roofMat);
  leftRoof.castShadow = true;
  leftRoof.receiveShadow = true;
  leftRoof.rotation.z = roofAngleActual;
  leftRoof.position.set(
    -(w / 4) + Math.sin(roofAngleActual) * t,
    t + wallH + gableHeight / 2,
    0
  );
  leftRoof.name = 'leftRoof';
  group.add(leftRoof);

  const rightRoof = new THREE.Mesh(roofGeo, roofMat);
  rightRoof.castShadow = true;
  rightRoof.receiveShadow = true;
  rightRoof.rotation.z = -roofAngleActual;
  rightRoof.position.set(
    w / 4 - Math.sin(roofAngleActual) * t,
    t + wallH + gableHeight / 2,
    0
  );
  rightRoof.name = 'rightRoof';
  group.add(rightRoof);

  // Ventilation holes (left/right walls)
  if (config.hasVentilation) {
    const vr = mm(config.ventilationSize);
    const ventGeo = new THREE.CylinderGeometry(vr, vr, t * 2, 16);
    const ventMat = new THREE.MeshStandardMaterial({ color: '#333' });
    for (let i = -1; i <= 1; i++) {
      const ventL = new THREE.Mesh(ventGeo, ventMat);
      ventL.castShadow = true;
      ventL.receiveShadow = true;
      ventL.rotation.z = Math.PI / 2;
      ventL.position.set(-w / 2, t + wallH * 0.75, i * d * 0.2);
      group.add(ventL);

      const ventR = new THREE.Mesh(ventGeo, ventMat);
      ventR.castShadow = true;
      ventR.receiveShadow = true;
      ventR.rotation.z = Math.PI / 2;
      ventR.position.set(w / 2, t + wallH * 0.75, i * d * 0.2);
      group.add(ventR);
    }
  }

  // Elevated floor legs
  if (config.hasElevatedFloor) {
    const legH = mm(config.floorElevation);
    const legGeo = new THREE.BoxGeometry(t, legH, t);
    const legPositions = [
      [-w / 2 + t, 0, -d / 2 + t],
      [w / 2 - t, 0, -d / 2 + t],
      [-w / 2 + t, 0, d / 2 - t],
      [w / 2 - t, 0, d / 2 - t],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.castShadow = true;
      leg.receiveShadow = true;
      leg.position.set(x, legH / 2, z);
      group.add(leg);
    });
    group.position.y = legH;
  }

  return group;
}

export function generateModernHouse(config: HouseConfig): THREE.Group {
  const group = new THREE.Group();
  const { width, height, depth, materialThickness } = config;
  const t = mm(materialThickness);
  const w = mm(width);
  const h = mm(height);
  const d = mm(depth);

  const woodMat = new THREE.MeshStandardMaterial({ color: '#c8a57a', roughness: 0.75, metalness: 0.0 });
  const roofMat = new THREE.MeshStandardMaterial({ color: '#4a4a4a', roughness: 0.6, metalness: 0.1 });

  // Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), woodMat);
  floor.castShadow = true;
  floor.receiveShadow = true;
  floor.position.y = t / 2;
  group.add(floor);

  // Walls
  [
    { geo: new THREE.BoxGeometry(w, h, t), pos: [0, t + h / 2, -d / 2 + t / 2] },
    { geo: new THREE.BoxGeometry(t, h, d), pos: [-w / 2 + t / 2, t + h / 2, 0] },
    { geo: new THREE.BoxGeometry(t, h, d), pos: [w / 2 - t / 2, t + h / 2, 0] },
  ].forEach(({ geo, pos }) => {
    const mesh = new THREE.Mesh(geo, woodMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(...(pos as [number, number, number]));
    group.add(mesh);
  });

  // Front wall with door
  const frontShape = new THREE.Shape();
  frontShape.moveTo(-w / 2, 0);
  frontShape.lineTo(w / 2, 0);
  frontShape.lineTo(w / 2, h);
  frontShape.lineTo(-w / 2, h);
  frontShape.closePath();
  const doorW = mm(config.doorWidth);
  const doorH = mm(config.doorHeight);
  const hole = new THREE.Path();
  hole.moveTo(-doorW / 2, 0);
  hole.lineTo(doorW / 2, 0);
  hole.lineTo(doorW / 2, doorH);
  hole.lineTo(-doorW / 2, doorH);
  hole.closePath();
  frontShape.holes.push(hole);
  const frontGeo = new THREE.ExtrudeGeometry(frontShape, { depth: t, bevelEnabled: false });
  const frontWall = new THREE.Mesh(frontGeo, woodMat);
  frontWall.castShadow = true;
  frontWall.receiveShadow = true;
  // Shape coords go from -w/2 to +w/2, so mesh must be at x=0 (not -w/2)
  frontWall.position.set(0, t, d / 2 - t);
  group.add(frontWall);

  // Flat roof with slight overhang
  const overhang = 0.05;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + overhang * 2, t, d + overhang * 2), roofMat);
  roof.castShadow = true;
  roof.receiveShadow = true;
  roof.position.y = t + h + t / 2;
  group.add(roof);

  return group;
}

export function generateAFrameHouse(config: HouseConfig): THREE.Group {
  const group = new THREE.Group();
  const { width, depth, materialThickness } = config;
  const t = mm(materialThickness);
  const w = mm(width);
  const d = mm(depth);
  const h = mm(config.height);

  const woodMat = new THREE.MeshStandardMaterial({ color: '#c8a57a', roughness: 0.75, metalness: 0.0 });

  // Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), woodMat);
  floor.castShadow = true;
  floor.receiveShadow = true;
  floor.position.y = t / 2;
  group.add(floor);

  // A-frame: two angled panels meeting at the top
  const panelLen = Math.sqrt((w / 2) ** 2 + h ** 2);
  const panelAngle = Math.atan2(h, w / 2);
  const panelGeo = new THREE.BoxGeometry(panelLen, t, d);
  const panelMat = new THREE.MeshStandardMaterial({ color: '#7a4f2e', roughness: 0.85, metalness: 0.05 });

  const leftPanel = new THREE.Mesh(panelGeo, panelMat);
  leftPanel.castShadow = true;
  leftPanel.receiveShadow = true;
  leftPanel.rotation.z = panelAngle;
  leftPanel.position.set(
    -(w / 4),
    t + h / 2,
    0
  );
  group.add(leftPanel);

  const rightPanel = new THREE.Mesh(panelGeo, panelMat);
  rightPanel.castShadow = true;
  rightPanel.receiveShadow = true;
  rightPanel.rotation.z = -panelAngle;
  rightPanel.position.set(w / 4, t + h / 2, 0);
  group.add(rightPanel);

  // End gables
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-w / 2, 0);
  gableShape.lineTo(w / 2, 0);
  gableShape.lineTo(0, h);
  gableShape.closePath();
  const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: t, bevelEnabled: false });

  const frontGable = new THREE.Mesh(gableGeo, woodMat);
  frontGable.castShadow = true;
  frontGable.receiveShadow = true;
  frontGable.position.set(0, t, d / 2);
  frontGable.rotation.y = Math.PI;
  group.add(frontGable);

  const backGable = new THREE.Mesh(gableGeo, woodMat);
  backGable.castShadow = true;
  backGable.receiveShadow = true;
  backGable.position.set(0, t, -d / 2 + t);
  group.add(backGable);

  return group;
}

export function generateHouse(config: HouseConfig): THREE.Group {
  switch (config.style) {
    case 'modern':
      return generateModernHouse(config);
    case 'aframe':
      return generateAFrameHouse(config);
    default:
      return generateClassicHouse(config);
  }
}
