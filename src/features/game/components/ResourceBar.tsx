import { Building2, Coins, Factory, Gem, Wallet } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';
import { useState } from 'react';

export function ResourceBar() {
  const resources = useGameStore((state) => state.resources);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!resources) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-12 top-1/2 -translate-y-1/2 bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-gray-700/90 transition-colors"
      >
        <Wallet className="w-6 h-6 text-yellow-500" />
      </button>

      <div 
        className={`bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <ResourceItem
            icon={<Coins className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />}
            value={resources.money}
            label="Or"
            color="from-yellow-500/20"
          />
          <ResourceItem
            icon={<Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />}
            value={resources.materials}
            label="Matériaux"
            color="from-blue-500/20"
          />
          <ResourceItem
            icon={<Factory className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />}
            value={resources.energy}
            label="Énergie"
            color="from-purple-500/20"
          />
          <ResourceItem
            icon={<Gem className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />}
            value={resources.tokens}
            label="Jetons"
            color="from-yellow-400/20"
          />
        </div>
      </div>
    </div>
  );
}

function ResourceItem({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  value: number; 
  label: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r ${color} to-transparent`}>
      {icon}
      <div>
        <div className="text-sm md:text-base font-bold text-white">
          {value?.toLocaleString() || '0'}
        </div>
        <div className="text-xs md:text-sm text-gray-300">
          {label}
        </div>
      </div>
    </div>
  );
}