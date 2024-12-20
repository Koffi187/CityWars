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

  const UPGRADE_COST = 2; // Coût d'amélioration en jetons

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
    if (newName.length <= 20) setName(newName);
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
        scale: Math.min((building.scale || 1) + 0.2, 2.0) // Limite la taille maximale à 2.0
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
      className="absolute z-50 -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white rounded-lg shadow-2xl p-5 w-[90%] sm:min-w-[300px] sm:max-w-md lg:w-[400px] transition-all"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-5">
        {/* Nom du bâtiment */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {isEditing ? (
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={20}
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(building.name || BUILDING_CONFIGS[building.type].name);
                  }}
                  className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold flex-1 text-center sm:text-left">{name}</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-700 rounded-md transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Couleur personnalisée */}
        <div>
          <h4 className="text-sm font-medium flex items-center gap-2">
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
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ChevronUp className="w-4 h-4" />
            Amélioration
          </h4>
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-300">Coût:</span>
              <div className="flex items-center gap-1">
                <Gem className="w-4 h-4 text-yellow-500" />
                <span className="font-bold">{UPGRADE_COST} jetons</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Taille actuelle: {Math.round((building.scale || 1) * 100)}%
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={resources.tokens < UPGRADE_COST || (building.scale || 1) >= 2.0}
            className="w-full mt-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
          className="w-full px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Détruire le bâtiment
        </button>
      </div>
    </div>
  );
}
