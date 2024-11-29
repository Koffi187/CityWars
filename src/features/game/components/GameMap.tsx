import { useCallback, useRef, useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { Building } from './Building';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';
import { auth } from '../../auth/firebase';

export function GameMap() {
  const { buildings, selectedBuildingType, addBuilding, resources, updateResources } = useGameStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showInterior, setShowInterior] = useState<string | null>(null); // L'état est maintenant une chaîne représentant l'id du bâtiment ouvert

  const handleMapClick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
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

        if (Math.abs(clickY - roadY) < 64) return;

        const isTopHalf = clickY < roadY;

        const buildingsInRow = buildings
          .filter((b) => (isTopHalf ? b.y < roadY : b.y > roadY))
          .sort((a, b) => b.x - a.x);

        let newX = x;
        if (buildingsInRow.length > 0) {
          const lastBuilding = buildingsInRow[0];
          const lastConfig = BUILDING_CONFIGS[lastBuilding.type];
          newX = lastBuilding.x + lastConfig.dimensions.width + 20;
        }

        const y = isTopHalf
          ? roadY - config.dimensions.height - 80
          : roadY + 80;

        try {
          await updateResources({
            money: resources.money - cost.money,
            materials: resources.materials - cost.materials,
            energy: resources.energy - cost.energy,
          });

          await addBuilding({
            type: selectedBuildingType,
            x: newX,
            y,
            scale: 1,
            createdAt: Date.now(),
            ownerId: auth.currentUser.uid,
          });
        } catch (error) {
          console.error('Erreur lors de la construction:', error);
        }
      }
    },
    [selectedBuildingType, buildings, resources, addBuilding, updateResources, isDragging]
  );

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-pan-x cursor-grab active:cursor-grabbing"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragging}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div
        ref={mapRef}
        className="absolute inset-0 min-w-[2000px] h-full"
        onClick={handleMapClick}
        style={{
          background: `linear-gradient(to bottom, #A1D4B2 0%, #A1D4B2 45%, #6B8E23 45%, #6B8E23 55%, #90EE90 55%, #90EE90 100%)`,
        }}
      >
        {/* Route avec un design interactif */}
        <div
          className="absolute left-0 right-0 h-20 bg-gray-600 border-y-4 border-gray-800 rounded-xl"
          style={{
            top: 'calc(50% - 32px)',
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, #FFF 40px, #FFF 80px)`,
          }}
        />

        {/* Bâtiments */}
        {buildings.map((building) => (
          <Building
            key={building.id}
            building={building}
            setShowInterior={setShowInterior} // Passer `setShowInterior` pour ouvrir l'intérieur
            showInterior={showInterior} // Passer l'état de l'intérieur pour savoir si ce bâtiment est ouvert
          />
        ))}
      </div>
    </div>
  );
}
