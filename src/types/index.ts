export type PetType = 'cat' | 'dog';
export type PetSize = 'S' | 'M' | 'L' | 'XL';
export type HouseStyle = 'classic' | 'modern' | 'aframe';
export type JointType = 'flat' | 'finger';
export type DoorShape = 'arch' | 'rectangular' | 'circular';
export type MaterialType = 'plywood' | 'mdf' | 'acrylic' | 'custom';

export interface HouseConfig {
  // Pet
  petType: PetType;
  petSize: PetSize;

  // Style
  style: HouseStyle;

  // Dimensions (mm)
  width: number;
  height: number;
  depth: number;

  // Material
  materialThickness: number;
  materialType: MaterialType;

  // Door
  doorShape: DoorShape;
  doorWidth: number;
  doorHeight: number;
  petName: string;
  petNameSize: number;   // mm
  petNameWeight: number; // 100–900

  // Options
  jointType: JointType;
  kerfCompensation: number;
  hasVentilation: boolean;
  ventilationSize: number; // mm (radius)
  hasElevatedFloor: boolean;
  floorElevation: number;

  // Roof (classic only)
  roofAngle: number;
  roofOverhang: number;
}

export interface ExportOptions {
  format: 'svg' | 'dxf' | 'pdf';
  lineColors: { cut: string; engrave: string };
  lineWeight: number;
  includeAssemblyGuide: boolean;
  includeMaterialList: boolean;
}

export const PET_PRESETS: Record<PetType, Record<PetSize, Partial<HouseConfig>>> = {
  cat: {
    S:  { width: 400, height: 380, depth: 450, doorWidth: 140, doorHeight: 160 },
    M:  { width: 480, height: 430, depth: 520, doorWidth: 160, doorHeight: 190 },
    L:  { width: 560, height: 500, depth: 600, doorWidth: 180, doorHeight: 220 },
    XL: { width: 560, height: 500, depth: 600, doorWidth: 180, doorHeight: 220 },
  },
  dog: {
    S:  { width: 450, height: 420, depth: 500, doorWidth: 160, doorHeight: 190 },
    M:  { width: 600, height: 550, depth: 650, doorWidth: 210, doorHeight: 250 },
    L:  { width: 750, height: 680, depth: 800, doorWidth: 260, doorHeight: 310 },
    XL: { width: 900, height: 820, depth: 950, doorWidth: 310, doorHeight: 370 },
  },
};

export const DEFAULT_CONFIG: HouseConfig = {
  petType: 'cat',
  petSize: 'M',
  style: 'classic',
  width: 480,
  height: 430,
  depth: 520,
  materialThickness: 6,
  materialType: 'plywood',
  doorShape: 'arch',
  doorWidth: 160,
  doorHeight: 190,
  petName: '',
  petNameSize: 18,
  petNameWeight: 400,
  jointType: 'finger',
  kerfCompensation: 0.1,
  hasVentilation: true,
  ventilationSize: 15,
  hasElevatedFloor: false,
  floorElevation: 50,
  roofAngle: 35,
  roofOverhang: 20,
};
