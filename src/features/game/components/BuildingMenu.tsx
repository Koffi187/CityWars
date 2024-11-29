import { useState, useRef, useEffect } from 'react';
import { X, Edit2, ChevronUp, Trash2, Paintbrush, Gem } from 'lucide-react';
import { Building } from '../types';
import { BUILDING_CONFIGS } from '../configs/buildingConfigs';
import { useGameStore } from '../../../store/gameStore';

interface BuildingMenuProps {
  building: Building;
  onClose: () => void;
}

export function BuildingMenu({ building, onClose }: BuildingMenuProps) {
  const [name, setName] = useState(building.name || BUILDING_CONFIGS[building.type].name);
  const [isEditing, setIsEditing] = useState(false);
  const [customColor, setCustomColor] = useState(building.color || BUILDING_CONFIGS[building.type].color);
  const menuRef = useRef<HTMLDivElement>(null);
  const { deleteBuilding, updateBuilding, resources, updateResources } = useGameStore();

  // Coût d'amélioration en jetons
  const UPGRADE_COST = 2;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNameChange = (newName: string) => {
    if (newName.length <= 20) {
      setName(newName);
    }
  };

  const handleSaveName = () => {
    if (name.trim()) {
      updateBuilding(building.id, { name: name.trim() });
      setIsEditing(false);
    }
  };

  const handleUpgrade = async () => {
    if (resources.tokens >= UPGRADE_COST) {
      await updateResources({ tokens: resources.tokens - UPGRADE_COST });
      await updateBuilding(building.id, { 
        scale: Math.min((building.scale || 1) + 0.2, 2.0) // Maximum scale de 2.0
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir détruire ce bâtiment ?')) {
      deleteBuilding(building.id);
      onClose();
    }
  };

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    updateBuilding(building.id, { color });
  };

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-xl p-4 min-w-[300px] max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-4">
        {/* Nom du bâtiment */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-2 py-1 border rounded"
                maxLength={20}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(building.name || BUILDING_CONFIGS[building.type].name);
                  }}
                  className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold flex-1">{name}</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Couleur personnalisée */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Paintbrush className="w-4 h-4" />
            Couleur personnalisée
          </h4>
          <input
            type="color"
            value={customColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>

        {/* Amélioration */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ChevronUp className="w-4 h-4" />
            Amélioration
          </h4>
          <div className="bg-gray-50 p-3 rounded-lg mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Coût:</span>
              <div className="flex items-center gap-1">
                <Gem className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{UPGRADE_COST} jetons</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Taille actuelle: {Math.round((building.scale || 1) * 100)}%
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={resources.tokens < UPGRADE_COST || (building.scale || 1) >= 2.0}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ChevronUp className="w-4 h-4" />
            {(building.scale || 1) >= 2.0 
              ? "Taille maximale atteinte"
              : resources.tokens < UPGRADE_COST
                ? "Jetons insuffisants"
                : "Agrandir le bâtiment"}
          </button>
        </div>

        {/* Suppression */}
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Détruire le bâtiment
        </button>
      </div>
    </div>
  );
}