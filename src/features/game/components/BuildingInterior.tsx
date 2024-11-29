import { useState } from 'react';
import { DoorOpen, ShoppingBag, Lock, Unlock, Package } from 'lucide-react';
import { Building } from '../types';
import { auth } from '../../auth/firebase';
import { useGameStore } from '../../../store/gameStore';
import { FurnitureItem } from './interior/FurnitureItem';
import { FurnitureShop } from './interior/FurnitureShop';
import { FURNITURE_CONFIGS } from './interior/configs';

interface BuildingInteriorProps {
  building: Building;
  onClose: () => void;
}

export function BuildingInterior({ building, onClose }: BuildingInteriorProps) {
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const { updateBuilding, resources, updateResources } = useGameStore();
  const isOwner = auth.currentUser?.uid === building.ownerId;

  const CELL_SIZE = 64; // Taille de chaque cellule en pixels
  const GRID_SIZE = 8; // Nombre de cellules par ligne/colonne

  const handleFurniturePlacement = (id: string, x: number, y: number) => {
    if (isOwner && building.inventory) {
      const updatedInventory = building.inventory.map((furniture) =>
        furniture.id === id ? { ...furniture, position: { x, y } } : furniture
      );
      updateBuilding(building.id, { inventory: updatedInventory });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white truncate max-w-md">
          {building.name || 'Intérieur de la résidence'}
        </h2>

        <div className="flex items-center gap-4">
          {isOwner && (
            <button
              onClick={() =>
                updateBuilding(building.id, { isLocked: !building.isLocked })
              }
              className={`px-3 py-1 rounded-lg transition-colors ${
                building.isLocked
                  ? 'bg-red-500 text-white hover:bg-red-400'
                  : 'bg-green-500 text-white hover:bg-green-400'
              }`}
            >
              {building.isLocked ? 'Déverrouiller' : 'Verrouiller'}
            </button>
          )}
        </div>
      </div>

      {/* Interior Grid */}
      <div
        className="absolute inset-0 mt-16 bg-gray-800 p-4 flex justify-center items-center"
        onClick={() => setSelectedFurniture(null)}
      >
        <div
          className="relative grid"
          style={{
            width: `${CELL_SIZE * GRID_SIZE}px`,
            height: `${CELL_SIZE * GRID_SIZE}px`,
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        >
        {building.inventory?.map((item) => (
        <FurnitureItem
          key={item.id}
          id={item.id}
          type={item.type}
          position={item.position}
          rotation={item.rotation || 0}
          color={item.color || FURNITURE_CONFIGS[item.type].color}
          config={FURNITURE_CONFIGS[item.type]}
          isSelected={selectedFurniture === item.id}
          isOwner={isOwner}
          onSelect={(id) => setSelectedFurniture(id)}
          onDragStop={(id, gridX, gridY) => {
            const updatedInventory = building.inventory?.map((furniture) =>
              furniture.id === id ? { ...furniture, position: { x: gridX, y: gridY } } : furniture
            );
            if (updatedInventory) {
              updateBuilding(building.id, { inventory: updatedInventory });
            }
          }}
          onRotate={(id, angle) => {
            const updatedInventory = building.inventory?.map((furniture) =>
              furniture.id === id ? { ...furniture, rotation: angle } : furniture
            );
            if (updatedInventory) {
              updateBuilding(building.id, { inventory: updatedInventory });
            }
          }}
          onChangeColor={(id, newColor) => {
            const updatedInventory = building.inventory?.map((furniture) =>
              furniture.id === id ? { ...furniture, color: newColor } : furniture
            );
            if (updatedInventory) {
              updateBuilding(building.id, { inventory: updatedInventory });
            }
          }}
          isOccupied={(x, y, currentId) =>
            building.inventory?.some(
              (furniture) =>
                furniture.position.x === x &&
                furniture.position.y === y &&
                furniture.id !== currentId
            )
          }
        />
      ))}



        </div>
      </div>

      {/* Left Sidebar */}
      <div className="fixed left-4 bottom-4 flex flex-col gap-4 z-[150]">
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <DoorOpen className="w-5 h-5" />
          <span>Sortir</span>
        </button>

        {isOwner && (
          <>
            <button
              onClick={() => setShowShop(!showShop)}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Boutique</span>
            </button>

            <button
              onClick={() => setShowInventory(!showInventory)}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>Inventaire</span>
            </button>
          </>
        )}
      </div>

      {/* Furniture Shop */}
      {showShop && (
        <FurnitureShop
          onClose={() => setShowShop(false)}
          onBuy={async (type, price) => {
            if (resources.money >= price) {
              const newFurniture = {
                id: crypto.randomUUID(),
                type,
                position: { x: 0, y: 0 }, // Position initiale dans la grille
              };
              const updatedInventory = [...(building.inventory || []), newFurniture];
              await updateResources({ money: resources.money - price });
              await updateBuilding(building.id, { inventory: updatedInventory });
            }
          }}
          resources={resources}
        />
      )}

      {/* Inventory Panel */}
      {showInventory && (
        <div className="fixed bottom-24 left-4 bg-gray-800 p-4 rounded-lg shadow-lg z-[150]">
          <h3 className="text-white font-bold mb-3">Inventaire</h3>
          <div className="grid grid-cols-2 gap-2">
            {building.inventory?.map((item) => (
              <div
                key={item.id}
                className="bg-gray-700 p-2 rounded flex items-center gap-2 text-white text-sm"
              >
                <span>{FURNITURE_CONFIGS[item.type].name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
