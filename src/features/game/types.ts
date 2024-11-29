export type BuildingType = 'residential' | 'commercial' | 'cultural' | 'industrial';

export interface Building {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  scale: number;
  color?: string;
  name?: string;
  ownerId: string;
  createdAt: number;
  isLocked?: boolean;
  inventory?: {
    id: string;
    type: string;
    position: { x: number; y: number };
    rotation?: number; // Rotation facultative
    color?: string; // Facultatif si absent
    name: string; // Si cette propriété est requise dans d'autres parties du code
  }[];
}

export interface Resources {
  money: number;
  materials: number;
  energy: number;
  tokens: number;
}

export interface GameState {
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