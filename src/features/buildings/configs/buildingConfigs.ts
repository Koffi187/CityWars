import { BuildingType } from '../types';

interface BuildingConfig {
  name: string;
  cost: {
    money: number;
    materials: number;
    energy: number;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  color: string;
}

export const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig> = {
  residential: {
    name: 'Résidentiel',
    cost: { money: 200, materials: 100, energy: 20 },
    dimensions: { width: 4, height: 12, depth: 4 },
    color: '#4299e1',
  },
  commercial: {
    name: 'Commercial',
    cost: { money: 300, materials: 150, energy: 30 },
    dimensions: { width: 6, height: 15, depth: 6 },
    color: '#f6ad55',
  },
  cultural: {
    name: 'Culturel',
    cost: { money: 400, materials: 200, energy: 25 },
    dimensions: { width: 8, height: 20, depth: 8 },
    color: '#68d391',
  },
  industrial: {
    name: 'Industriel',
    cost: { money: 500, materials: 300, energy: 50 },
    dimensions: { width: 10, height: 10, depth: 10 },
    color: '#b794f4',
  },
};