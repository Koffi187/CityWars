import { useEffect, useState } from 'react';
import { GameMap } from './components/GameMap';
import { BuildingPanel } from './components/BuildingPanel';
import { ResourceBar } from './components/ResourceBar';
import { UserMenu } from '../auth/components/UserMenu';
import { useGameStore } from '../../store/gameStore';
import { buildingService } from '../buildings/services/buildingService';
import { resourceService } from '../resources/services/resourceService';
import { auth } from '../auth/firebase';
import { HelpCircle, HardHat, Coins } from 'lucide-react';

export function Game() {
  const [showHelp, setShowHelp] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showBuildingPanel, setShowBuildingPanel] = useState(false);
  const { setSelectedBuildingType } = useGameStore();

  useEffect(() => {
    if (auth.currentUser) {
      resourceService.initializeUserResources();
      const unsubscribeBuildings = buildingService.subscribeToBuildings('main-city');
      const unsubscribeResources = resourceService.subscribeToResources();

      return () => {
        if (unsubscribeBuildings) unsubscribeBuildings();
        if (unsubscribeResources) unsubscribeResources();
      };
    }
  }, []);

  // Ferme le menu de construction quand on clique ailleurs
  const handleMapClick = () => {
    if (showBuildingPanel) {
      setShowBuildingPanel(false);
      setSelectedBuildingType(null);
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200"
      onClick={handleMapClick}
    >
      {/* Menu utilisateur */}
      <div className="absolute top-4 left-4 z-50">
        <UserMenu />
      </div>
      
      {/* Boutons d'action */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowResources(!showResources);
          }}
          className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Coins className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowBuildingPanel(!showBuildingPanel);
            if (!showBuildingPanel) {
              setSelectedBuildingType(null);
            }
          }}
          className={`bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors ${
            showBuildingPanel ? 'bg-blue-600 hover:bg-blue-700' : ''
          }`}
        >
          <HardHat className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowHelp(!showHelp);
          }}
          className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Panneau d'aide */}
      {showHelp && (
        <div 
          className="absolute top-20 right-4 z-50 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-bold mb-2 text-lg">Comment jouer :</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Cliquez sur le casque de chantier pour construire</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Glissez horizontalement pour explorer la ville</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Construisez au-dessus ou en-dessous de la route</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Cliquez sur un bâtiment pour le personnaliser</span>
            </li>
          </ul>
        </div>
      )}
      
      {showResources && <ResourceBar />}
      <GameMap />
      {showBuildingPanel && <BuildingPanel />}
    </div>
  );
}