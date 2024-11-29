export type BuildingType = 'residential' | 'commercial' | 'cultural' | 'industrial';

export interface Building {
  id: string;
  type: BuildingType;
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  resources: number;
}

export interface Resources {
  money: number;
  materials: number;
  energy: number;
}

export interface GameState {
  buildings: Building[];
  resources: Resources;
  selectedBuildingType: BuildingType | null;
  addBuilding: (building: Omit<Building, 'id'>) => void;
  updateResources: (updates: Partial<Resources>) => void;
  setSelectedBuildingType: (type: BuildingType | null) => void;
}