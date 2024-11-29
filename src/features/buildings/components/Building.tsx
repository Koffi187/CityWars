import { useState } from 'react';
import { Building as BuildingType } from '../types';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';
import { BuildingMenu } from './BuildingMenu';
import { BuildingInterior } from '../../game/components/BuildingInterior';

export function Building({ building }: { building: BuildingType }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showInterior, setShowInterior] = useState(false);
  const config = BUILDING_CONFIGS[building.type];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleInteriorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (building.type === 'residential') {
      setShowInterior(true);
      setShowMenu(false);
    }
  };

  return (
    <div
      className="absolute transition-all duration-500 ease-out cursor-pointer"
      style={{
        left: `${building.x}px`,
        top: `${building.y}px`,
        width: `${config.dimensions.width}px`,
        height: `${config.dimensions.height}px`,
        transform: `scale(${building.scale || 1})`,
        transformOrigin: 'center bottom',
        zIndex: building.y,
      }}
      onClick={handleClick}
    >
      <div 
        className="absolute inset-0 rounded-lg shadow-lg overflow-hidden hover:brightness-110 transition-all"
        style={{
          backgroundColor: building.color || config.color,
          backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)',
        }}
      >
        {/* Fenêtres */}
        <div className="grid grid-cols-3 gap-1 p-2 h-3/4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-blue-300 rounded-sm opacity-80 window-glow"
              style={{
                boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
        </div>
        
        {/* Porte */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-1/6 bg-gray-800 rounded-t-lg cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={handleInteriorClick}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        </div>

        {/* Toit */}
        <div className="absolute -top-4 left-0 right-0 h-4 bg-gray-800 rounded-t-lg" />
      </div>

      {/* Nom du bâtiment */}
      <div className="absolute -bottom-6 left-0 right-0 text-center">
        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
          {building.name || config.name}
        </span>
      </div>

      {showMenu && (
        <BuildingMenu
          building={building}
          onClose={() => setShowMenu(false)}
        />
      )}

      {showInterior && (
        <BuildingInterior
          building={building}
          onClose={() => setShowInterior(false)}
        />
      )}
    </div>
  );
}