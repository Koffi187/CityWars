import { Building2, Coins, Factory, Home, Library, ShoppingBag } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';
import { BuildingType } from '../types';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';
import { ResourceDisplay } from '../../resources/components/ResourceDisplay';

const BUILDING_ICONS = {
  residential: Home,
  commercial: ShoppingBag,
  cultural: Library,
  industrial: Factory,
} as const;

export function BuildingControls() {
  const { selectedBuildingType, setSelectedBuildingType } = useGameStore();

  return (
    <div className="absolute inset-x-0 bottom-0 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <ResourceDisplay />
          <h2 className="text-lg font-semibold">Constructeur de Ville Virtuelle</h2>
        </div>

        <div className="flex gap-4 justify-center">
          {Object.entries(BUILDING_CONFIGS).map(([type, config]) => {
            const Icon = BUILDING_ICONS[type as BuildingType];
            return (
              <button
                key={type}
                onClick={() => setSelectedBuildingType(selectedBuildingType === type ? null : type as BuildingType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  selectedBuildingType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{config.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}