import { create } from 'zustand';
import { HouseConfig, DEFAULT_CONFIG, PET_PRESETS, PetType, PetSize } from '@/types';

interface ConfiguratorState {
  config: HouseConfig;
  updateConfig: (updates: Partial<HouseConfig>) => void;
  applyPreset: (petType: PetType, petSize: PetSize) => void;
  resetConfig: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  config: DEFAULT_CONFIG,

  updateConfig: (updates) =>
    set((state) => ({ config: { ...state.config, ...updates } })),

  applyPreset: (petType, petSize) =>
    set((state) => ({
      config: {
        ...state.config,
        petType,
        petSize,
        ...PET_PRESETS[petType][petSize],
      },
    })),

  resetConfig: () => set({ config: DEFAULT_CONFIG }),
}));
