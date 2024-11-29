import { useState } from 'react';
import { Building } from '../types';
import { auth } from '../../auth/firebase';
import { DoorOpen, ShoppingBag, Lock, Unlock, HelpCircle, Coins, Package } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';
import { ResourceBar } from './ResourceBar';
import { FurnitureShop } from './interior/FurnitureShop';
import { FurnitureItem } from './interior/FurnitureItem';
import { FURNITURE_CONFIGS } from './interior/configs';

interface BuildingInteriorProps {
  building: Building;
  onClose: () => void;
}

export function BuildingInterior({ building, onClose }: BuildingInteriorProps) {
  const [isLocked, setIsLocked] = useState(building.isLocked || false);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [gridPosition, setGridPosition] = useState({ x: 0, y: 0 });
  const { updateBuilding, resources, updateResources } = useGameStore();
  const isOwner = auth.currentUser?.uid === building.ownerId;

  const handleToggleLock = async () => {
    if (!isOwner) return;
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    await updateBuilding(building.id, { isLocked: newLockedState });
  };

  const moveGrid = (direction: 'left' | 'right') => {
    setGridPosition(prev => ({
      ...prev,
      x: direction === 'left' ? Math.max(prev.x - 1, 0) : prev.x + 1
    }));
  };

  if (!isOwner && isLocked) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Accès Verrouillé</h3>
            <p className="text-gray-600">Cette résidence est verrouillée par son propriétaire.</p>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white truncate max-w-md">
          {building.name || 'Intérieur de la résidence'}
        </h2>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => moveGrid('left')}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            disabled={gridPosition.x === 0}
          >
            ←
          </button>
          <span className="text-white">Zone {gridPosition.x + 1}</span>
          <button
            onClick={() => moveGrid('right')}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            →
          </button>
          
          {isOwner && (
            <button
              onClick={handleToggleLock}
              className={`transition-colors ${
                isLocked ? 'text-red-500 hover:text-red-400' : 'text-green-500 hover:text-green-400'
              }`}
              title={isLocked ? 'Déverrouiller' : 'Verrouiller'}
            >
              {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Interior Grid */}
      <div 
        className="absolute inset-0 mt-16 mb-20 bg-gray-800 p-4"
        onClick={() => setSelectedFurniture(null)}
      >
        <div 
          className="relative w-full h-full bg-gray-700 rounded-lg overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            transform: `translateX(-${gridPosition.x * 100}%)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {building.inventory?.filter(item => 
            Math.floor(item.position.x / 8) === gridPosition.x
          ).map((item) => (
            <FurnitureItem
              key={item.id}
              {...item}
              isSelected={selectedFurniture === item.id}
              isOwner={isOwner}
              config={FURNITURE_CONFIGS[item.type]}
              onSelect={setSelectedFurniture}
              onDragStop={(id, x, y) => {
                if (isOwner && building.inventory) {
                  const updatedInventory = building.inventory.map(invItem => 
                    invItem.id === id ? { ...invItem, position: { x, y } } : invItem
                  );
                  updateBuilding(building.id, { inventory: updatedInventory });
                }
              }}
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

      {/* Shop Modal */}
      {showShop && (
        <FurnitureShop
          onClose={() => setShowShop(false)}
          onBuy={async (type, price) => {
            if (resources.money >= price) {
              const newFurniture = {
                id: crypto.randomUUID(),
                type,
                position: { 
                  x: gridPosition.x * 8 + 4,
                  y: 4 
                },
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
                <span className="text-gray-400">Zone {Math.floor(item.position.x / 8) + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}