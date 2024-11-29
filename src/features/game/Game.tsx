import { useEffect, useState } from 'react';
import { GameMap } from './components/GameMap';
import { BuildingPanel } from './components/BuildingPanel';
import { ResourceBar } from './components/ResourceBar';
import { UserMenu } from '../auth/components/UserMenu';
import { useGameStore } from '../../store/gameStore';
import { buildingService } from '../buildings/services/buildingService';
import { resourceService } from '../resources/services/resourceService';
import { FriendsManager } from '../user/components/friendsManager';
import { auth } from '../auth/firebase';
import { HelpCircle, Hammer, Wallet, BookUser } from 'lucide-react';

export function Game() {
  const [showHelp, setShowHelp] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showBuildingPanel, setShowBuildingPanel] = useState(false);
  const [showFriends, setShowFriends] = useState(false); // Nouveau état pour les amis
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

  // Gérer la fermeture du panneau de construction
  const handleMapClick = () => {
    if (showBuildingPanel) {
      setShowBuildingPanel(false);
      setSelectedBuildingType(null);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-sky-800 to-sky-500"
      onClick={handleMapClick}
    >
      {/* Menu utilisateur */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-4">
        <UserMenu />
      </div>

      {/* Boutons d'action */}
      <div className="absolute top-4 right-4 z-50 flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowResources(!showResources);
          }}
          className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 shadow-lg transition-transform transform hover:scale-105"
        >
          <Wallet className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowBuildingPanel(!showBuildingPanel);
            if (!showBuildingPanel) {
              setSelectedBuildingType(null);
            }
          }}
          className={`p-3 rounded-full shadow-lg transition-transform transform hover:scale-105 ${
            showBuildingPanel
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          <Hammer className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowFriends(!showFriends); // Basculer l'état pour afficher les amis
          }}
          className={`p-3 rounded-full shadow-lg transition-transform transform hover:scale-105 ${
            showFriends
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          <BookUser className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowHelp(!showHelp);
          }}
          className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 shadow-lg transition-transform transform hover:scale-105"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Panneau d'aide */}
      {showHelp && (
        <div
          className="absolute top-20 right-4 z-50 bg-gray-800 text-white p-6 rounded-xl shadow-2xl max-w-xs transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-3">Comment jouer :</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Cliquez sur le casque de chantier pour construire.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Glissez horizontalement pour explorer la ville.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Construisez au-dessus ou en dessous de la route.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Cliquez sur un bâtiment pour le personnaliser.</span>
            </li>
          </ul>
        </div>
      )}

      {/* Barre des ressources */}
      {showResources && (
        <div className="absolute bottom-0 left-0 w-full bg-gray-900 bg-opacity-90 p-4">
          <ResourceBar />
        </div>
      )}

      {/* Carte et panneau de construction */}
      <GameMap />
      {showBuildingPanel && (
        <div className="absolute bottom-0 left-0 w-full bg-gray-900 bg-opacity-90 p-6">
          <BuildingPanel />
        </div>
      )}

      {/* Gestion des amis */}
      {showFriends && (
        <div
          className="absolute top-16 right-4 w-80 bg-gray-800 text-white p-4 rounded-xl shadow-2xl transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <FriendsManager />
        </div>
      )}
    </div>
  );
}
