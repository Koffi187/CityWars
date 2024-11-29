import { useState } from 'react';
import { Building } from '../types';
import { auth } from '../../auth/firebase';
import { Lock, Unlock, DoorOpen, Grid3X3, Sofa, Bed, Table, Lamp } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';

interface BuildingInteriorProps {
  building: Building;
  onClose: () => void;
}

const FURNITURE_TYPES = [
  { icon: Sofa, name: 'Canapé' },
  { icon: Bed, name: 'Lit' },
  { icon: Table, name: 'Table' },
  { icon: Lamp, name: 'Lampe' },
];

export function BuildingInterior({ building, onClose }: BuildingInteriorProps) {
  const [isLocked, setIsLocked] = useState(building.isLocked || false);
  const { updateBuilding } = useGameStore();
  const isOwner = auth.currentUser?.uid === building.ownerId;

  const handleToggleLock = async () => {
    if (!isOwner) return;
    const newLockedState = !isLocked;
    setIsLocked(newLockedState);
    await updateBuilding(building.id, { isLocked: newLockedState });
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {building.name || 'Intérieur de la résidence'}
          </h2>
          <div className="flex gap-2">
            {isOwner && (
              <button
                onClick={handleToggleLock}
                className={`p-2 rounded-lg transition-colors ${
                  isLocked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
                title={isLocked ? 'Déverrouiller' : 'Verrouiller'}
              >
                {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Sortir"
            >
              <DoorOpen className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-4 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Grid3X3 className="w-8 h-8 text-gray-300" />
            </div>
          ))}
        </div>

        {isOwner && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Inventaire</h3>
            <div className="grid grid-cols-8 gap-2">
              {FURNITURE_TYPES.map((furniture, index) => {
                const Icon = furniture.icon;
                return (
                  <div
                    key={index}
                    className="aspect-square bg-white rounded-lg shadow-sm border-2 border-gray-200 flex flex-col items-center justify-center p-1 hover:bg-gray-50 transition-colors cursor-pointer"
                    title={furniture.name}
                  >
                    <Icon className="w-6 h-6 text-gray-600" />
                    <span className="text-xs text-gray-500 mt-1">{furniture.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}