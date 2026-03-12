'use client';

import { Text } from '@react-three/drei';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';

// Same unit conversion as houseGenerators
const mm = (v: number) => v / 100;

export default function PetNameLabel() {
  const config = useConfiguratorStore((s) => s.config);
  const { petName, petNameSize, petNameWeight, width, depth, materialThickness, doorHeight } = config;

  if (!petName?.trim()) return null;

  const t = mm(materialThickness);
  const d = mm(depth);
  const dH = mm(doorHeight);

  const y = t + dH + mm(25);
  const z = d / 2 + 0.01;
  const maxW = mm(width) * 0.75;

  return (
    <Text
      position={[0, y, z]}
      fontSize={mm(petNameSize)}
      fontWeight={petNameWeight}
      maxWidth={maxW}
      color="#5a3a1a"
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.05}
    >
      {petName.trim()}
    </Text>
  );
}
