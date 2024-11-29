import { LucideIcon } from 'lucide-react';

export interface FurnitureConfig {
  icon: LucideIcon;
  name: string;
  width: number;
  height: number;
  price: number;
  color: string;
  cellSize: number;
  getDimensions?: (rotation: number) => { width: number; height: number }; // Gestion de la rotation
}

export interface InventoryItem {
  id: string;
  type: string;
  position: { x: number; y: number };
  rotation?: number; // Rotation facultative
  color?: string; // Facultatif si absent
  name: string; // Si cette propriété est requise dans d'autres parties du code
}
