import { LucideIcon } from 'lucide-react';

export interface FurnitureConfig {
  icon: LucideIcon;
  name: string;
  width: number;
  height: number;
  price: number;
  color: string;
  cellSize: number;
}

export interface FurnitureItem {
  id: string;
  type: string;
  position: { x: number; y: number };
  color?: string;
}