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
  inventory?: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  type: string;
  name: string;
  position?: { x: number; y: number };
}