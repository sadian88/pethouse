'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { generateHouse } from '@/lib/geometry/houseGenerators';

export default function PetHouseModel() {
  const config = useConfiguratorStore((s) => s.config);
  const prevRef = useRef<THREE.Group | null>(null);

  // Explicit deps — petName intentionally excluded (it doesn't affect geometry)
  const {
    width, height, depth, style,
    materialThickness, materialType,
    doorShape, doorWidth, doorHeight,
    jointType, kerfCompensation,
    hasVentilation, ventilationSize,
    hasElevatedFloor, floorElevation,
    roofAngle, roofOverhang,
  } = config;

  const house = useMemo(() => {
    if (prevRef.current) {
      prevRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
    }

    const h = generateHouse(config);

    h.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(h);
    h.position.x -= (box.min.x + box.max.x) / 2;
    h.position.z -= (box.min.z + box.max.z) / 2;
    h.position.y -= box.min.y;

    prevRef.current = h;
    return h;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    width, height, depth, style,
    materialThickness, materialType,
    doorShape, doorWidth, doorHeight,
    jointType, kerfCompensation,
    hasVentilation, ventilationSize,
    hasElevatedFloor, floorElevation,
    roofAngle, roofOverhang,
  ]);

  return <primitive object={house} />;
}
