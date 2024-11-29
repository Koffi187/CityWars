import { Sofa, Bed, Table, Lamp, Trophy } from 'lucide-react';
import { FurnitureConfig } from './types';

export const CELL_SIZE = 64; // Taille de cellule pour la grille
export const GRID_SIZE = 8; // Taille de la grille 8x8

export const FURNITURE_CONFIGS: Record<string, FurnitureConfig> = {
  'Canapé': {
    icon: Sofa,
    name: 'Canapé',
    width: 2,
    height: 1,
    price: 50,
    color: '#8B4513',
    cellSize: CELL_SIZE,
    getDimensions: (rotation) => {
      if (rotation % 180 === 90) return { width: 1, height: 2 };
      return { width: 2, height: 1 };
    },
  },
  'Lit': {
    icon: Bed,
    name: 'Lit',
    width: 2,
    height: 2,
    price: 100,
    color: '#4A90E2',
    cellSize: CELL_SIZE,
    getDimensions: (rotation) => {
      if (rotation % 180 === 90) return { width: 2, height: 2 }; // Pas de changement pour un meuble carré
      return { width: 2, height: 2 };
    },
  },
  'Table': {
    icon: Table,
    name: 'Table',
    width: 1,
    height: 1,
    price: 30,
    color: '#8B4513',
    cellSize: CELL_SIZE,
    getDimensions: (rotation) => ({ width: 1, height: 1 }), // Pas de changement
  },
  'Lampe': {
    icon: Lamp,
    name: 'Lampe',
    width: 1,
    height: 1,
    price: 20,
    color: '#FFD700',
    cellSize: CELL_SIZE,
    getDimensions: (rotation) => ({ width: 1, height: 1 }), // Pas de changement
  },
  'Trophée': {
    icon: Trophy,
    name: 'Trophée',
    width: 1,
    height: 1,
    price: 40,
    color: '#FFD700',
    cellSize: CELL_SIZE,
    getDimensions: (rotation) => ({ width: 1, height: 1 }), // Pas de changement
  },
};
