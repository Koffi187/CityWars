import { create } from 'zustand';
import { BuildingType, GameState } from './types';

const INITIAL_RESOURCES = {
  money: 1000,
  materials: 500,
  energy: 100,
};

export const useStore = create<GameState>((set) => ({
  buildings: [],
  resources: INITIAL_RESOURCES,
  selectedBuildingType: null,

  addBuilding: (building) =>
    set((state) => ({
      buildings: [
        ...state.buildings,
        {
          ...building,
          id: crypto.randomUUID(),
        },
      ],
    })),

  updateResources: (updates) =>
    set((state) => ({
      resources: {
        ...state.resources,
        ...updates,
      },
    })),

  setSelectedBuildingType: (type) =>
    set(() => ({
      selectedBuildingType: type,
    })),
}));