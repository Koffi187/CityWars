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
  };
  color: string;
  baseProduction: {
    money?: number;
    materials?: number;
    energy?: number;
  };
}

export const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig> = {
  residential: {
    name: 'Résidentiel',
    cost: { money: 200, materials: 100, energy: 20 },
    dimensions: { width: 80, height: 80 },
    color: '#4299e1',
    baseProduction: { money: 10 }
  },
  commercial: {
    name: 'Commercial',
    cost: { money: 300, materials: 150, energy: 30 },
    dimensions: { width: 100, height: 100 },
    color: '#f6ad55',
    baseProduction: { money: 20, energy: -5 }
  },
  cultural: {
    name: 'Culturel',
    cost: { money: 400, materials: 200, energy: 25 },
    dimensions: { width: 120, height: 120 },
    color: '#68d391',
    baseProduction: { money: 15, materials: 5 }
  },
  industrial: {
    name: 'Industriel',
    cost: { money: 500, materials: 300, energy: 50 },
    dimensions: { width: 150, height: 150 },
    color: '#b794f4',
    baseProduction: { materials: 20, energy: 10 }
  }
};