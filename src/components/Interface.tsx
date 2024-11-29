import { Building2, Coins, Factory, Home, Library, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';
import { BuildingType } from '../types';
import { BUILDING_CONFIGS } from '../utils/buildingConfigs';

export function Interface() {
  const { resources, selectedBuildingType, setSelectedBuildingType } = useStore();

  const buildingTypes: { type: BuildingType; icon: React.ReactNode }[] = [
    { type: 'residential', icon: <Home className="w-4 h-4" /> },
    { type: 'commercial', icon: <ShoppingBag className="w-4 h-4" /> },
    { type: 'cultural', icon: <Library className="w-4 h-4" /> },
    { type: 'industrial', icon: <Factory className="w-4 h-4" /> },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{resources.money}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{resources.materials}</span>
            </div>
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-purple-500" />
              <span className="font-medium">{resources.energy}</span>
            </div>
          </div>
          <h2 className="text-lg font-semibold">Constructeur de Ville Virtuelle</h2>
        </div>

        <div className="flex gap-4 justify-center">
          {buildingTypes.map(({ type, icon }) => (
            <button
              key={type}
              onClick={() => setSelectedBuildingType(selectedBuildingType === type ? null : type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                selectedBuildingType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {icon}
              <span>{BUILDING_CONFIGS[type].name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}