import { useCallback, useRef, useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { Building } from './Building';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';
import { auth } from '../../auth/firebase';

export function GameMap() {
  const { buildings, selectedBuildingType, addBuilding, resources, updateResources } = useGameStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMapClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !selectedBuildingType || !auth.currentUser || !mapRef.current) return;

    const config = BUILDING_CONFIGS[selectedBuildingType];
    const cost = config.cost;
    
    if (
      resources.money >= cost.money &&
      resources.materials >= cost.materials &&
      resources.energy >= cost.energy
    ) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const roadY = window.innerHeight / 2;
      const clickY = e.clientY - rect.top;
      
      // Zone de sécurité autour de la route (64px)
      if (Math.abs(clickY - roadY) < 64) {
        return;
      }

      const isTopHalf = clickY < roadY;
      
      // Trouver le dernier bâtiment dans la même rangée
      const buildingsInRow = buildings
        .filter(b => (isTopHalf ? b.y < roadY : b.y > roadY))
        .sort((a, b) => b.x - a.x);

      // Position X : soit après le dernier bâtiment, soit à la position du clic
      let newX = x;
      if (buildingsInRow.length > 0) {
        const lastBuilding = buildingsInRow[0];
        const lastConfig = BUILDING_CONFIGS[lastBuilding.type];
        newX = lastBuilding.x + lastConfig.dimensions.width + 20;
      }

      // Position Y fixe selon la rangée
      const y = isTopHalf 
        ? roadY - config.dimensions.height - 80 // Au-dessus de la route
        : roadY + 80; // En-dessous de la route

      try {
        await updateResources({
          money: resources.money - cost.money,
          materials: resources.materials - cost.materials,
          energy: resources.energy - cost.energy
        });

        await addBuilding({
          type: selectedBuildingType,
          x: newX,
          y,
          scale: 1,
          createdAt: Date.now(),
          ownerId: auth.currentUser.uid
        });
      } catch (error) {
        console.error('Erreur lors de la construction:', error);
      }
    }
  }, [selectedBuildingType, buildings, resources, addBuilding, updateResources, isDragging]);

  return (
    <div 
      ref={dragRef}
      className="relative w-[10000px] h-full cursor-grab active:cursor-grabbing touch-pan-x"
      onClick={handleMapClick}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform'
      }}
    >
      <div 
        ref={mapRef}
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to bottom,
              #87CEEB 0%,
              #87CEEB 45%,
              #8B4513 45%,
              #8B4513 55%,
              #90EE90 55%,
              #90EE90 100%
            )
          `
        }}
      >
        {/* Route */}
        <div 
          className="absolute left-0 right-0 h-16"
          style={{
            top: 'calc(50% - 32px)',
            background: '#555',
            borderTop: '4px solid #888',
            borderBottom: '4px solid #888',
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                #FFF 40px,
                #FFF 80px
              )
            `
          }}
        />

        {buildings.map((building) => (
          <Building key={building.id} building={building} />
        ))}
      </div>
    </div>
  );
}