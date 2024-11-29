import { Building2, Factory, Home, Library, ShoppingBag, Construction } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';
import { BuildingType } from '../types';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';

const BUILDING_ICONS = {
  residential: Home,
  commercial: ShoppingBag,
  cultural: Library,
  industrial: Factory,
} as const;

export function BuildingPanel() {
  const { selectedBuildingType, setSelectedBuildingType, resources } = useGameStore();

  return (
    <div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg z-50 p-2 md:p-4 max-w-[95vw] md:max-w-2xl mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {Object.entries(BUILDING_CONFIGS).map(([type, config]) => {
          const Icon = BUILDING_ICONS[type as BuildingType];
          const canAfford = 
            resources.money >= config.cost.money &&
            resources.materials >= config.cost.materials &&
            resources.energy >= config.cost.energy;

          return (
            <button
              key={type}
              onClick={() => setSelectedBuildingType(
                selectedBuildingType === type ? null : type as BuildingType
              )}
              className={`relative group flex flex-col items-center p-2 md:p-3 rounded-lg transition-all duration-200 ${
                selectedBuildingType === type
                  ? 'bg-blue-600 text-white scale-105'
                  : canAfford
                  ? 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!canAfford}
            >
              {selectedBuildingType === type && (
                <Construction className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
              )}
              
              <Icon className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm font-medium text-center">
                {config.name}
              </span>
              
              <div className="flex flex-col items-center gap-1 mt-1 text-xs opacity-75">
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span>{config.cost.money}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🏗️</span>
                  <span>{config.cost.materials}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⚡</span>
                  <span>{config.cost.energy}</span>
                </div>
              </div>

              {!canAfford && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white px-2 py-1 bg-black/80 rounded">
                    Ressources insuffisantes
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}