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
    cost: {
      money: 200,
      materials: 100,
      energy: 20,
    },
    dimensions: {
      width: 3,
      height: 8,
      depth: 3,
    },
    color: '#4A90E2',
  },
  commercial: {
    name: 'Commercial',
    cost: {
      money: 300,
      materials: 150,
      energy: 30,
    },
    dimensions: {
      width: 4,
      height: 6,
      depth: 4,
    },
    color: '#F5A623',
  },
  cultural: {
    name: 'Culturel',
    cost: {
      money: 400,
      materials: 200,
      energy: 25,
    },
    dimensions: {
      width: 5,
      height: 10,
      depth: 5,
    },
    color: '#7ED321',
  },
  industrial: {
    name: 'Industriel',
    cost: {
      money: 500,
      materials: 300,
      energy: 50,
    },
    dimensions: {
      width: 6,
      height: 5,
      depth: 6,
    },
    color: '#9013FE',
  },
};