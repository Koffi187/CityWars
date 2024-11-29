import { Sofa, Bed, Table, Lamp } from 'lucide-react';
import { FurnitureConfig } from './types';

export const CELL_SIZE = 64; // Increased cell size for better visibility
export const GRID_SIZE = 8; // Fixed 8x8 grid

export const FURNITURE_CONFIGS: Record<string, FurnitureConfig> = {
  'Canapé': {
    icon: Sofa,
    name: 'Canapé',
    width: 2,
    height: 1,
    price: 50,
    color: '#8B4513',
    cellSize: CELL_SIZE,
  },
  'Lit': {
    icon: Bed,
    name: 'Lit',
    width: 2,
    height: 2,
    price: 100,
    color: '#4A90E2',
    cellSize: CELL_SIZE,
  },
  'Table': {
    icon: Table,
    name: 'Table',
    width: 1,
    height: 1,
    price: 30,
    color: '#8B4513',
    cellSize: CELL_SIZE,
  },
  'Lampe': {
    icon: Lamp,
    name: 'Lampe',
    width: 1,
    height: 1,
    price: 20,
    color: '#FFD700',
    cellSize: CELL_SIZE,
  },
};