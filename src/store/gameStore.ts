import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Building, BuildingType } from '../features/game/types.ts';
import { Resources } from '../features/resources/types';
import { buildingService } from '../features/buildings/services/buildingService';
import { resourceService } from '../features/resources/services/resourceService';

interface GameState {
  buildings: Building[];
  resources: Resources;
  selectedBuildingType: BuildingType | null;
  lastUsernameChange: number | null;
  addBuilding: (building: Omit<Building, 'id' | 'createdAt' | 'ownerId'>) => Promise<void>;
  deleteBuilding: (buildingId: string) => Promise<void>;
  updateBuilding: (buildingId: string, updates: Partial<Building>) => Promise<void>;
  updateResources: (updates: Partial<Resources>) => Promise<void>;
  setSelectedBuildingType: (type: BuildingType | null) => void;
  updateLastUsernameChange: (timestamp: number) => Promise<void>;
}

const INITIAL_RESOURCES: Resources = {
  money: 1000,
  materials: 500,
  energy: 100,
  tokens: 2,
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      buildings: [],
      resources: INITIAL_RESOURCES,
      selectedBuildingType: null,
      lastUsernameChange: null,

      addBuilding: async (building) => {
        try {
          await buildingService.addBuilding(building);
        } catch (error) {
          console.error('Erreur lors de l\'ajout du bâtiment:', error);
        }
      },

      deleteBuilding: async (buildingId) => {
        try {
          await buildingService.deleteBuilding(buildingId);
        } catch (error) {
          console.error('Erreur lors de la suppression du bâtiment:', error);
        }
      },

      updateBuilding: async (buildingId, updates) => {
        try {
          await buildingService.updateBuilding(buildingId, updates);
        } catch (error) {
          console.error('Erreur lors de la mise à jour du bâtiment:', error);
        }
      },

      updateResources: async (updates) => {
        try {
          await resourceService.updateResources(updates);
          set((state) => ({
            resources: {
              ...state.resources,
              ...updates,
            },
          }));
        } catch (error) {
          console.error('Erreur lors de la mise à jour des ressources:', error);
        }
      },

      setSelectedBuildingType: (type) => set({ selectedBuildingType: type }),

      updateLastUsernameChange: async (timestamp) => {
        try {
          await resourceService.updateLastUsernameChange(timestamp);
          set({ lastUsernameChange: timestamp });
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la date de changement de pseudo:', error);
        }
      },
    }),
    {
      name: 'citywars-storage',
    }
  )
);